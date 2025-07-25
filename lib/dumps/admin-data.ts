export interface AdminUser {
  id: string
  name: string
  email: string
  password: string
  role: 'Super Admin' | 'Admin'
  lastLogin: string
  createdAt: string
  status: 'active' | 'inactive'
}

export interface Member {
  id: string
  memberId: string
  name: string
  email: string
  phone: string
  dob: string
  gender: string
  plan: {
    id: string
    name: string
    price: number
    interval: string
    status: 'active' | 'expired' | 'suspended'
  }
  joinDate: string
  nextBillingDate: string
  totalPaid: number
  status: 'active' | 'expired' | 'suspended'
}

export interface Transaction {
  id: string
  memberId: string
  memberName: string
  amount: number
  status: 'success' | 'failed' | 'pending' | 'refunded'
  type: 'subscription' | 'registration' | 'refund'
  reference: string
  date: string
  description: string
  paymentMethod: string
}

export const adminUsers: AdminUser[] = [
  {
    id: 'admin1',
    name: 'Sarah Admin',
    email: 'admin@gym.com',
    password: 'admin123',
    role: 'Super Admin',
    lastLogin: new Date().toISOString(),
    createdAt: '2024-01-01',
    status: 'active'
  },
  {
    id: 'admin2',
    name: 'Mike Manager',
    email: 'manager@gym.com',
    password: 'manager123',
    role: 'Admin',
    lastLogin: '2024-07-20T14:30:00',
    createdAt: '2024-02-01',
    status: 'active'
  }
]

export const dummyMembers: Member[] = [
  {
    id: 'user1',
    memberId: 'GYM001',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+234 901 234 5678',
    dob: '1990-05-15',
    gender: 'Male',
    plan: {
      id: 'premium-monthly',
      name: 'Premium Monthly',
      price: 25000,
      interval: 'month',
      status: 'active'
    },
    joinDate: '2024-06-15',
    nextBillingDate: '2024-08-15',
    totalPaid: 75000,
    status: 'active'
  },
  {
    id: 'user2',
    memberId: 'GYM002',
    name: 'Jane Smith',
    email: 'jane@example.com',
    phone: '+234 901 234 5679',
    dob: '1985-08-22',
    gender: 'Female',
    plan: {
      id: 'elite-monthly',
      name: 'Elite Monthly',
      price: 35000,
      interval: 'month',
      status: 'active'
    },
    joinDate: '2024-05-10',
    nextBillingDate: '2024-08-10',
    totalPaid: 105000,
    status: 'active'
  },
  {
    id: 'user3',
    memberId: 'GYM003',
    name: 'Michael Johnson',
    email: 'michael@example.com',
    phone: '+234 901 234 5680',
    dob: '1992-12-03',
    gender: 'Male',
    plan: {
      id: 'basic-monthly',
      name: 'Basic Monthly',
      price: 15000,
      interval: 'month',
      status: 'expired'
    },
    joinDate: '2024-04-20',
    nextBillingDate: '2024-07-20',
    totalPaid: 45000,
    status: 'expired'
  },
  // Add more dummy members...
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `user${i + 4}`,
    memberId: `GYM${String(i + 4).padStart(3, '0')}`,
    name: `Member ${i + 4}`,
    email: `member${i + 4}@example.com`,
    phone: `+234 901 234 ${String(5681 + i).slice(-4)}`,
    dob: `199${Math.floor(Math.random() * 10)}-${String(Math.floor(Math.random() * 12) + 1).padStart(2, '0')}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    gender: Math.random() > 0.5 ? 'Male' : 'Female',
    plan: {
      id: ['basic-monthly', 'premium-monthly', 'elite-monthly'][Math.floor(Math.random() * 3)],
      name: ['Basic Monthly', 'Premium Monthly', 'Elite Monthly'][Math.floor(Math.random() * 3)],
      price: [15000, 25000, 35000][Math.floor(Math.random() * 3)],
      interval: 'month',
      status: ['active', 'expired', 'suspended'][Math.floor(Math.random() * 3)] as 'active' | 'expired' | 'suspended'
    },
    joinDate: `2024-0${Math.floor(Math.random() * 6) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    nextBillingDate: `2024-0${Math.floor(Math.random() * 6) + 7}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}`,
    totalPaid: Math.floor(Math.random() * 200000) + 50000,
    status: ['active', 'expired', 'suspended'][Math.floor(Math.random() * 3)] as 'active' | 'expired' | 'suspended'
  }))
]

export const dummyTransactions: Transaction[] = [
  {
    id: 'txn1',
    memberId: 'user1',
    memberName: 'John Doe',
    amount: 32500,
    status: 'success',
    type: 'subscription',
    reference: 'TRX_123456789',
    date: '2024-07-15T10:30:00',
    description: 'Premium Monthly + Registration Fee',
    paymentMethod: 'Card'
  },
  {
    id: 'txn2',
    memberId: 'user2',
    memberName: 'Jane Smith',
    amount: 42500,
    status: 'success',
    type: 'subscription',
    reference: 'TRX_123456790',
    date: '2024-07-10T14:20:00',
    description: 'Elite Monthly + Registration Fee',
    paymentMethod: 'Bank Transfer'
  },
  {
    id: 'txn3',
    memberId: 'user3',
    memberName: 'Michael Johnson',
    amount: 15000,
    status: 'failed',
    type: 'subscription',
    reference: 'TRX_123456791',
    date: '2024-07-20T09:15:00',
    description: 'Basic Monthly Renewal',
    paymentMethod: 'Card'
  },
  // Add more dummy transactions...
  ...Array.from({ length: 47 }, (_, i) => ({
    id: `txn${i + 4}`,
    memberId: `user${Math.floor(Math.random() * 50) + 1}`,
    memberName: `Member ${Math.floor(Math.random() * 50) + 1}`,
    amount: [15000, 25000, 35000, 7500][Math.floor(Math.random() * 4)],
    status: ['success', 'failed', 'pending', 'refunded'][Math.floor(Math.random() * 4)] as 'success' | 'failed' | 'pending' | 'refunded',
    type: ['subscription', 'registration', 'refund'][Math.floor(Math.random() * 3)] as 'subscription' | 'registration' | 'refund',
    reference: `TRX_${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
    date: `2024-0${Math.floor(Math.random() * 7) + 1}-${String(Math.floor(Math.random() * 28) + 1).padStart(2, '0')}T${String(Math.floor(Math.random() * 24)).padStart(2, '0')}:${String(Math.floor(Math.random() * 60)).padStart(2, '0')}:00`,
    description: ['Monthly Subscription', 'Registration Fee', 'Plan Upgrade', 'Refund'][Math.floor(Math.random() * 4)],
    paymentMethod: ['Card', 'Bank Transfer', 'Cash'][Math.floor(Math.random() * 3)]
  }))
]

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-NG', {
    style: 'currency',
    currency: 'NGN',
    minimumFractionDigits: 0,
  }).format(amount)
}

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
    case 'success':
      return 'bg-green-100 text-green-800'
    case 'expired':
    case 'failed':
      return 'bg-red-100 text-red-800'
    case 'suspended':
    case 'pending':
      return 'bg-yellow-100 text-yellow-800'
    case 'refunded':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}
