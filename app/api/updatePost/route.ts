import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {

        const { postID, actionType, actionBy, comment } = await req.json()

        console.log("Got", {
            postID, actionType, actionBy, comment
        })

        var post
        if (postID) {
            post = await prisma.posts.findFirst({
                where: {
                    id: parseInt(postID),
                },
            })
            if (!post) {
                return NextResponse.json({
                    message: "ERROR",
                    status: "cant get the post for further actions"
                });
            }
        }

        if (actionType && actionType === "like") {
            //check if already liked once
            const check = await prisma.likes.findFirst({
                where: {
                    authorID: parseInt(actionBy),
                    LikedPost: parseInt(postID)
                }
            })
            if (check) {
                await prisma.likes.delete({
                    where: {
                        id: check.id,
                        authorID: parseInt(actionBy),
                        LikedPost: parseInt(postID)
                    }
                })
                await prisma.posts.update({
                    where: {
                        id: parseInt(postID),
                    },
                    data: {
                        totalLikes: post?.totalLikes! - 1
                    }
                })

                return NextResponse.json({
                    message: "ERROR",
                    status: "Disliked successfully"
                })
            }
            //now add that like to that post in likes table and first check if it already not exits
            const checkLike = await prisma.likes.findFirst({
                where:
                {
                    authorID: parseInt(actionBy),
                    LikedPost: parseInt(postID)
                }
            })
            if (!checkLike) {
                //add like
                await prisma.posts.update({
                    where: {
                        id: parseInt(postID),
                    },
                    data: {
                        totalLikes: !post?.totalLikes ? 1 : post?.totalLikes + 1
                    }
                })
                const createLike = await prisma.likes.create({
                    data: {
                        authorID: parseInt(actionBy),
                        LikedPost: parseInt(postID)
                    }
                })
                if (!createLike) {
                    return NextResponse.json({
                        message: "ERROR",
                        status: "Cant add like to that post"
                    });
                }

                return NextResponse.json({
                    message: "OK",
                    status: "Like added successfully"
                });
            }

        } else if (actionType && actionType === "comment") {
            console.log("In rughgt")
            const updatePost = await prisma.posts.update({
                where: {
                    id: parseInt(postID),
                },
                data: {
                    totalComments: !post?.totalComments ? 1 : post?.totalComments + 1
                }
            })
            if (!updatePost) {
                return NextResponse.json({
                    message: "OK",
                    status: "Cant increment post comment counter"
                });
            }

            //create a comment in comments table
            const createComment = await prisma.comments.create({
                data: {
                    authorID: parseInt(actionBy),
                    comment,
                    postID: parseInt(postID)
                }
            })
            console.log("comment: ", createComment)
            if (!createComment) {
                return NextResponse.json({
                    message: "ERROR",
                    status: "Cant create a comment for that post"
                });
            }

            return NextResponse.json({
                message: "OK",
                status: "Comment added successfully"
            });
        }

        return NextResponse.json({
            message: "ERROR",
            status: "Post not created"
        });

    } catch (error: any) {
        return NextResponse.json({
            message: "Something went wrong",
            status: error.message
        });
    }
}
