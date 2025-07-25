// This is safe because constants imported to server stuff, especially the middleware,
// be imported at build time so they wont be prone to risk of mainpulation
import { publicRoutes } from "./constants/paths";

export const isPublicRoute = (pathname: string) => {
    return publicRoutes.some((route) =>
        route.includes("(.*)") ? pathname.startsWith(route.replace("(.*)", "")) : (pathname === route)
    );
}
