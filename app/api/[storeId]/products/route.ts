import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const subcategoryId = searchParams.get("subcategoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if (!params.storeId) return new NextResponse("Store is required", { status: 400 });

        const products = await db.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                subcategoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            include: {
                images: true,
                category: true,
                subcategory: true,
                color: true,
                size: true
            },
            orderBy: {
                createdAt: "desc"
            }
        });

        return NextResponse.json(products);
    } catch (error) {
        console.log("[PRODUCTS_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
) {
    try {
        const body = await req.json();
        const { userId } = auth();
        const { name, description, price, categoryId, subcategoryId, colorId, sizeId, images, isFeatured, isArchived } = body;

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!name) return new NextResponse("Name is required", { status: 400 });

        if (!price) return new NextResponse("Price is required", { status: 400 });

        if (!categoryId) return new NextResponse("Category is required", { status: 400 });

        if (!subcategoryId) return new NextResponse("Subcategory is required", { status: 400 });

        if (!colorId) return new NextResponse("Color is required", { status: 400 });

        if (!sizeId) return new NextResponse("Size is required", { status: 400 });

        if (!images || !images.length) return new NextResponse("Images is required", { status: 400 });

        if (!params.storeId) return new NextResponse("Store is required", { status: 400 });

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const product = await db.product.create({
            data: {
                name,
                description,
                price,
                isFeatured,
                isArchived,
                categoryId,
                subcategoryId,
                colorId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                },
            },
        });

        return NextResponse.json(product);
    } catch (error) {
        console.log("[PRODUCTS_POST]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};
