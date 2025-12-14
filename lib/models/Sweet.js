import mongoose from 'mongoose';

const SweetSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for the sweet'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    category: {
        type: String,
        required: [true, 'Please provide a category'],
        enum: {
            values: ['Ladoo', 'Barfi', 'Halwa', 'Syrup-based', 'Dry Fruit', 'Chocolates', 'Other'],
            message: '{VALUE} is not a supported category',
        },
    },
    price: {
        type: Number,
        required: [true, 'Please provide a price'],
        min: [0, 'Price must be positive'],
    },
    quantity: {
        type: Number,
        required: [true, 'Please provide a quantity'],
        min: [0, 'Quantity cannot be negative'],
    },
    description: {
        type: String,
    },
    image: {
        type: String, // URL or path
    },
});

export default mongoose.models.Sweet || mongoose.model('Sweet', SweetSchema);
