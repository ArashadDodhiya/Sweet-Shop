/**
 * @jest-environment node
 */
import { PUT, DELETE } from '../../../app/api/sweets/[id]/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Sweet from '../../../lib/models/Sweet';
import dbConnect from '../../../lib/dbConnect';
import { SignJWT } from 'jose';

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

async function generateToken(payload) {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET || 'secret');
    return await new SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1h')
        .sign(secret);
}

describe('Sweet ID API (PUT/DELETE)', () => {
    let sweetId;

    beforeAll(async () => {
        await dbConnect();
    });

    beforeEach(async () => {
        const sweet = await Sweet.create({
            name: 'Original Sweet',
            category: 'Test',
            price: 10,
            quantity: 10
        });
        sweetId = sweet._id.toString();
    });

    afterEach(async () => {
        await Sweet.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('PUT /api/sweets/[id]', () => {
        it('should update a sweet if admin', async () => {
            const token = await generateToken({ userId: '123', role: 'admin' });
            const req = {
                json: jest.fn().mockResolvedValue({ price: 20 }),
                headers: {
                    get: jest.fn().mockReturnValue(`Bearer ${token}`)
                }
            };
            const params = { params: { id: sweetId } };

            const response = await PUT(req, params);
            expect(response.status).toBe(200);
            expect(response.data.sweet.price).toBe(20);
        });

        it('should return 403 if user', async () => {
            const token = await generateToken({ userId: '123', role: 'user' });
            const req = {
                json: jest.fn().mockResolvedValue({ price: 20 }),
                headers: {
                    get: jest.fn().mockReturnValue(`Bearer ${token}`)
                }
            };
            const params = { params: { id: sweetId } };

            const response = await PUT(req, params);
            expect(response.status).toBe(403);
        });
    });

    describe('DELETE /api/sweets/[id]', () => {
        it('should delete a sweet if admin', async () => {
            const token = await generateToken({ userId: '123', role: 'admin' });
            const req = {
                headers: {
                    get: jest.fn().mockReturnValue(`Bearer ${token}`)
                }
            };
            const params = { params: { id: sweetId } };

            const response = await DELETE(req, params);
            expect(response.status).toBe(200);

            const found = await Sweet.findById(sweetId);
            expect(found).toBeNull();
        });
    });
});
