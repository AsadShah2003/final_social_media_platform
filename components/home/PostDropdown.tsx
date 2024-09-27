"use client"
import { initPostAction_Action } from '@/actions/postaction-action'
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuItem } from '@/components/ui/dropdown-menu'
import { useHome } from '@/store/useHome'
import React from 'react'
import { HiEllipsisHorizontal } from 'react-icons/hi2'

const PostDropdown = ({ isMine, postID, authorID }: { isMine: boolean, postID: number, authorID: number }) => {
    const { removePost, doRefresh } = useHome()

    const handlePostDropdownAction = async (actionName: string) => {
        switch (actionName) {
            case "hide":
                removePost(postID)
                doRefresh()
                break
            case "delete":
                const res = await initPostAction_Action("delete", authorID, postID)
                console.log(res)
                removePost(postID)
                break
        }
    }


    return (
        <DropdownMenu>
            <DropdownMenuTrigger className='!outline-none !border-none !ring-0'>
                <HiEllipsisHorizontal size={35} color='gray' />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='p-0 !outline-none !border-none !ring-0'>
                {
                    isMine === true ? <>
                        <DropdownMenuItem onClick={() => handlePostDropdownAction("hide")} className='font-medium cursor-pointer'>
                            Hide
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handlePostDropdownAction("delete")} className='!text-white font-medium cursor-pointer hover:opacity-[0.9] opacity-[1] p-2 !bg-red-500'>Delete</DropdownMenuItem>
                    </> : <>

                        <DropdownMenuItem onClick={() => handlePostDropdownAction("hide")} className='font-medium cursor-pointer'>
                            Hide
                        </DropdownMenuItem>

                    </>
                }

            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default PostDropdown