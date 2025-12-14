/**
 * @jest-environment node
 */
import { POST } from '../../../app/api/auth/login/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import User from '../../../lib/models/User';
import dbConnect from '../../../lib/dbConnect';
import bcrypt from 'bcryptjs';

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

describe('Login API', () => {
    beforeAll(async () => {
        await dbConnect();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should login a user successfully and return a token', async () => {
        const password = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({ email: 'login@example.com', password: hashedPassword });

        const req = {
            json: jest.fn().mockResolvedValue({
                email: 'login@example.com',
                password: password,
            }),
        };

        const response = await POST(req);

        expect(response.status).toBe(200);
        expect(response.data.token).toBeDefined();
        expect(response.data.user.email).toBe('login@example.com');
    });

    it('should return 400 for invalid credentials (wrong password)', async () => {
        const password = 'password123';
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        await User.create({ email: 'login@example.com', password: hashedPassword });

        const req = {
            json: jest.fn().mockResolvedValue({
                email: 'login@example.com',
                password: 'wrongpassword',
            }),
        };

        const response = await POST(req);
        expect(response.status).toBe(401); // Or 400
        expect(response.data.error).toBeDefined();
    });

    it('should return 400 if user not found', async () => {
        const req = {
            json: jest.fn().mockResolvedValue({
                email: 'nonexistent@example.com',
                password: 'password123',
            }),
        };

        const response = await POST(req);
        expect(response.status).toBe(400); // User not found
    });
});
