"use client"
import React, { useEffect, useState } from 'react'
import SuggestedAccount from './SuggestedAccount'
import { initSuggestionsAction } from '@/actions/suggestions-action'
import { getSession } from 'next-auth/react'
import { initAddSocialNoAction } from '@/actions/addsocialnos-action'


const Suggestions = () => {
    let uid: number
    const [suggestions, setSuggestions]: any = useState()

    useEffect(() => {

        async function initSetup() {
            const uid = await getSession()
            const getSugesstions = await initSuggestionsAction(uid?.user?.id!)
            if (uid && uid?.user && uid.user.id && getSugesstions) {
                const filterSelf = getSugesstions.filter((sugest: any) => parseInt(sugest.id) !== uid.user.id)
                setSuggestions(filterSelf)
            }
        }
        initSetup()

    }, [])


    const handleTryToFollow = async (followerID: number) => {
        const session = await getSession()
        uid = session?.user.id!
        const res = await initAddSocialNoAction("addFollower", session?.user?.id!, followerID)
        console.log("I followed ", followerID)
        console.log(res)
    }
    const unFollowHandler = async (unFollowedUser: number) => {
        const session = await getSession()
        uid = session?.user.id!
        const res = await initAddSocialNoAction("removeFollower", session?.user?.id!, unFollowedUser)
        console.log("I un-followed ", unFollowedUser)
        console.log(res)
    }



    return (
        <div className='p-2 fixed top-24 min-h-screen w-[305px]'>
            <h1 className='font-bold'>Suggestions</h1>
            <div className='mt-5 w-full flex flex-col gap-5'>
                {
                    suggestions && suggestions.length > 0 ? suggestions.map((sugest: any, idx: any) => (
                        <main key={idx}>
                            <SuggestedAccount unFollowHandler={unFollowHandler} isFollowing={sugest.amIFollowing} uid={sugest.id} addFollowHandler={handleTryToFollow} username={sugest.username} />
                        </main>
                    )) :
                        <h1>No Suggestions to show</h1>
                }

            </div>
        </div>
    )
}

export default Suggestions