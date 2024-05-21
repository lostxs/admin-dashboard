import db from "@/lib/db";
import { SubCategoryForm } from "./components/category-form";

const SubCategoryPage = async ({
    params
}: {
    params: { subcategoryId: string, storeId: string }
}) => {
    const subCategory = await db.subcategory.findUnique({
        where: {
            id: params.subcategoryId
        },
        include: {
            category: true
        }
    });

    const categories = await db.category.findMany({
        where: {
            storeId: params.storeId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <SubCategoryForm initialData={subCategory} categories={categories}/>
            </div>
        </div>
    );
}

export default SubCategoryPage;