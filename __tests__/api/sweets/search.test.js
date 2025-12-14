/**
 * @jest-environment node
 */
import { GET } from '../../../app/api/sweets/search/route';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Sweet from '../../../lib/models/Sweet';
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

describe('Search API', () => {
    beforeAll(async () => {
        await dbConnect();
    });

    afterEach(async () => {
        await Sweet.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should search sweets by name', async () => {
        await Sweet.create([
            { name: 'Kaju Katli', category: 'Burfi', price: 25, quantity: 100 },
            { name: 'Rasgulla', category: 'Syrup', price: 15, quantity: 50 },
        ]);

        const req = {
            nextUrl: {
                searchParams: new URLSearchParams({ q: 'Kaju' })
            }
        };

        const response = await GET(req);

        expect(response.status).toBe(200);
        expect(response.data.sweets).toHaveLength(1);
        expect(response.data.sweets[0].name).toBe('Kaju Katli');
    });

    it('should search sweets by category', async () => {
        await Sweet.create([
            { name: 'Kaju Katli', category: 'Burfi', price: 25, quantity: 100 },
            { name: 'Besan Burfi', category: 'Burfi', price: 10, quantity: 50 },
            { name: 'Rasgulla', category: 'Syrup', price: 15, quantity: 50 },
        ]);

        const req = {
            nextUrl: {
                searchParams: new URLSearchParams({ category: 'Burfi' })
            }
        };

        const response = await GET(req);

        expect(response.status).toBe(200);
        expect(response.data.sweets).toHaveLength(2);
    });
});
