"use client"

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/ui/data-table";
import { ApiList } from "@/components/ui/api-list";
import { SubCategoryColumn, columns } from "./columns";

interface CategoryClientProps {
    data: SubCategoryColumn[]
}

export const CategoryClient: React.FC<CategoryClientProps> = ({
    data
}) => {
    const router = useRouter();
    const params = useParams();

    return (
        <>
            <div className="flex items-center justify-between">
                <Heading
                    title={`SubCategories (${data.length})`}
                    description="Manage SubCategories for Your Store"
                />
                <Button onClick={() => router.push(`/${params.storeId}/subcategories/new`)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add New
                </Button>
            </div>
            <Separator />
            <DataTable searchKey="name" columns={columns} data={data} />
            <Heading title="API" description="API Calls for Subcategories" />
            <Separator />
            <ApiList entityName="subcategories" entityIdName="subcategoryId" />
        </>
    );
}