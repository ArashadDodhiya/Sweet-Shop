/**
 * @jest-environment node
 */
import { POST as purchasePOST } from '../../../app/api/sweets/[id]/purchase/route';
import { POST as restockPOST } from '../../../app/api/sweets/[id]/restock/route';
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

describe('Inventory API', () => {
    let sweetId;

    beforeAll(async () => {
        await dbConnect();
    });

    beforeEach(async () => {
        const sweet = await Sweet.create({
            name: 'Inventory Sweet',
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

    describe('POST /purchase', () => {
        it('should decrease quantity', async () => {
            const token = await generateToken({ userId: '123', role: 'user' });
            const req = {
                json: jest.fn().mockResolvedValue({ quantity: 2 }),
                headers: {
                    get: jest.fn().mockReturnValue(`Bearer ${token}`)
                }
            };
            const params = { params: { id: sweetId } };

            const response = await purchasePOST(req, params);
            expect(response.status).toBe(200);
            expect(response.data.sweet.quantity).toBe(8);
        });

        it('should fail if insufficient stock', async () => {
            const token = await generateToken({ userId: '123', role: 'user' });
            const req = {
                json: jest.fn().mockResolvedValue({ quantity: 15 }),
                headers: {
                    get: jest.fn().mockReturnValue(`Bearer ${token}`)
                }
            };
            const params = { params: { id: sweetId } };

            const response = await purchasePOST(req, params);
            expect(response.status).toBe(400);
            expect(response.data.error).toMatch(/Insufficient/);
        });
    });

    describe('POST /restock', () => {
        it('should increase quantity if admin', async () => {
            const token = await generateToken({ userId: '123', role: 'admin' });
            const req = {
                json: jest.fn().mockResolvedValue({ quantity: 5 }),
                headers: {
                    get: jest.fn().mockReturnValue(`Bearer ${token}`)
                }
            };
            const params = { params: { id: sweetId } };

            const response = await restockPOST(req, params);
            expect(response.status).toBe(200);
            expect(response.data.sweet.quantity).toBe(15);
        });
    });
});
