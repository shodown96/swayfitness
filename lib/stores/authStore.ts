import { FullAccount } from "@/types/account";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { mainClient } from "../axios";
import { API_ENDPOINTS } from "../constants/api";
import { PATHS } from "../constants/paths";

interface Tokens {
  accessToken: string | null
}
interface State {
  user: FullAccount | null;
  tokens: Tokens | null,
}
interface InitState extends State { }
interface Actions {
  initialize: (params: InitState) => void;
  setUser: (user: FullAccount | null) => void;
  resetAuthStore: () => void;
  setApiToken: (tokens: Tokens) => void
  signOut: () => Promise<void>;
}
// Not being used anymore for authentication
export const useAuthStore = create(
  persist<Actions & State>(
    (set, get) => ({
      user: null,
      resetPasswordParams: { email: "", code: "" },
      tokens: null,
      setApiToken: (tokens) => set({ tokens }),
      setUser: (params) => set({ user: params }),
      initialize: (params) => set(params),
      resetAuthStore: () =>
        set({ user: null }),
      signOut: async () => {
        set({ user: null });
        if (window.location.href.includes("admin")) {
          window.location.replace(PATHS.AdminSignIn)
        }
        window.location.replace(PATHS.SignIn)
        // const result = await mainClient.get(API_ENDPOINTS.Auth.SignOut)
        // if (result.success) {
        //   if (window.location.href.includes("admin")) {
        //     window.location.replace(PATHS.AdminSignIn)
        //   }
        //   window.location.replace(PATHS.SignIn)
        // }
      }
    }),
    {
      name: "auth-storage",
      skipHydration: true, // Requires the useStoreHydration usage
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);