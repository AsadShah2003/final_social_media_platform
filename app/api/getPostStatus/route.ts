import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const result: any = {}

        const { postID, userID } = await req.json()
        if (!postID) {
            return NextResponse.json({
                message: "ERROR",
                status: "post id is required",
            });
        }

        //check like status
        const likeStatus = await prisma.likes.findFirst({
            where: {
                authorID: parseInt(userID),
                LikedPost: parseInt(postID)
            }
        })
        if (!likeStatus) {
            result.isLiked = false
        } else {
            result.isLiked = true
        }
        //fetch all comments
        const comments = await prisma.comments.findMany({
            where: {
                postID: parseInt(postID)
            }
        })


        if (!comments) {
            return NextResponse.json({
                message: "ERROR",
                status: "Cant fetch all comments"
            });

        }
        const commentsWithAuthorName = await Promise.all(
            comments.map(async (comment) => {
                const author = await prisma.users.findFirst({
                    where: {
                        id: comment.authorID,
                    },
                });
                return {
                    ...comment,
                    authorName: author?.username || "Unknown Author",
                };
            })
        );



        result.comments = commentsWithAuthorName

        return NextResponse.json({
            message: "OK",
            data: result,
        });

    } catch (error: any) {
        return NextResponse.json({
            message: "Something went wrong",
            status: error.message,
        });
    }
}
