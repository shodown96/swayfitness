import "server-only"
import { ACCESS_TOKEN_NAME, verifyAccessToken } from "@/lib/auth";
import { CheckTokensResponse } from "@/types/auth";
import { cookies } from "next/headers";

export const checkTokens = async (): Promise<CheckTokensResponse> => {
    try {
        const cookieStore = await cookies();
        const accessToken = cookieStore.get(ACCESS_TOKEN_NAME);
        const decodedToken: any = await verifyAccessToken(accessToken?.value);
        return decodedToken as CheckTokensResponse
    } catch (error) {
        return null
    }
}