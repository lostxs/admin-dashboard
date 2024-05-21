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

        const { name, categoryId } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (!params.storeId) return new NextResponse("Store is required", { status: 400 });

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const subcategory = await db.subcategory.create({
            data: {
                name,
                categoryId,
            }
        });

        return NextResponse.json(subcategory);
    } catch (error) {
        console.log("[SUBCATEGORIES_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        if (!params.storeId) return new NextResponse("Store is required", { status: 400 });

        const categories = await db.category.findMany({
            where: {
                storeId: params.storeId
            },
            select: {
                id: true
            }
        });

        const categoryIds = categories.map(category => category.id);

        const subcategories = await db.subcategory.findMany({
            where: {
                categoryId: {
                    in: categoryIds
                }
            }
        });

        return NextResponse.json(subcategories);
    } catch (error) {
        console.log("[SUBCATEGORIES_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};