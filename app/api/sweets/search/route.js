import { NextResponse } from 'next/server';
import dbConnect from '../../../../lib/dbConnect';
import Sweet from '../../../../lib/models/Sweet';

export async function GET(request) {
    try {
        await dbConnect();
        const { searchParams } = new URL(request.url);
        const q = searchParams.get('q');
        const category = searchParams.get('category');

        let query = {};

        if (q) {
            query.$or = [
                { name: { $regex: q, $options: 'i' } },
                { description: { $regex: q, $options: 'i' } }
            ];
        }

        if (category) {
            query.category = category;
        }

        const sweets = await Sweet.find(query);
        return NextResponse.json({ sweets }, { status: 200 });
    } catch (error) {
        console.error('Search Sweets Error:', error);
        return NextResponse.json(
            { error: 'Internal Server Error' },
            { status: 500 }
        );
    }
}
