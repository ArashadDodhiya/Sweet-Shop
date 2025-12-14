import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Sweet from '../../../../../lib/models/Sweet';
import { verifyAuth } from '../../../../../lib/auth';

export async function POST(request, { params }) {
    try {
        const p = await params;
        await dbConnect();

        // Purchase requires login
        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { id } = p;
        const { quantity } = await request.json();

        if (!quantity || quantity <= 0) {
            return NextResponse.json({ error: 'Invalid quantity' }, { status: 400 });
        }

        const sweet = await Sweet.findById(id);
        if (!sweet) {
            return NextResponse.json({ error: 'Sweet not found' }, { status: 404 });
        }

        if (sweet.quantity < quantity) {
            return NextResponse.json({ error: 'Insufficient stock' }, { status: 400 });
        }

        sweet.quantity -= quantity;
        await sweet.save();

        return NextResponse.json({ message: 'Purchase successful', sweet }, { status: 200 });
    } catch (error) {
        console.error('Purchase Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
