import { FullAccount } from "./account";

export interface CheckAuthResponse {
    isAuthenticated: boolean;
    user?: FullAccount
}
export type CheckTokensResponse = {
    accountId?: string | null;
} | null