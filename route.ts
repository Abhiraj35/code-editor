//An array of routes that are accessible to the public
//these routes do not require authentication
export const publicRoutes : string[] = [

]

/* 
An array of routes that are protected
these routes require authentication
*/
export const protectedRoutes : string[] = [
    '/'
]

/* 
    An array of routes that are accessible to the public 
    Routes that start with this (/api/auth) prefix do not require authentication
*/
export const authRoutes: string[] = [
    "/auth/sign-in"
]

/* 
    An array of Routes that are accesssible to the public 
    Routes that start with this (/api/auth) prefix do not require authentication
*/
export const apiAuthPrefix: string = '/api/auth'
export const DEFAULT_LOGIN_REDIRECT = "/" //change to redirect to homepage after login