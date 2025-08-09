import React, { ReactNode } from 'react'
import { TableCell, TableRow } from '../ui/table'
interface TableSkeletonProps {
    loading: boolean;
    rows?: number;
    columns?: number;
    children: ReactNode | ReactNode[]
}
export default function TableSkeleton({ loading = false, rows = 5, columns = 7, children }: TableSkeletonProps) {
    if (!loading) return children;
    return (
        <>
            {Array.from({ length: rows }).map((_, i) => (
                <TableRow key={i}>
                    {Array.from({ length: columns }).map((_, j) => (
                        <TableCell className="animate-pulse" key={j}>
                            <div className="h-4 bg-gray-200 rounded w-24"></div>
                        </TableCell>
                    ))}
                </TableRow>
            ))}
        </>
    )
}
