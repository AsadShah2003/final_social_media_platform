"use client"
import { initGetProfileAction } from '@/actions/getprofile-action'
import Post from '@/components/home/Post'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { useHome } from '@/store/useHome'
import { getSession } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { IoMdArrowRoundBack } from "react-icons/io";
const page = () => {
    const queryParams = useSearchParams()

    const [posts, setPosts] = useState([])
    const { refresh } = useHome()

    const [profileImage, setProfileImage] = useState<string | null | undefined>("")
    const [socialNumbers, setSocialNumbers] = useState({
        uname: "",
        totalPosts: 0,
        totalFollowers: 0,
        totalFollowing: 0
    })


    async function getAuthState() {
        const queryUserID = queryParams.get("userID")
        if (queryUserID && parseInt(queryUserID) > 0) {
            const profile = await initGetProfileAction(parseInt(queryUserID))

            setSocialNumbers({
                uname: profile.username,
                totalFollowers: profile.followerCount,
                totalFollowing: profile.followingCount,
                totalPosts: profile.posts.length
            })

            setPosts(profile.posts)
            setProfileImage(`/profile/user_${queryUserID}/${profile?.profileImage}`)

        } else {
            //means fetch self profile, //some data lies in session so fetch that first 
            const session = await getSession()
            if (session && session.user && session.user.username && session.user.id) {
                setProfileImage(`/profile/user_${session.user.id}/${session.user.profileImage}`)

                const profile = await initGetProfileAction(session.user.id)
                setSocialNumbers({
                    uname: profile.username,
                    totalFollowers: profile.followerCount,
                    totalFollowing: profile.followingCount,
                    totalPosts: profile.posts.length
                })

                setPosts(profile.posts)
            }
        }

    }
    useEffect(() => {
        getAuthState()
    }, [])

    const { push } = useRouter()

    const goBack = () => {
        push("/")
    }


    return (
        <div className='min-h-screen w-full relative'>
            <header className='sticky top-6 bg-white mx-auto max-w-[700px] pt-16 px-2 h-fit'>
                <div onClick={goBack} className='absolute hover:bg-gray-200 duration-150 rounded-full p-2'>
                    <IoMdArrowRoundBack size={35} className='cursor-pointer' />
                </div>
                <main className='flex flex-col gap-6 items-center'>
                    <Avatar className='ring-2 ring-blue-300 rounded-full w-24 h-24'>
                        <AvatarImage src={profileImage ? profileImage : undefined} className='w-full h-full rounded-full !object-cover' />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col gap-1'>
                        <h1 className='font-bold text-center text-[1.2rem]'>{socialNumbers.uname}</h1>
                        <h1 className='text-sm'>Software Engineer</h1>
                    </div>
                    <div className='flex gap-12 items-center justify-center w-full'>
                        <div className='flex flex-col gap-1 items-center'>
                            <h1 className='font-semibold'>{socialNumbers?.totalFollowers}</h1>
                            <h1 className='text-sm'>Followers</h1>
                        </div>
                        <div className='flex flex-col gap-1 items-center'>
                            <h1 className='font-semibold'>{socialNumbers?.totalPosts}</h1>
                            <h1 className='text-sm'>Posts</h1>
                        </div>

                        <div className='flex flex-col gap-1 items-center'>
                            <h1 className='font-semibold'>{socialNumbers?.totalFollowing}</h1>
                            <h1 className='text-sm'>Following</h1>
                        </div>
                    </div>
                </main>
            </header>
            <main className='my-2 p-2 max-w-[700px] mx-auto min-h-fit flex flex-col gap-12'>
                <Separator className='h-[0.4px] bg-gray-300' />
                <h1 className='font-bold'>Showing all posts</h1>
                {
                    //Show the actual posts once loading is done
                    posts && posts.length > 0 ? posts.map((post: any, idx: any) => (
                        <div key={idx}>
                            <Post reRender={refresh} id={parseInt(post.id)} totalLikes={parseInt(post.totalLikes)} totalComments={parseInt(post.totalComments)} images={JSON.parse(post.PostImagesNames)} authorID={post.authorID} isLoading={false} author={post.authorName} time={post.createdAt} content={post.postContent} />
                        </div>
                    )) : (
                        <h1 className='text-2xl text-center mt-6 font-bold'>No Posts to show</h1>
                    )

                }
            </main>
        </div>
    )
}

export default page