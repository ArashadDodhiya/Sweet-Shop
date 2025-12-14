import { NextResponse } from 'next/server';
import dbConnect from '../../../lib/dbConnect';
import Sweet from '../../../lib/models/Sweet';
import { verifyAuth } from '../../../lib/auth';

export async function POST(request) {
    try {
        await dbConnect();

        const user = await verifyAuth(request);
        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (user.role !== 'admin') {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        const body = await request.json();
        const sweet = await Sweet.create(body);

        return NextResponse.json({ sweet }, { status: 201 });
    } catch (error) {
        console.error('Create Sweet Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}

export async function GET(request) {
    try {
        await dbConnect();
        const sweets = await Sweet.find({});
        return NextResponse.json({ sweets }, { status: 200 });
    } catch (error) {
        console.error('List Sweets Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
