/**
 * @jest-environment node
 */
import dbConnect from '../lib/dbConnect';

describe('Debug DB', () => {
    it('should load dbConnect', () => {
        expect(dbConnect).toBeDefined();
    });
});
