import { PlanInterval } from "@prisma/client";

export interface PaystackConfig {
  secretKey: string;
  publicKey: string;
  baseURL?: string;
}

export interface PaystackCustomer {
  email: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}

export interface PaystackPlan {
  name: string;
  amount: number; // In kobo
  interval: PlanInterval;
  description?: string;
  currency?: string;
}

export interface PaystackTransaction {
  email: string;
  amount: number; // In kobo
  currency?: string;
  reference?: string;
  callback_url?: string;
  plan?: string;
  invoice_limit?: number;
  metadata?: Record<string, any>;
  channels?: string[];
  split_code?: string;
  subaccount?: string;
  transaction_charge?: number;
  bearer?: string;
}

export interface PaystackSubscription {
  customer: string;
  plan: string;
  authorization?: string;
  start_date?: string;
}

export interface PaystackWebhookEvent {
  event: string;
  data: any;
}

export interface PaystackVerifiedTransaction {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    reference: string;
    receipt_number?: any;
    amount: number;
    message: string;
    gateway_response: string;
    paid_at: string;
    created_at: string;
    channel: string;
    currency: string;
    ip_address: string;
    metadata: Metadata;
    log: {
      start_time: number;
      time_spent: number;
      attempts: number;
      authentication: string;
      errors: number;
      success: boolean;
      mobile: boolean;
      input: any[];
      history: any[];
    };
    fees: number;
    fees_split?: any;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name?: any;
      receiver_bank_account_number?: any;
      receiver_bank?: any;
    };
    customer: {
      id: number;
      first_name: string;
      last_name: string;
      email: string;
      customer_code: string;
      phone: string;
      metadata?: any;
      risk_action: string;
      international_format_phone?: any;
    };
    plan: string;
    split: Split;
    order_id?: any;
    paidAt: string;
    createdAt: string;
    requested_amount: number;
    pos_transaction_data?: any;
    source?: any;
    fees_breakdown?: any;
    connect?: any;
    transaction_date: string;
    plan_object: {
      id: number;
      name: string;
      plan_code: string;
      description?: any;
      amount: number;
      interval: string;
      send_invoices: boolean;
      send_sms: boolean;
      currency: string;
    };
    subaccount: Split;
  };
}
interface Split { }
interface Metadata {
  reference: string;
  custom_fields: Customfield[];
}
interface Customfield {
  display_name: string;
  variable_name: string;
  value: string;
}


export interface CreatedPaystackSubscription {
  status: boolean;
  message: string;
  data: {
    customer: number;
    plan: number;
    integration: number;
    domain: string;
    start: number;
    status: string;
    quantity: number;
    amount: number;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string;
    };
    subscription_code: string;
    email_token: string;
    id: number;
    createdAt: string;
    updatedAt: string;
  }
}

export interface ChargedAuthorizationResponse {
  status: boolean;
  message: string;
  data: {
    amount: number;
    currency: string;
    transaction_date: string;
    status: string;
    reference: string;
    domain: string;
    metadata: string;
    gateway_response: string;
    message: null;
    channel: string;
    ip_address: null;
    log: null;
    fees: number;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: null;
    };
    customer: {
      id: number;
      first_name: null;
      last_name: null;
      email: string;
      customer_code: string;
      phone: null;
      metadata: {
        custom_fields: {
          display_name: string;
          variable_name: string;
          value: string;
        }[];
      };
      risk_action: string;
      international_format_phone: null;
    };
    plan: null;
    id: number;
  };
}

export interface SubscriptionsResponse {
  status: boolean;
  message: string;
  data: {
    id: number;
    domain: string;
    status: string;
    start: number;
    quantity: number;
    subscription_code: string;
    email_token: string;
    amount: number;
    cron_expression: string;
    next_payment_date: string;
    open_invoice: null;
    createdAt: string;
    integration: number;
    plan: {
      id: number;
      domain: string;
      name: string;
      plan_code: string;
      description: string;
      amount: number;
      interval: string;
      send_invoices: boolean;
      send_sms: boolean;
      currency: string;
      integration: number;
      createdAt: string;
      updatedAt: string;
    };
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: number;
      signature: string;
      account_name: null;
    };
    customer: {
      id: number;
      first_name: null | string;
      last_name: null | string;
      email: string;
      customer_code: string;
      phone: null | string;
      metadata: null;
      risk_action: string;
      international_format_phone: null;
    }

    ;
    invoice_limit: number;
    split_code: null;
    metadata: null;
    payments_count: number;
    most_recent_invoice: {
      subscription: number;
      integration: number;
      domain: string;
      invoice_code: string;
      customer: number;
      transaction: number;
      amount: number;
      period_start: string;
      period_end: string;
      status: string;
      paid: number;
      retries: number;
      authorization: number;
      paid_at: string;
      next_notification: string;
      notification_flag: null;
      description: null;
      id: number;
      created_at: string;
      updated_at: string;
    };
  }[];
  meta: {
    total: number;
    skipped: number;
    perPage: number;
    page: number;
    pageCount: number;
  };
}

export interface SubscriptionCreatedData {
  domain: string;
  status: string;
  subscription_code: string;
  amount: number;
  cron_expression: string;
  next_payment_date: string;
  open_invoice: null;
  createdAt: string;
  plan: {
    name: string;
    plan_code: string;
    description: null;
    amount: number;
    interval: string;
    send_invoices: boolean;
    send_sms: boolean;
    currency: string;
  };
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    account_name: string;
  }
  ;
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    customer_code: string;
    phone: string;
    metadata: Metadata;
    risk_action: string;
  };
  created_at: string;
}

