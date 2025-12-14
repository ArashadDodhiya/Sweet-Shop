/**
 * @jest-environment node
 */
import { POST, GET } from '../../../app/api/sweets/route';
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

describe('Sweets API', () => {
    beforeAll(async () => {
        await dbConnect();
    });

    afterEach(async () => {
        await Sweet.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    describe('POST /api/sweets', () => {
        it('should create a sweet if user is admin', async () => {
            const token = await generateToken({ userId: '123', role: 'admin' });
            const sweetData = {
                name: 'Laddu',
                category: 'Traditional',
                price: 10,
                quantity: 50
            };

            const req = {
                json: jest.fn().mockResolvedValue(sweetData),
                headers: {
                    get: jest.fn().mockReturnValue(`Bearer ${token}`)
                }
            };

            const response = await POST(req);
            expect(response.status).toBe(201);
            expect(response.data.sweet.name).toBe('Laddu');
        });

        it('should return 401 if no token provided', async () => {
            const req = {
                json: jest.fn().mockResolvedValue({}),
                headers: {
                    get: jest.fn().mockReturnValue(null)
                }
            };
            const response = await POST(req);
            expect(response.status).toBe(401);
        });

        it('should return 403 if user is not admin', async () => {
            const token = await generateToken({ userId: '123', role: 'user' });
            const req = {
                json: jest.fn().mockResolvedValue({}),
                headers: {
                    get: jest.fn().mockReturnValue(`Bearer ${token}`)
                }
            };
            const response = await POST(req);
            expect(response.status).toBe(403);
        });
    });

    describe('GET /api/sweets', () => {
        it('should return a list of sweets', async () => {
            await Sweet.create({
                name: 'Gulab Jamun',
                category: 'Syrup',
                price: 20,
                quantity: 100
            });

            const req = {};
            const response = await GET(req);

            expect(response.status).toBe(200);
            expect(response.data.sweets.length).toBeGreaterThan(0);
            expect(response.data.sweets[0].name).toBe('Gulab Jamun');
        });
    });
});
