import db from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        const body = await req.json();
        const { label, imageUrl } = body;

        // if (!label) return new NextResponse("Label is required", { status: 400 });

        if (!imageUrl) return new NextResponse("Image is required", { status: 400 });

        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 });

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const billboard = await db.billboard.updateMany({
            where: {
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_PATCH]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function DELETE(_req: Request,
    { params }: { params: { storeId: string, billboardId: string } }
) {
    try {
        const { userId } = auth();

        if (!userId) return new NextResponse("Unauthenticated", { status: 401 });

        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 });

        const storeByUserId = await db.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if (!storeByUserId) return new NextResponse("Unauthorized", { status: 403 });

        const billboard = await db.billboard.delete({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_DELETE]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};

export async function GET(_req: Request,
    { params }: { params: { billboardId: string } }
) {
    try {

        if (!params.billboardId) return new NextResponse("Billboard ID is required", { status: 400 });

        const billboard = await db.billboard.findUnique({
            where: {
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);
    } catch (error) {
        console.log("[BILLBOARD_GET]", error);
        return new NextResponse("Internal error", { status: 500 });
    }
};