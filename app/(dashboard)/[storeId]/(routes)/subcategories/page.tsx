import { format } from "date-fns";

import db from "@/lib/db";
import { SubCategoryColumn } from "./components/columns";
import { CategoryClient } from "./components/client";

const SubCategoriesPage = async ({
    params
}: {
    params: { storeId: string }
}) => {
    const subCategories = await db.subcategory.findMany({
        where: {
            category: {
                storeId: params.storeId
            }
        },
        include: {
            category: true
        },
        orderBy: {
            createdAt: "desc"
        }
    });

    const formattedSubCategories: SubCategoryColumn[] = subCategories.map((item) => ({
        id: item.id,
        name: item.name,
        categoryName: item.category.name,
        createdAt: format(item.createdAt, "MMMM do, yyyy")
    }))

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <CategoryClient data={formattedSubCategories} />
            </div>
        </div>
    );
}

export default SubCategoriesPage;
