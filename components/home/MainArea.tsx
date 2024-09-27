"use client"
import React, { useEffect } from 'react'
import PostGrid from './PostGrid'
import Suggestions from './Suggestions'
import LeftSide from './LeftSide'
import CreateAPost from './CreateAPost'
import { useHome } from '@/store/useHome'

const MainArea = () => {

    const { doRefresh } = useHome()
    useEffect(() => {
        doRefresh()
    }, [])

    return (
        <div className='wrapper_ overflow-y-scroll mx-auto h-screen max-w-[1500px] px-4 pt-8 flex gap-16'>
            <aside className='flex-[0.4]'>
                <LeftSide />
            </aside>
            <main className='flex-[1] main-area mt-2'>
                <CreateAPost />
                <PostGrid />
            </main>
            <aside className='flex-[0.3]'>
                <Suggestions />
            </aside>
        </div>

    )
}

export default MainArea