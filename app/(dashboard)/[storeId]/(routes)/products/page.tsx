import { format } from "date-fns";

import db from "@/lib/db";
import { formatter } from "@/lib/utils";

import { ProductClient } from "./components/client";
import { ProductColumn } from "./components/columns";

const ProductsPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const products = await db.product.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            category: true,
            subcategory: true,
            size: true,
            color: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedProducts: ProductColumn[] = products.map((item) => ({
        id: item.id,
        name: item.name,
        description: item.description,
        isFeatured: item.isFeatured,
        isArchived: item.isArchived,
        price: formatter.format(item.price.toNumber()),
        category: item.category.name,
        subcategory: item.subcategory.name,
        size: item.size.name,
        color: item.color.value,
        createdAt: format(item.createdAt, "MMMM do, yyyy")

    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <ProductClient data={formattedProducts} />
            </div>
        </div>
    );
}

export default ProductsPage;