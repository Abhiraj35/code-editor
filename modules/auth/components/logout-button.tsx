"use client";

import { LogoutButtonProps } from '../types'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react';

const LogoutButton = ({children}:LogoutButtonProps) => {
    const router = useRouter();
    /* 
        The signOut() call in next-auth v5 defaults to redirect: true, which navigates the user away immediately, making router.refresh() unreachable. By default, it redirects to the homepage, not the sign-in page. So we use redirect: false to suppress the redirect and handle navigation manually, or removing the router.refresh() call entirely.

        const onLogout = async()=>{
        await signOut()
        router.refresh()
      }
    */

    const onLogout = async () => {
      try {
        await signOut({redirect: false});
        router.push("/");
      } catch (error) {
        console.error("Logout faliled:", error);
      }
    }
   
  return (
    <button 
      type="button"
      className='cursor-pointer bg-transparent border-none p-0 focus:outline-2 focus:outline-offset-2 focus:outline-blue-500'
      onClick={onLogout}
      aria-label='Log out'
      title='Log out'
    >
        {children}
    </button>
  )
}

export default LogoutButton
