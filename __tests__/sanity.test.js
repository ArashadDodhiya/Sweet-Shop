/**
 * @jest-environment jsdom
 */

describe('Sanity Check', () => {
    it('should have window defined', () => {
        expect(window).toBeDefined();
    });
    it('should have TextEncoder defined', () => {
        expect(new TextEncoder()).toBeDefined();
    });
});
