/**
 * @jest-environment node
 */
import mongoose from 'mongoose';
import User from '../../lib/models/User';
import dbConnect from '../../lib/dbConnect';

describe('User Model', () => {
    beforeAll(async () => {
        await dbConnect();
    });

    afterEach(async () => {
        await User.deleteMany({});
    });

    afterAll(async () => {
        await mongoose.connection.close();
    });

    it('should create a user successfully', async () => {
        const userData = {
            email: 'test@example.com',
            password: 'password123',
        };
        const user = await User.create(userData);
        expect(user.email).toBe(userData.email);
        expect(user.role).toBe('user'); // Default role
    });

    it('should fail if email is missing', async () => {
        try {
            await User.create({ password: 'password123' });
        } catch (error) {
            expect(error.errors.email).toBeDefined();
        }
    });

    it('should fail if password is missing', async () => {
        try {
            await User.create({ email: 'test@example.com' });
        } catch (error) {
            expect(error.errors.password).toBeDefined();
        }
    });

    it('should enforce enum on role', async () => {
        try {
            await User.create({
                email: 'test@example.com',
                password: 'password123',
                role: 'superadmin' // Invalid role
            });
        } catch (error) {
            expect(error.errors.role).toBeDefined();
        }
    });

    it('should not allow duplicate emails', async () => {
        await User.create({ email: 'test@example.com', password: 'password123' });
        try {
            await User.create({ email: 'test@example.com', password: 'newpassword' });
        } catch (error) {
            expect(error.code).toBe(11000); // Duplicate key error code
        }
    });
});
