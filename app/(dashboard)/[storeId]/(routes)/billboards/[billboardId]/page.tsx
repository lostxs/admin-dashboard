import db from "@/lib/db";
import { BillboardForm } from "./components/billboard-form";

const BillboardPage = async ({
    params
}: {
    params: { billboardId: string }
}) => {
    const billboard = await db.billboard.findUnique({
        where: {
            id: params.billboardId
        }
    });

    return (
        <div className="flex-col">
            <div className="flex-1 space-y-4 p-8 pt-6">
                <BillboardForm initialData={billboard}/>
            </div>
        </div>
    );
}

export default BillboardPage;