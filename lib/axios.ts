import type { AxiosInstance, RawAxiosRequestHeaders, AxiosResponse, AxiosRequestConfig } from "axios";
import axios from "axios";
import { BASE_API_ENDPOINT } from "@/lib/constants/api";

interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
}

interface ClientOptions {
  baseURL?: string;
  multipart?: boolean;
  extraHeaders?: RawAxiosRequestHeaders;
}

class AxiosClient {
  private instance: AxiosInstance;

  constructor({ baseURL = "", multipart = false, extraHeaders = {} }: ClientOptions = {}) {
    this.instance = axios.create({
      baseURL,
      timeout: 30000,
      withCredentials: true,
      headers: {
        "Content-Type": multipart ? "multipart/form-data" : "application/json",
        ...extraHeaders,
      },
    });

    this._setInterceptors();
  }

  private _setInterceptors() {
    // this.instance.interceptors.request.use((config) => {
    //   const state = JSON.parse(sessionStorage.getItem("auth-storage") || "{}");
    //   if (state?.state?.tokens?.accessToken) {
    //     config.headers.Authorization = `Token ${state.state.tokens.accessToken}`;
    //   }
    //   return config;
    // });

    this.instance.interceptors.response.use(
      (response: AxiosResponse): AxiosResponse<ApiResponse> => {
        return response;
      },
      (error) => {
        console.log("error from axios.client: ", error);

        let errorResponse: ApiResponse = {
          success: false,
        };

        if (error.code === "ERR_NETWORK") {
          errorResponse = {
            success: false,
            message: "Network Error"
          };
        } else if (error.response) {
          // Server responded with error status
          const { status, data } = error.response;
          errorResponse = {
            success: false,
            message: data?.message || `Request failed with status ${status}`,
            data: data?.data
          };
        } else if (error.request) {
          // Request was made but no response received
          errorResponse = {
            success: false,
            message: "No response received from server"
          };
        } else {
          // Something else happened
          errorResponse = {
            success: false,
            message: "An error occurred while setting up the request"
          };
        }

        const response = {
          ...error.response,
          data: errorResponse
        };

        return Promise.reject(response);
      }
    );
  }

  // Wrapper methods that ensure proper typing
  async get<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.get<ApiResponse<T>>(url, config);
    return response.data;
  }

  async post<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.post<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async put<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.put<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async patch<T = any>(url: string, data?: any, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.patch<ApiResponse<T>>(url, data, config);
    return response.data;
  }

  async delete<T = any>(url: string, config?: AxiosRequestConfig): Promise<ApiResponse<T>> {
    const response = await this.instance.delete<ApiResponse<T>>(url, config);
    return response.data;
  }

  get client(): AxiosInstance {
    return this.instance;
  }
}

// Create client instances
export const mainClient = new AxiosClient({ baseURL: "" });
export const multipartClient = new AxiosClient({
  baseURL: BASE_API_ENDPOINT,
  multipart: true
});
