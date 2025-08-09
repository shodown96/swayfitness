import { usePathname, useRouter } from 'next/navigation';
import { useState } from 'react';

export interface Pagination {
    totalPages: number;
    currentPage: number;
    total: number;
}

interface APIQuery {
    pageSize: number,
    page: number,
    search: string,

    status?: string,
    plan?: string,
    type?: string
    interval?:string

}

function useAPIQuery() {
    const router = useRouter()
    const pathname = usePathname()

    const [query, setQuery] = useState<APIQuery>({
        pageSize: 25,
        page: 1,
        search: "",
    })
    const [pagination, setPagination] = useState<Pagination>({
        totalPages: 0,
        currentPage: 1,
        total: 0,
    })

    const setP = (values: Partial<Pagination>) => {
        const { totalPages = 0, currentPage = 1, total = 0, } = values
        setPagination({ ...pagination, totalPages, currentPage, total })
    }

    const setQ = (values: Partial<APIQuery>, refresh = false) => {
        const params = { ...query, ...values }
        setQuery(params)
    }

    return {
        query,
        setQuery: setQ,
        pagination,
        setPagination: setP
    }
}

export default useAPIQuery