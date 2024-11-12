import { NextResponse } from 'next/server'

//const DATA_SOURCE_URL = "127.0.0.1:5001"

export async function GET() {

    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/categories`, { cache: 'no-store'})

    const categories = await res.json()

    return NextResponse.json(categories)
}