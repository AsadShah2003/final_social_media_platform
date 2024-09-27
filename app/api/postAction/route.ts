import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";


export async function POST(req: Request) {

    try {
        const { type, postID, userID } = await req.json()

        if (type === "delete") {
            const findPost = await prisma.posts.findFirst({
                where: {
                    id: parseInt(postID),
                }
            })
            if (!findPost) {
                return NextResponse.json({
                    status: "ERROR",
                    message: "Post not found"
                })
            }

            const delPost = await prisma.posts.delete({
                where: {
                    id: findPost?.id,
                    authorID: parseInt(userID)
                }
            })
            if (!delPost) {
                return NextResponse.json({
                    status: "ERROR",
                    message: "Post can't be deleted"
                })
            }
            return NextResponse.json({
                status: "OK",
                message: "Successfully deleted post",
                deletedPost: delPost
            })

        }

        return NextResponse.json({
            status: "OK",
            message: "Successfully completed operation"
        })

    } catch (error: any) {
        return NextResponse.json({
            message: "ERROR",
            status: error.message
        })
    }

}