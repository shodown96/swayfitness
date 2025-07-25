import { FullAccount } from "./account";

export interface SignInResponse {
    user: FullAccount | null;
    accessToken: string
}

export interface GetMemberResponse {
    member: FullAccount | null;
}

export interface GetManageSubscriptionLinkResponse {
    link: string;
}
