import { format } from "date-fns";

import db from "@/lib/db";
import { CategoryColumn } from "./components/columns";
import { CategoryClient } from "./components/client";

const CategoriesPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const categories = await db.category.findMany({
        where: {
            storeId: params.storeId
        },
        include: {
            billboard: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedCategories: CategoryColumn[] = categories.map((item) => ({
        id: item.id,
        name: item.name,
        billboardLabel: item.billboard.label,
        createdAt: format(item.createdAt, "MMMM do, yyyy")

    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedCategories} />
            </div>
        </div>
    );
}

export default CategoriesPage;