
import { disableSubscription } from "@/actions/paystack/disable-subscription";
import { syncCreatedSubscription } from "@/actions/paystack/sync-created-subscription";
import { ChargeSuccessEventData, SubscriptionCreatedData, SubscriptionDisabledEventData } from "@/types/paystack";
import { NextRequest, NextResponse } from "next/server";

const verifyPaystackTransaction = async (eventData: any, signature: any) => {
    // const hmac = crypto.createHmac('sha512', `${process.env.PAYSTACK_API_SECRET_KEY}`);
    // const expectedSignature = hmac.update(JSON.stringify(eventData)).digest('hex');
    const secret = String(process.env.PAYSTACK_API_SECRET_KEY);
    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
        'raw',
        encoder.encode(secret),
        { name: 'HMAC', hash: 'SHA-512' },
        false,
        ['sign']
    );

    const sig = await crypto.subtle.sign(
        'HMAC',
        key,
        encoder.encode(JSON.stringify(eventData))
    );

    const expectedSignature = Array.from(new Uint8Array(sig))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
    return expectedSignature === signature;
}

export async function POST(req: NextRequest) {

    const eventData: any = req.body;
    const signature = req.headers.get('x-paystack-signature');

    if (!eventData || !verifyPaystackTransaction(eventData, signature)) {
        console.log("verifyPaystackTransaction error")
        return new NextResponse(JSON.stringify({ error: "Invalid event type" }), {
            headers: { "Content-Type": "application/json" },
            status: 400,
        });
    }
    console.log("eventData", eventData)
    if (eventData.event === 'charge.success') {
        const data: ChargeSuccessEventData = eventData.data
        // const synced = await syncSuccessfulCharge(data)
        // if (synced) {
        //     return new NextResponse(JSON.stringify({ synced }), {
        //         headers: { "Content-Type": "application/json" },
        //         status: 200,
        //     });
        // }
        await syncSuccessfulCharge(data)
    }
    // subscription.not_renew
    // subscription.expiring_cards
    // subscription.disable
    if (eventData.event === 'subscription.disable') {
        const data: SubscriptionDisabledEventData = eventData.data
        const synced = await disableSubscription(data)
        if (synced) {
            return new NextResponse(JSON.stringify({ synced }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }
    }
    if (eventData.event === 'subscription.create') {
        const data: SubscriptionCreatedData = eventData.data
        const synced = await syncCreatedSubscription(data)
        if (synced) {
            return new NextResponse(JSON.stringify({ synced }), {
                headers: { "Content-Type": "application/json" },
                status: 200,
            });
        }
    }

    return new NextResponse(JSON.stringify({ error: "Invalid event type" }), {
        headers: { "Content-Type": "application/json" },
        status: 400,
    });
}


const syncSuccessfulCharge = async (data: ChargeSuccessEventData) => { }