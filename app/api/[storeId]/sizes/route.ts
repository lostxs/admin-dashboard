import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();
        const { userId } = auth();
        const { name, value } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (!value) return new NextResponse("Value is required", { status: 400 });

        if (!params.storeId) return new NextResponse("Store is required", { status: 400 });

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const size = await db.size.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });

        return NextResponse.json(size);
    } catch (error) {
        console.log("[SIZES_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) return new NextResponse("Store is required", { status: 400 });

        const sizes = await db.size.findMany({
            where: {
                storeId: params.storeId
            }
        });

        return NextResponse.json(sizes);
    } catch (error) {
        console.log("[SIZES_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};