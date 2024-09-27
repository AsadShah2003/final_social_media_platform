import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { userID } = await req.json()
        const getAllPosts = await prisma.posts.findMany();
        if (!getAllPosts || getAllPosts.length === 0) {
            return NextResponse.json({
                message: "ERROR",
                status: "There are no posts in db",
            });
        }
        // Use map with Promise.all to handle asynchronous author fetching
        const postsWithAuthorNames = await Promise.all(
            getAllPosts.map(async (post) => {
                const author = await prisma.users.findFirst({
                    where: {
                        id: post.authorID,
                    },
                });

                return {
                    ...post,
                    totalLikes: !post.totalLikes ? 0 : post.totalLikes,
                    totalComments: !post.totalComments ? 0 : post.totalComments,
                    authorName: author?.username || "Unknown Author",
                    isMine: post.authorID === parseInt(userID)
                };
            })
        );

        return NextResponse.json({
            message: "OK",
            posts: postsWithAuthorNames,
        });

    } catch (error: any) {
        return NextResponse.json({
            message: "Something went wrong",
            status: error.message,
        });
    }
}
