"use client";
import React, { useEffect, useState } from 'react';
import Post from './Post';
import { getAllPosts } from '@/actions/getallposts-action';
import { useHome } from '@/store/useHome';
import { getSession } from 'next-auth/react';

const PostGrid = () => {
    var userID = 0
    const { posts, setPosts } = useHome();
    const [isLoading, setIsLoading] = useState(true);
    const { refresh } = useHome()

    useEffect(() => {
        async function initPostRetrival() {
            const session = await getSession()
            if (session && session.user && session.user.id) {
                userID = session.user.id
            }
            const getPosts = await getAllPosts(userID);

            console.log("Got posts = ", getPosts)

            if (!getPosts) {
                setIsLoading(false)
                return
            }

            const sortedPosts = getPosts.sort((a: any, b: any) => {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            });

            setPosts(sortedPosts);

            setTimeout(() => {
                setIsLoading(false);
            }, 300);
        }
        initPostRetrival();
    }, []);

    return (
        <div className='w-full h-screen flex flex-col gap-12 mt-12'>
            {
                isLoading ? (
                    <div>
                        <Post isLoading={true} />
                        <Post isLoading={true} />
                        <Post isLoading={true} />
                    </div>
                ) : (
                    posts && posts.length > 0 ? posts.map((post: any, idx: any) => (
                        <div key={idx}>
                            <Post isSelf={post.isMine} reRender={refresh} id={parseInt(post.id)} totalLikes={parseInt(post.totalLikes)} totalComments={parseInt(post.totalComments)} images={JSON.parse(post.PostImagesNames)} authorID={post.authorID} isLoading={false} author={post.authorName} time={post.createdAt} content={post.postContent} />
                        </div>
                    )) : (
                        <h1 className='text-2xl text-center mt-6 font-bold'>No Posts to show</h1>
                    )
                )
            }
        </div>
    );
}

export default PostGrid;
