/**
 * @jest-environment node
 */
import { POST } from '../app/api/sweets/route';
// Mock NextResponse
jest.mock('next/server', () => {
    return {
        NextResponse: {
            json: jest.fn(),
        },
    };
});

describe('Debug Route', () => {
    it('should load POST', () => {
        expect(POST).toBeDefined();
    });
});
