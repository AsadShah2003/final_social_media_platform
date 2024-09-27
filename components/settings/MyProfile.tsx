"use client"
import React, { useEffect, useRef, useState } from 'react'
import { AiFillEdit } from "react-icons/ai";
import { Input } from '../ui/input'
import { FaCheck } from "react-icons/fa";
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import { getSession, useSession } from 'next-auth/react';
import { initProfileUpdateAction } from '@/actions/profileupdate-action';
import { useHome } from '@/store/useHome';
import { useToast } from '../custom/CustomToast';
const MyProfile = () => {
    const { doRefresh } = useHome()
    const fileInputRef = useRef<any>(null)
    const { showToast } = useToast()
    const [uid, setUID] = useState<number>(0)
    const [uname, setUname] = useState<string>("")
    const [newUname, setNewUname] = useState<string>("")
    const [allowEdit, setAllowEdit] = useState(false)
    const [profileImage, setProfileImage] = useState<string>("")
    const { data: session, update } = useSession();

    const updateSession = async (type: string, data: any) => {
        let newSession
        if (type === "username") {
            newSession = {
                ...session,
                user: {
                    ...session?.user,
                    username: data.username
                },
            };
            await update(newSession);
        } else if (type === "profileImage") {
            console.log("Before setting session got: ", data.profileImage)
            newSession = {
                ...session,
                user: {
                    ...session?.user,
                    profileImage: data.profileImage
                },
            };
            await update(newSession);
        }


    };

    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Programmatic click on input
        }
    };
    async function getAuthState() {
        const session = await getSession()
        if (session && session.user && session.user.username && session.user.id) {
            setUname(session.user.username)
            setUID(session.user.id)
            setProfileImage(`/profile/user_${session.user.id}/${session.user.profileImage!}`)
        }
    }
    async function updateUsername() {
        const frmData = new FormData()
        frmData.append("userID", uid.toString())
        frmData.append("toUpdate", "username")
        frmData.append("newUsername", newUname)
        await initProfileUpdateAction(frmData)

        setUname(newUname)
        await updateSession("username", {
            username: newUname
        })
    }

    useEffect(() => {
        getAuthState()
    }, [])

    const handleProfileImageUpload = async (e: any) => {
        const _img = await e.target.files?.[0]
        setTimeout(async () => {
            if (_img) {
                const frmData = new FormData()
                frmData.append("userID", uid.toString())
                frmData.append("toUpdate", "image")
                frmData.append("profileImage", _img)

                const res = await initProfileUpdateAction(frmData)

                if (res.message === "OK") {
                    showToast("Successfully updated profile image", "success", 3000)
                    console.log("IMG ",)

                    if (res.imgPath.length === 0 || !res.imgPath) {
                        //
                        setProfileImage("")
                    } else {

                        setProfileImage(`/profile/user_${uid}/${res.imgPath}`)
                    }


                    await updateSession("profileImage", {
                        profileImage: `${res.imgPath}`
                    })

                    doRefresh()

                }
            }

        }, 1500)

    }

    return (
        <div className='p-2 w-full h-full'>
            <div className=''>
                <h1 className='text-[1.2rem] font-bold'>My Profile:</h1>
            </div>
            <div onClick={handleFileInputClick} className='mt-2 avatar-wrapper'>

                <Avatar className='relative rounded-full'>
                    {
                        profileImage.length > 0 ? <AvatarImage src={profileImage!} className='h-24 w-24 rounded-full !object-cover' /> :
                            <AvatarImage src={"https://sdi-implant.com/wp-content/uploads/2018/02/avatar-1577909_960_720.png"} className='h-24 w-24 rounded-full' />
                    }

                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>

            </div>
            <input
                ref={fileInputRef}
                accept=".jpg, .jpeg, .png"
                className="hidden"
                id="fileInput"
                type="file"
                onChange={handleProfileImageUpload}
            />
            <div className='mt-2'>
                <div className='flex flex-col gap-2 mt-6'>
                    <label htmlFor="uname" className='text-sm font-medium'>Username</label>
                    <div className='relative'>
                        <Input onChange={(e) => setNewUname(e.target.value)} value={uname.length > 0 ? uname : undefined} id='uname' placeholder='Your old username' className='p-5 border border-gray-300' />
                        {!allowEdit ? <div onClick={() => setAllowEdit(true)} className='hover:opacity-[0.9] cursor-pointer bg-sky-600  w-8 h-7 absolute right-4 top-2 rounded-sm'>
                            <AiFillEdit onClick={() => setUname("")} color='white' size={22} className='ml-[4px] mt-[2px]' />
                        </div>
                            :
                            <div onClick={() => setAllowEdit(false)} className='cursor-pointer hover:opacity-[0.9]  bg-sky-600  w-8 h-7 absolute right-4 top-2 rounded-sm'>
                                <FaCheck onClick={() => updateUsername()} color='white' size={17} className='ml-[7px] mt-[5px]' />
                            </div>
                        }
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MyProfile;