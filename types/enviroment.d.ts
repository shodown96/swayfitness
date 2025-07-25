declare namespace NodeJS {
    interface ProcessEnv {
        DATABASE_URL: string; EMAIL_HOST;
        EMAIL_USER: string;
        EMAIL_FROM: string;
        EMAIL_PASSWORD: string;
        BREVO_API_KEY: string;
        EMAIL_CONTACT_ADDRESS: string;
        NEXT_PUBLIC_EMAIL_CONTACT_ADDRESS: string;
        NEXT_PUBLIC_REVIEW_LINK: string;
        ACCESS_TOKEN_SECRET: string;
        REFRESH_TOKEN_SECRET: string;
        HASH_ALGORITHM: string;
        DEBUG: string;
        GOOD_PASSWORD: string;
        PAYSTACK_SECRET_KEY: string;
        NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY: string;
        NEXT_PUBLIC_REGISTRATION_FEE: string;
    }
}