import { NextResponse } from 'next/server';
import dbConnect from '../../../../../lib/dbConnect';
import Sweet from '../../../../../lib/models/Sweet';
import { verifyAuth } from '../../../../../lib/auth';

export async function POST(request, { params }) {
    try {
        const p = await params;
        await dbConnect();

        // Restock requires Admin
        const user = await verifyAuth(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
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

        sweet.quantity += quantity;
        await sweet.save();

        return NextResponse.json({ message: 'Restock successful', sweet }, { status: 200 });
    } catch (error) {
        console.error('Restock Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
