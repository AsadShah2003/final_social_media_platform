"use client"
import React, { useState } from 'react'
import { MdArrowBack } from "react-icons/md";
import Link from 'next/link';
import MyProfile from './MyProfile';
import AccountSecurity from './AccountSecurity';
import { signOut } from 'next-auth/react';
const Settings = () => {

    const [activeTab, setActiveTab] = useState<string>("my_profile")
    const switchTab = (newTab: string) => {
        setActiveTab(newTab)
    }

    const handleLogout = async () => {
        await signOut({
            callbackUrl: "/auth/signin",
            redirect: true,
        })
    }

    return (
        <div className='border border-gray-300 h-fit flex flex-col mt-24 max-w-[750px] mx-auto'>
            <header className='h-[60px] border-b border-b-gray-300 shadow-md w-full flex items-center justify-center'>
                <div className='p-2 w-full flex items-center gap-[33%]'>
                    <Link href="/">
                        <MdArrowBack size={22} className='ml-1 cursor-pointer' />
                    </Link>
                    <h1 className='font-bold'>User Account Settings</h1>
                </div>
            </header>
            <main className='w-full flex'>
                <aside className='w-[280px] h-[350px] border-r border-r-gray-300'>
                    <ul className='flex flex-col'>
                        <li className={activeTab === "my_profile" ? "bg-sky-500 duration-75 text-white" : "" + " cursor-pointer"} onClick={() => switchTab("my_profile")}>
                            <h1 className='p-2 text-sm font-medium border border-b-gray-300'>My Profile</h1>
                        </li>
                        <li className={activeTab === "account_security" ? "bg-sky-500 duration-75 text-white" : "" + " cursor-pointer"} onClick={() => switchTab("account_security")}>
                            <h1 className='p-2 text-sm font-medium border border-b-gray-300'>Account Security</h1>
                        </li>
                        <li className='p-2 w-full' onClick={handleLogout}>
                            <h1 className='text-sm text-red-500 cursor-pointer underline font-medium'>Logout</h1>
                        </li>

                    </ul>
                </aside>
                <main className='w-full p-2'>
                    {
                        activeTab === "my_profile" ? <MyProfile />
                            : activeTab === "account_security" && <AccountSecurity />
                    }
                </main>
            </main>
        </div>
    )
}

export default Settings