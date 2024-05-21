"use client"

import { ColumnDef } from "@tanstack/react-table"
import { CellAction } from "./cell-action"
import Image from "next/image"

export type BillboardColumn = {
    id: string
    label: string
    createdAt: string
    imageUrl: string
}

export const columns: ColumnDef<BillboardColumn>[] = [
    {
        accessorKey: "imageUrl",
        header: "Image",
        cell: ({ row }) => (
            <Image src={row.original.imageUrl} alt={row.original.label} height={100} width={100} className="w-25 h-25 object-cover rounded" />
        ),
    },
    {
        accessorKey: "label",
        header: "Label",
    },
    {
        accessorKey: "createdAt",
        header: "Date",
    },
    {
        id: "actions",
        cell: ({ row }) => <CellAction data={row.original} />
    }
]
