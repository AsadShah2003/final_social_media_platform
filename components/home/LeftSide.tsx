"use client"
import { poppins } from '@/utils/Fonts'
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { getSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { IoMdHome } from 'react-icons/io'
import { IoSettingsSharp } from "react-icons/io5";
import { useRouter } from 'next/navigation';
import { MdLogout } from "react-icons/md";
import { useHome } from '@/store/useHome';


const LeftSide = () => {
    const { push } = useRouter()
    const { refresh } = useHome()
    const [uname, setUname] = useState<string | null>("")
    const [profileImage, setProfileImage] = useState<string>("")


    async function getAuthState() {
        const session = await getSession()
        if (session && session.user && session.user.username && session.user.id) {
            setUname(session.user.username)
            setProfileImage(`/profile/user_${session.user.id}/${session.user.profileImage}`)
        }
    }

    useEffect(() => {
        getAuthState()
    }, [refresh, profileImage])

    const openProfile = () => {
        push(`/profile`)
    }
    const handleLogout = async () => {
        await signOut({
            callbackUrl: "/auth/signin",
            redirect: true,
        })
    }

    return (
        <div className='hidden fixed top-24 md:flex flex-col w-full gap-5 max-w-[285px]'>
            <div className='flex flex-col gap-4'>
                <h1 className='font-medium text-gray-600'>Your Profile</h1>
                <div onClick={openProfile} className='hover:bg-slate-200 hover:shadow-md p-2 cursor-pointer rounded-md
                 flex gap-4 items-center'>
                    <Avatar className='h-12 w-12 ring-slate-300 rounded-full ring-2'>
                        <AvatarImage src={profileImage.length > 0 ? profileImage : undefined} className='rounded-full !h-full !object-cover !bg-center' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                        <h1 className='text-sm font-bold text-gray-700'>{uname}</h1>
                        <p className='text-sm'>Content creator</p>
                    </div>
                </div>
            </div>
            <h1 className='font-medium'>Main Features</h1>
            <div onClick={() => push("/")} className='bg-white flex items-center gap-2 text-sm py-2 hover:bg-slate-200 p-2 rounded-md cursor-pointer hover:text-black'>
                <IoMdHome size={27} className='ml-0.5' color='darkgray' />
                <h1 className={poppins.className + " mt-0.5"}>Home</h1>
            </div>
            <div onClick={() => push("/settings")} className='bg-white flex items-center gap-2 text-sm py-2 hover:bg-slate-200 p-2 rounded-md cursor-pointer hover:text-black'>
                <IoSettingsSharp size={23} className='ml-1' color='darkgray' />
                <h1 className={poppins.className}>Settings</h1>
            </div>
            <div onClick={handleLogout} className='bg-white flex items-center gap-2 duration-150 shadow-md text-sm py-2 hover:bg-red-500 group/logout p-2 rounded-md cursor-pointer hover:text-black'>
                <MdLogout size={25} className='ml-1.5 group-hover/logout:text-white text-red-500' />
                <h1 className={poppins.className + ' text-red-500 group-hover/logout:text-white'}>Logout</h1>
            </div>
        </div>
    )
}

export default LeftSide