export interface SubscriptionDisabledEventData {
  domain: string;
  status: string;
  subscription_code: string;
  email_token: string;
  amount: number;
  cron_expression: string;
  next_payment_date: string;
  open_invoice?: any;
  plan: {
    id: number;
    name: string;
    plan_code: string;
    description?: any;
    amount: number;
    interval: string;
    send_invoices: boolean;
    send_sms: boolean;
    currency: string;
  };
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    account_name: string;
  };
  customer: {
    first_name: string;
    last_name: string;
    email: string;
    customer_code: string;
    phone: string;
    metadata: Metadata;
    risk_action: string;
  };
  created_at: string;
};

export interface ChargeSuccessEventData {
  id: number;
  domain: string;
  status: string;
  reference: string;
  amount: number;
  message: string;
  gateway_response: string;
  paid_at: string;
  created_at: string;
  channel: string;
  currency: string;
  ip_address: string;
  metadata: Metadata;
  fees_breakdown?: any;
  log?: any;
  fees: number;
  fees_split?: any;
  authorization: {
    authorization_code: string;
    bin: string;
    last4: string;
    exp_month: string;
    exp_year: string;
    channel: string;
    card_type: string;
    bank: string;
    country_code: string;
    brand: string;
    reusable: boolean;
    signature: string;
    account_name?: any;
    receiver_bank_account_number?: any;
    receiver_bank?: any;
  };
  customer: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    customer_code: string;
    phone: string;
    metadata?: any;
    risk_action: string;
    international_format_phone?: any;
  };
  plan: {
    id: number;
    name: string;
    plan_code: string;
    description?: any;
    amount: number;
    interval: string;
    send_invoices: number;
    send_sms: number;
    currency: string;
  };
  subaccount: {};
  split: {};
  order_id?: any;
  paidAt: string;
  requested_amount: number;
  pos_transaction_data?: any;
  source: {
    type: string;
    source: string;
    entry_point: string;
    identifier?: any;
  };
}

export interface SubscriptionLinkResponse {
  status: boolean;
  message: string;
  data: {
    link: string;
  };
}

export interface CreatedPaystackPlanSuccessResponse {
  status: boolean;
  message: string;
  data: {
    name: string;
    amount: number;
    interval: string;
    description: string;
    integration: number;
    domain: string;
    currency: string;
    plan_code: string;
    invoice_limit: number;
    send_invoices: boolean;
    send_sms: boolean;
    hosted_page: boolean;
    migrate: boolean;
    is_archived: boolean;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}


export interface PlanPayload {
  name: string;
  amount: number; // In kobo (10000 = ₦100)
  interval: "daily" | "weekly" | "monthly" | "annually" | string;
  description?: string;
  send_invoices?: boolean;
  send_sms?: boolean;
  currency?: string; // Default: "NGN"
  invoice_limit?: number;
}

export interface PlanDeletedResponse {
  message: string
  status: boolean
}

export interface UpdatedPlanResponse {
  status: boolean;
  message: string;
}

export interface UpdatedSubscriptionResponse {
  status: boolean;
  message: string;
}

export interface GetSubscriptionResponse {
  status: boolean;
  message: string;
  data: {
    invoices: any[];
    customer: {
      first_name: string;
      last_name: string;
      email: string;
      phone: null;
      metadata: {
        photos: {
          type: string;
          typeId: string;
          typeName: string;
          url: string;
          isPrimary: boolean;
        }[];
      };
      domain: string;
      customer_code: string;
      id: number;
      integration: number;
      createdAt: string;
      updatedAt: string;
    };
    plan: {
      domain: string;
      name: string;
      plan_code: string;
      description: null;
      amount: number;
      interval: string;
      send_invoices: boolean;
      send_sms: boolean;
      hosted_page: boolean;
      hosted_page_url: null;
      hosted_page_summary: null;
      currency: string;
      id: number;
      integration: number;
      createdAt: string;
      updatedAt: string;
    };
    integration: number;
    authorization: {
      authorization_code: string;
      bin: string;
      last4: string;
      exp_month: string;
      exp_year: string;
      channel: string;
      card_type: string;
      bank: string;
      country_code: string;
      brand: string;
      reusable: boolean;
      signature: string;
      account_name: string;
    };
    domain: string;
    start: number;
    status: string;
    quantity: number;
    amount: number;
    subscription_code: string;
    email_token: string;
    easy_cron_id: null;
    cron_expression: string;
    next_payment_date: string;
    open_invoice: null;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}


export interface CreateRefundResponse {
  status: boolean;
  message: string;
  data: {
    transaction: {
      id: number;
      domain: string;
      reference: string;
      amount: number;
      paid_at: string;
      channel: string;
      currency: string;
      authorization: {
        exp_month: null;
        exp_year: null;
        account_name: null;
      };
      customer: {
        international_format_phone: null;
      };
      plan: any;
      subaccount: {
        currency: null;
      };
      split: any;
      order_id: null;
      paidAt: string;
      pos_transaction_data: null;
      source: null;
      fees_breakdown: null;
    };
    integration: number;
    deducted_amount: number;
    channel: null;
    merchant_note: string;
    customer_note: string;
    status: string;
    refunded_by: string;
    expected_at: string;
    currency: string;
    domain: string;
    amount: number;
    fully_deducted: boolean;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}

export interface GetRefundResponse {
  status: boolean;
  message: string;
  data: {
    integration: number;
    transaction: number;
    dispute: null;
    settlement: null;
    domain: string;
    amount: number;
    deducted_amount: number;
    fully_deducted: boolean;
    currency: string;
    channel: string;
    status: string;
    refunded_by: string;
    refunded_at: string;
    expected_at: string;
    customer_note: string;
    merchant_note: string;
    id: number;
    createdAt: string;
    updatedAt: string;
  };
}
