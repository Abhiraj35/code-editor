//An array of routes that are accessible to the public
//these routes do not require authentication
export const publicRoutes : string[] = [
    '/',
    '/docs',
]

/* 
An array of routes that are protected
these routes require authentication
*/
export const protectedRoutes : string[] = [
    '/dashboard',
    '/settings',
]

/* 
    An array of routes used for authentication (sign-in, sign-up, etc.)
    Logged-in users will be redirected away from these routes
*/
export const authRoutes: string[] = [
    "/auth/sign-in"
]

/* 
    Prefix for NextAuth API routes
    Routes starting with this prefix are handled by NextAuth and bypass auth middleware
*/
export const apiAuthPrefix: string = '/api/auth'
export const DEFAULT_LOGIN_REDIRECT = "/" //change to redirect to homepage after login