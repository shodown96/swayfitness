import { NextResponse } from "next/server"
import { ERROR_MESSAGES } from "./constants/messages"
interface ConstructResponseProps {
    statusCode: 200 | 201 | 400 | 401 | 404 | 500,
    message?: string
    data?: Record<any, any>,
}
export const constructResponse = ({
    statusCode = 200,
    message = "",
    data = {},
}: ConstructResponseProps) => {
    const success = [200, 201].includes(statusCode)
    return NextResponse.json(
        {
            success: success,
            message: message || (success ? "Success" : ERROR_MESSAGES.BadRequestError),
            data,
        },
        { status: statusCode },
    )
}

export const paginateItems = ({
  page,
  pageSize,
  items,
  total,
}: {
  page: number;
  pageSize: number;
  items: any;
  total: number;
}) => {
  const totalPages = total ? Math.ceil(total / pageSize) : 0;
  const data: any = {
    items,
    pageSize,
    totalPages,
    currentPage: page,
    total: total,
  };
  return data;
};