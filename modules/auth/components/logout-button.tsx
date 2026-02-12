"use client";

import { LogoutButtonProps } from '../types'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react';

const LogoutButton = ({children}:LogoutButtonProps) => {
    const router = useRouter();
    const onLogout = async()=>{
        await signOut()
        router.refresh()
    }
  return (
    <button 
      type="button"
      className='cursor-pointer bg-transparent border-none p-0'
      onClick={onLogout}
    >
        {children}
    </button>
  )
}

export default LogoutButton
