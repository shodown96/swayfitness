import fs from "fs";
import axios from 'axios';
import nodemailer from 'nodemailer';
import { originURL } from '@/lib/constants/paths';
import { APP_NAME } from "@/lib/constants/app";

const pathKVP = {
    contact: '/templates/contact.html',
    welcome: '/templates/welcome.html',
    otp: '/templates/otp.html',
    newAdmin: '/templates/new-admin.html',
    changedPassword: '/templates/changed-password.html'
}

type PathKVPType = keyof typeof pathKVP


const fetchHTML = async (url: string) => {
    const result = await axios.get(`${originURL}${url}`)
    return result.data
}


interface HTMLEmailProps {
    email?: string,
    subject: string,
    params: Record<string, string>,
    emailType: PathKVPType
}


export class EmailService {
    static sendAPIEmail = async ({ email, subject, message, html }: {
        email: string, subject: string, message?: string, html?: string
    }) => {
        const result = await axios.post("https://api.brevo.com/v3/smtp/email", {
            sender: { name: APP_NAME, email: process.env.EMAIL_FROM },
            to: [{ email }],
            subject,
            htmlContent: html
        }, {
            // auth: {
            //     username: String(process.env.EMAIL_USER),
            //     password: String(process.env.EMAIL_PASSWORD),
            // }
            headers: {
                "api-key": process.env.BREVO_API_KEY
            }
        })
        console.log("result.status", result.status)
        return result.status === 201
    }

    static sendHTML = async ({
        email = String(process.env.EMAIL_CONTACT_ADDRESS),
        subject,
        params,
        emailType,
    }: HTMLEmailProps) => {
        let htmlTemplate = "";
        if (process.env.DEBUG === "true") {
            const filePath = `public${pathKVP[emailType]}`
            htmlTemplate = fs.readFileSync(filePath, "utf-8");
        } else {
            htmlTemplate = await fetchHTML(pathKVP[emailType]);
        }

        // Replace template placeholders with dynamic data
        const fullParams: any = { ...params, appName: APP_NAME }
        const filledTemplate = htmlTemplate.replace(/{{(\w+)}}/g, (match: string, p1: string) => {
            return fullParams[p1] || match;
        });
        try {
            const transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST,
                port: 587,
                secure: false,
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            const sent = await transporter.sendMail({
                from: `${APP_NAME} <${process.env.EMAIL_FROM}>`,
                to: email,
                subject: subject,
                html: filledTemplate,
            });
            if (sent) {
                if (process.env.NODE_ENV === 'development') {
                    console.log('[email]: Email sent sucessfully!');
                }
                return true
            }
        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
                console.log('[email]: Email not sent!', error);
            }
            return false
        }
    };
}