"use client"
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import { Button } from '../ui/button'
import { useEffect, useState } from 'react';
import { initGetProfileAction } from '@/actions/getprofile-action';
import { useRouter } from 'next/navigation';


const SuggestedAccount = ({ isFollowing, uid, username, addFollowHandler, unFollowHandler }: { unFollowHandler: any; isFollowing: boolean, uid: number, username: string; addFollowHandler: any }) => {
    const [following, setFollowing] = useState(false)
    const [img, setImg] = useState<string | null>("")

    async function getAuthState(uid: number) {
        const profileImg = await initGetProfileAction(uid)
        setImg(profileImg.profileImage)
    }

    useEffect(() => {
        getAuthState(uid!)
        setFollowing(isFollowing)
    }, [])

    const unfollow = () => {
        unFollowHandler(uid)
        setFollowing(!following)
    }
    const follow = () => {
        addFollowHandler(uid)
        setFollowing(!following)
    }

    const { push } = useRouter()
    const openProfile = () => {
        push(`/profile?userID=${uid}`)
    }
    return (
        <div className='cursor-pointer hover:bg-gray-200 p-2 flex items-center justify-between'>
            <div className='flex items-center gap-3' onClick={openProfile}>
                <Avatar className='w-9 rounded-full h-9'>
                    <AvatarImage className='rounded-full w-full h-full !object-cover' src={
                        img ? `/profile/user_${uid}/${img}` : undefined
                    } alt="@shadcn" />
                    <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <div className='flex flex-col text-sm'>
                    <h1 className='font-bold'>{username}</h1>
                    <h1 className='text-gray-500'>Works at twitter</h1>
                </div>
            </div>
            {
                following ? <Button onClick={unfollow} className='bg-white border border-gray-300 text-black hover:bg-white hover:opacity-[0.9]' variant="default">Un Follow</Button> :
                    <Button onClick={follow} className='bg-blue-400 hover:!bg-blue-500' variant="default">Follow</Button>
            }

        </div>
    )
}

export default SuggestedAccount