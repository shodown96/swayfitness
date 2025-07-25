import { AxiosService } from "../ax"

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  name: string
  email: string
  password: string
  phone: string
  dob: string
  gender: string
}

export interface AuthUser {
  id: string
  name: string
  email: string
  role: string
}

export interface AuthResponse {
  user: AuthUser
  token: string
  expiresIn: number
}

export class AuthService {
  static async login(credentials: LoginCredentials) {
    return AxiosService.post<AuthResponse>("/auth/login", credentials)
  }

  static async adminSignIn(credentials: LoginCredentials) {
    return AxiosService.post<AuthResponse>("/auth/admin/login", credentials)
  }

  static async register(data: RegisterData) {
    return AxiosService.post<AuthResponse>("/auth/register", data)
  }

  static async logout() {
    return AxiosService.post("/auth/logout")
  }

  static async getMe() {
    return AxiosService.get<AuthUser>("/auth/me")
  }

  static async refreshToken() {
    return AxiosService.post<{ token: string }>("/auth/refresh")
  }
}
