/**
 * @jest-environment node
 */
import { verifyAuth } from '../lib/auth';

describe('Debug Auth', () => {
    it('should load verifyAuth', () => {
        expect(verifyAuth).toBeDefined();
    });
});
