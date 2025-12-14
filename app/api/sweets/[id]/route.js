import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Sweet from '../../../../lib/models/Sweet';
import { verifyAuth } from '../../../../lib/auth';

export async function PUT(request, { params }) {
    try {
        const p = await params;
        await dbConnect();

        const user = await verifyAuth(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = p;
        const body = await request.json();
        const sweet = await Sweet.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!sweet) {
            return NextResponse.json({ error: 'Sweet not found' }, { status: 404 });
        }

        return NextResponse.json({ sweet }, { status: 200 });
    } catch (error) {
        console.error('Update Sweet Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function DELETE(request, { params }) {
    try {
        const p = await params;
        await dbConnect();

        const user = await verifyAuth(request);
        if (!user || user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const { id } = p;
        const deletedSweet = await Sweet.findByIdAndDelete(id);

        if (!deletedSweet) {
            return NextResponse.json({ error: 'Sweet not found' }, { status: 404 });
        }

        return NextResponse.json({ message: 'Sweet deleted' }, { status: 200 });
    } catch (error) {
        console.error('Delete Sweet Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
