import { useSession } from "next-auth/react";


//if we need current user for client component then we will use this else for server we will use action/index.js(currentUser)
export const useCurrentUser = () => {
    const session = useSession();

    return session?.data?.user;
}