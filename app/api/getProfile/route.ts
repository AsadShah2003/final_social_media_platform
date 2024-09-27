import { prisma } from "@/prisma/prisma"
import { NextResponse } from "next/server"

//hardcoded method to get desired id
function getQueryParamsFromURL(url: string) {
    return parseInt(url.split("?")[1].split("=")[1])
}

export async function GET(req: Request) {

    try {
        const userID = getQueryParamsFromURL(req.url)
        const getUser: any = await prisma.users.findFirst({
            where: {
                id: userID
            }
        })
        if (!getUser) {
            return NextResponse.json({
                message: "User profile not found",
                status: "ERROR"
            })
        }
        delete getUser.password

        //also get followers and following count
        const followersCount = await prisma.followers.count({
            where: {
                userID: userID
            }
        })
        const followingCount = await prisma.following.count({
            where: {
                userID: userID
            }
        })
        getUser.followerCount = !followersCount ? 0 : followersCount
        getUser.followingCount = !followingCount ? 0 : followingCount

        console.log("I got followers count ", followersCount)
        console.log("I got following count ", followingCount)

        //fetch posts as well
        const getPosts = await prisma.posts.findMany({
            where: {
                authorID: userID
            }
        })

        // Use map with Promise.all to handle asynchronous author fetching
        const postsWithAuthorNames = await Promise.all(
            getPosts.map(async (post) => {
                const author = await prisma.users.findFirst({
                    where: {
                        id: post.authorID,
                    },
                });

                return {
                    ...post,
                    authorName: author?.username || "Unknown Author",
                };
            })
        );

        if (!getPosts) {
            return NextResponse.json({
                message: "Can't fetch posts for the user",
                status: "ERROR"
            })
        }

        getUser.posts = postsWithAuthorNames

        return NextResponse.json({
            status: "OK",
            profile: getUser
        })

    } catch (error: any) {
        return NextResponse.json({
            message: "Something went wrong fetching the profile",
            status: error.message
        })
    }

}