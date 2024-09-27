"use client";
import { inter, lora, roboto } from '@/utils/Fonts';
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { HiEllipsisHorizontal } from "react-icons/hi2";
import { Separator } from '../ui/separator';
import { IoMdHeartEmpty } from 'react-icons/io';
import { IoHeart } from 'react-icons/io5';
import { FaRegComments } from "react-icons/fa";
import { Input } from '../ui/input';
import { IoMdSend } from "react-icons/io";
import { Skeleton } from "@/components/ui/skeleton"; // Skeleton component from shadcn
import { initPostStatusAction } from '@/actions/poststatus-action';
import { getSession } from 'next-auth/react';
import { initPostUpdateAction } from '@/actions/updatepost-action';
import { useHome } from '@/store/useHome';
import { useRouter } from 'next/navigation';
import { initGetProfileAction } from '@/actions/getprofile-action';
import PostDropdown from './PostDropdown';

interface PostProps {
    isSelf?: boolean,
    reRender?: boolean,
    id?: number,
    isLoading: boolean;
    author?: string,
    time?: any,
    content?: string,
    images?: any,
    authorID?: number,
    totalLikes?: number | null,
    totalComments?: number | null,
}

const Post: React.FC<PostProps> = ({ isSelf, reRender, id, isLoading, author, time, content, images, authorID, totalLikes, totalComments }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [oldStatus, setOldStatus] = useState({
        likeCount: 0,
        commentCount: 0
    })
    const [updatedStatus, setUpdatedStatus] = useState({
        likeCount: 0,
        commentCount: 0
    })
    const { push } = useRouter()
    const [comment, setComment] = useState("")
    const [commentsToShow, setCommentsToShow]: any = useState(null)
    const { doRefresh } = useHome()

    function formatDate(dateString: string): string {
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        const monthsOfYear = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

        const dateObj = new Date(dateString);
        const now = new Date();

        // Reset times for comparison (ignoring hours, minutes, seconds)
        const resetTime = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());

        const diffInMs = resetTime(now).getTime() - resetTime(dateObj).getTime();
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

        // Helper function to format time in 12-hour format
        const formatTime = (date: Date): string => {
            let hours = date.getHours();
            const minutes = date.getMinutes().toString().padStart(2, '0');
            const ampm = hours >= 12 ? 'PM' : 'AM';
            hours = hours % 12;
            hours = hours ? hours : 12; // the hour '0' should be '12'
            return `${hours}:${minutes} ${ampm}`;
        };

        if (diffInDays === 0) {
            // For today
            return `Today at ${formatTime(dateObj)}`;
        } else if (diffInDays === 1) {
            // For yesterday
            return `Yesterday at ${formatTime(dateObj)}`;
        } else if (diffInDays < 7) {
            // Less than 7 days ago
            const day = daysOfWeek[dateObj.getDay()];
            return `${day} at ${formatTime(dateObj)}`;
        } else {
            // More than 7 days ago
            const day = dateObj.getDate();
            const month = monthsOfYear[dateObj.getMonth()];
            return `${day} ${month} at ${formatTime(dateObj)}`;
        }
    }

    if (isLoading) {
        // Render skeletons if isLoading is true
        return (
            <div className="p-1 max-h-fit">
                <header className="flex justify-between items-center">
                    <Skeleton className="w-10 h-10 rounded-full  bg-zinc-300" />
                    <div className="flex-1 ml-4">
                        <Skeleton className="w-24 h-4 mb-1 bg-zinc-300" />
                        <Skeleton className="w-16 h-3 bg-zinc-300" />
                    </div>
                    <Skeleton className="w-8 h-8 bg-zinc-300" />
                </header>
                <main className="mt-4">
                    <Skeleton className="w-full h-[300px] rounded-md bg-zinc-300" />
                    <Skeleton className="mt-4 w-full h-16 bg-zinc-300" />
                </main>
                <Separator className="h-[1px] my-2" />
            </div>
        );
    }

    const [img, setImg] = useState<string | null>("")

    useEffect(() => {
        async function getAuthState(uid: number) {
            const profileImg = await initGetProfileAction(uid)
            setImg(profileImg.profileImage)
        }

        getAuthState(authorID!)



        if (!oldStatus.likeCount && !oldStatus.commentCount) {
            setOldStatus({
                commentCount: totalComments!,
                likeCount: totalLikes!
            })
        }

        async function getPostStatus() {
            const session = await getSession()
            const getStatus: any = await initPostStatusAction(id, session?.user?.id)
            setIsLiked(getStatus.isLiked)
            setCommentsToShow(getStatus.comments)
        }

        getPostStatus()

    }, [reRender])

    //handle post interaction like Likes/Comments
    const handlePostInteraction = async (type: string) => {
        const session = await getSession();
        const userID = session?.user?.id;

        console.log("Type is: ", type);

        if (type === "like") {
            // Optimistically toggle like state before waiting for the response
            setIsLiked((prevLiked) => !prevLiked);

            // Send like/dislike request to server
            const res: any = await initPostUpdateAction(id, "like", userID);

            if (res.status === "Like added successfully") {
                // Like was successfully added
                setUpdatedStatus((old) => ({
                    ...old,
                    likeCount: oldStatus.likeCount + 1
                }));
                setOldStatus((old) => ({
                    ...old,
                    likeCount: old.likeCount + 1
                }));
            } else if (res.status === "Disliked successfully") {
                // Like was successfully removed (dislike)
                setUpdatedStatus((old) => ({
                    ...old,
                    likeCount: oldStatus.likeCount - 1
                }));
                setOldStatus((old) => ({
                    ...old,
                    likeCount: old.likeCount - 1
                }));
            } else {
                // If server failed, revert the optimistic update
                setIsLiked((prevLiked) => !prevLiked);
            }

            doRefresh();
        } else if (type === "comment") {
            const res: any = await initPostUpdateAction(id, "comment", userID, comment);
            setCommentsToShow(res?.comments);
            doRefresh();

            setUpdatedStatus((old) => ({
                ...old,
                commentCount: old.commentCount + 1
            }));

            setOldStatus((old) => ({
                ...old,
                commentCount: old.commentCount + 1
            }));
        }
    };


    const openProfile = () => {
        push(`/profile?userID=${authorID}`)
    }

    return (
        <div className={inter.className + ' p-1 max-h-fit'}>
            <header className='flex justify-between'>
                <div onClick={openProfile} className='cursor-pointer flex gap-4 items-center'>
                    <Avatar className='w-10 rounded-full h-10 !object-cover'>
                        <AvatarImage className='rounded-full w-full h-full' src={
                            img ? `/profile/user_${authorID}/${img}` : undefined
                        } alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='flex flex-col text-sm'>
                        <h1 className='font-bold'>{author}</h1>
                        <span className='text-gray-500'>{new Date(time).toDateString()}</span>
                    </div>
                </div>
                <PostDropdown authorID={authorID!} postID={id!} isMine={isSelf!} />
            </header>
            <Separator className='my-2 h-[1px] bg-gray-300' />
            <main className='mt-4'>
                <p className={roboto.className + ' max-w-full mt-4'}>
                    {content}
                </p>
                {
                    images && (images.images.length > 0) && <>
                        <div className='mt-5'>
                            <Image
                                alt='post-image'
                                width={0}
                                height={0}
                                unoptimized
                                className='z-[1] rounded-md w-full object-cover max-h-[300px] shadow-lg'
                                priority
                                src={`/storage/user_${authorID}/${new Date(time).toISOString().split('T')[0]}/${images.images[0]}`
                                }
                            //src={`../../storage/user_${authorID}/${new Date(time).toISOString().split('T')[0]}/${}`}
                            />
                        </div>
                    </>
                }
            </main>

            <footer className='mt-2'>
                <div className='flex gap-4 items-center'>
                    <div className='flex gap-2 items-center'>
                        {
                            !isLiked ? (
                                <IoMdHeartEmpty
                                    size={25}
                                    color='black'
                                    onClick={() => handlePostInteraction("like")}
                                    className='cursor-pointer hover:text-red-600'
                                />
                            ) : (
                                <IoHeart
                                    size={25}
                                    onClick={() => handlePostInteraction("like")}
                                    className='text-red-500 cursor-pointer'
                                />
                            )
                        }
                        <span className='text-sm'>{totalLikes && !updatedStatus.likeCount ? totalLikes : updatedStatus.likeCount}</span>
                    </div>
                    <div className='flex gap-2 items-center'>
                        <FaRegComments size={28} color='gray' />
                        <span className='text-sm'>{totalComments && !updatedStatus.commentCount ? totalComments : updatedStatus.commentCount}</span>
                    </div>
                </div>

                <div className='mt-4 p-2 flex flex-col gap-2'>
                    <h1 className={'font-medium'}>Showing all comments</h1>
                    {
                        commentsToShow && commentsToShow.length > 0 && commentsToShow.map((comment: any, idx: any) => (
                            <div key={idx} className=''>

                                <div className='w-full flex items-center gap-3'>
                                    <Avatar className='h-9 w-9 ring-slate-300 rounded-full'>
                                        <AvatarImage className='rounded-full w-8 h-8 !object-cover' src={
                                            img ? `/profile/user_${authorID}/${img}` : undefined
                                        } alt="@shadcn" />
                                        <AvatarFallback>CN</AvatarFallback>
                                    </Avatar>
                                    <div className='flex flex-col text-sm'>
                                        <h1 className='font-bold'>{comment.authorName}</h1>
                                        <div className='flex justify-between items-center w-[620px]'>
                                            <p className='max-w-[300px] break-words'>{comment.comment}</p>
                                            <span className="text-xs">{formatDate(comment.createdAt)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))
                    }
                </div>

                <div className='flex w-full mt-3 items-center gap-3'>
                    <Avatar className='h-11 w-11 ring-slate-300 rounded-full'>
                        <AvatarImage className='rounded-full w-full h-full' src={
                            img ? `/profile/user_${authorID}/${img}` : undefined
                        } alt="@shadcn" />
                        <AvatarFallback>CN</AvatarFallback>
                    </Avatar>
                    <div className='relative w-full'>
                        <Input onChange={(e) => setComment(e.target.value)} className='border border-gray-300 py-6' placeholder='Write your comment' />
                        <IoMdSend onClick={() => handlePostInteraction("comment")} className='absolute right-2 top-3.5' color='black' size={25} />
                    </div>
                </div>

            </footer>
        </div>
    );
};

export default Post;
