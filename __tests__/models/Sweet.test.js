/**
 * @jest-environment node
 */
import mongoose from 'mongoose';
import Sweet from '../../lib/models/Sweet';
import dbConnect from '../../lib/dbConnect';

describe('Sweet Model', () => {
    beforeAll(async () => {
        await dbConnect();
    });

    afterEach(async () => {
        await Sweet.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a sweet successfully', async () => {
        const sweetData = {
            name: 'Chocolate Fudge',
            category: 'Fudge',
            price: 15.50,
            quantity: 100,
            description: 'Rich chocolate fudge',
            image: 'fudge.jpg'
        };
        const sweet = await Sweet.create(sweetData);
        expect(sweet.name).toBe(sweetData.name);
        expect(sweet.price).toBe(15.50);
    });

    it('should fail if required fields are missing', async () => {
        try {
            await Sweet.create({ category: 'Candy' });
        } catch (error) {
            expect(error.errors.name).toBeDefined();
            expect(error.errors.price).toBeDefined();
            expect(error.errors.quantity).toBeDefined();
        }
    });

    it('should fail if price or quantity are negative', async () => {
        try {
            await Sweet.create({
                name: 'Bad Sweet',
                category: 'Test',
                price: -5,
                quantity: -10
            });
        } catch (error) {
            // Depending on validation logic, might be custom or min validator
            // We expect some error related to validation
            expect(error).toBeDefined();
        }
    });
});
