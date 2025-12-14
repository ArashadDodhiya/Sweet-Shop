/**
 * @jest-environment node
 */
import { POST } from '../../../app/api/auth/register/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../lib/models/User';
import dbConnect from '../../../lib/dbConnect';

// Mock NextResponse
jest.mock('next/server', () => {
    const originalModule = jest.requireActual('next/server');
    return {
        ...originalModule,
        NextResponse: {
            json: jest.fn((data, options) => ({ data, status: options?.status || 200 })),
        },
    };
});

describe('Register API', () => {
    beforeAll(async () => {
        await dbConnect();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should register a new user successfully', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                email: 'newuser@example.com',
                password: 'password123',
            }),
        };

        const response = await POST(req);

        expect(response.status).toBe(201);
        expect(response.data.message).toBe('User created successfully');

        const user = await User.findOne({ email: 'newuser@example.com' });
        expect(user).toBeTruthy();
        // Password should be hashed, not plain text (we'll verify this implementation detail)
        expect(user.password).not.toBe('password123');
    });

    it('should return 400 if user already exists', async () => {
        await User.create({ email: 'existing@example.com', password: 'password123' });

        const req = {
            json: jest.fn().mockResolvedValue({
                email: 'existing@example.com',
                password: 'newpassword',
            }),
        };

        const response = await POST(req);
        expect(response.status).toBe(400);
        expect(response.data.error).toBe('User already exists');
    });

    it('should return 400 for validation errors', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                // Missing email and password
            }),
        };

        const response = await POST(req);
        // Either 400 or schema validation error
        expect([400, 422]).toContain(response.status);
    });
});
