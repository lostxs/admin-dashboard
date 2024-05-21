import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,
    { params }: { params: { storeId: string, subcategoryId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        const body = await req.json();
        const { name, categoryId } = body;

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (!categoryId) return new NextResponse("Category is required", { status: 400 });

        if (!params.subcategoryId) return new NextResponse("SubCategory ID is required", { status: 400 });

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const sybcategory = await db.subcategory.updateMany({
            where: {
                id: params.subcategoryId,
            },
            data: {
                name,
                categoryId
            }
        });

        return NextResponse.json(sybcategory);
    } catch (error) {
        console.log("[CATEGORY_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(_req: Request,
    { params }: { params: { storeId: string, subcategoryId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!params.subcategoryId) return new NextResponse("SubCategory ID is required", { status: 400 });

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const subcategory = await db.subcategory.delete({
            where: {
                id: params.subcategoryId,
            }
        });

        return NextResponse.json(subcategory);
    } catch (error) {
        console.log("[CATEGORY_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(_req: Request,
    { params }: { params: { subcategoryId: string } }
) {
    try {

        if (!params.subcategoryId) return new NextResponse("Category ID is required", { status: 400 });

        const subcategory = await db.subcategory.findUnique({
            where: {
                id: params.subcategoryId,
            },
            include: {
                category: true
            }
        });

        return NextResponse.json(subcategory);
    } catch (error) {
        console.log("[CATEGORY_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};