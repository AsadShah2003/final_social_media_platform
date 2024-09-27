"use client"
import React, { useEffect, useState } from 'react'
import { AiFillEdit } from "react-icons/ai";
import { Input } from '../ui/input'
import { FaCheck } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { getSession, useSession } from 'next-auth/react';
import { initProfileUpdateAction } from '@/actions/profileupdate-action';

const AccountSecurity = () => {

    const [uid, setUID] = useState<number>(0)
    const [newPassword, setNewPassword] = useState<string>("")
    const [allowEdit, setAllowEdit] = useState(false)

    async function getAuthState() {
        const session = await getSession()
        if (session && session.user && session.user.username && session.user.id) {
            setUID(session.user.id)
        }
    }
    useEffect(() => {
        getAuthState()
    }, [])


    async function updatePassword() {
        const frmData = new FormData()
        frmData.append("userID", uid.toString())
        frmData.append("toUpdate", "password")
        frmData.append("newPassword", newPassword)

        const r = await initProfileUpdateAction(frmData)

        console.log(r)
    }

    return (
        <div className='p-2 w-full h-full'>
            <div>
                <h1 className='text-[1.2rem] font-bold'>Account Security:</h1>
            </div>
            <div className='mt-6'>
                <label htmlFor="password" className='text-sm font-medium'>Create a new password</label>
                <div className='relative mt-2'>
                    <Input
                        onChange={(e) => setNewPassword(e.target.value)}
                        value={newPassword.length > 0 ? newPassword : ""}
                        id='password'
                        placeholder='Enter a new password'
                        className='p-5 border border-gray-300'
                        readOnly={!allowEdit} // Make input readOnly by default
                    />
                    {!allowEdit ? (
                        <div onClick={() => setAllowEdit(true)} className='hover:opacity-[0.9] cursor-pointer bg-sky-600  w-8 h-7 absolute right-4 top-2 rounded-sm'>
                            <AiFillEdit color='white' size={22} className='ml-[4px] mt-[2px]' />
                        </div>
                    ) : (
                        <div onClick={() => { setAllowEdit(false); updatePassword(); }} className='cursor-pointer hover:opacity-[0.9] bg-sky-600  w-8 h-7 absolute right-4 top-2 rounded-sm'>
                            <FaCheck color='white' size={17} className='ml-[7px] mt-[5px]' />
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default AccountSecurity
