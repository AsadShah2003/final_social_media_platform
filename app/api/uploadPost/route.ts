import { prisma } from "@/prisma/prisma";
import { mkdir, stat } from "fs/promises";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(req: Request) {

    try {
        const imageNames: string[] = [];
        const data = await req.formData();
        const postContent = data.get("postContent");
        const authorID = data.get("authorID");

        if (!authorID) {
            return NextResponse.json({
                message: "ERROR",
                status: "Author ID is missing"
            });
        }

        // Get the user folder and today's date folder
        const userFolder = join("public/storage", `user_${authorID}`);
        const dateFolder = join(userFolder, new Date().toISOString().split('T')[0]); // YYYY-MM-DD format

        // Check and create the user and date folders if they do not exist
        await ensureDirectoryExists(userFolder);
        await ensureDirectoryExists(dateFolder);

        // Iterate over form data to handle image files
        for (const [key, val] of data.entries()) {
            if (key.includes("image")) {
                const file = val as unknown as File;
                const bytes = await file.arrayBuffer();
                const buffer = Buffer.from(bytes);
                imageNames.push(file.name);

                // Write the file to the user's date folder
                const filePath = join(dateFolder, file.name);
                await writeFile(filePath, buffer);
            }
        }

        // Create post in the database if post content and author ID exist
        if (postContent && authorID) {
            const createPost: any = await prisma.posts.create({
                data: {
                    postContent: postContent.toString(),
                    authorID: parseInt(authorID.toString()),
                    PostImagesNames: JSON.stringify({
                        images: imageNames
                    })
                }
            });

            const getAuthorName = await prisma.users.findFirst({
                where: {
                    id: parseInt(authorID.toString())
                }
            })

            ///attach additional props to createdPost
            createPost.totalLikes = !createPost.totalLikes ? 0 : createPost.totalLikes
            createPost.totalComments = !createPost.totalComments ? 0 : createPost.totalComments
            createPost.authorName = getAuthorName?.username ? getAuthorName?.username : "Unknown Author"
            createPost.isMine = true


            //    totalLikes: !post.totalLikes ? 0 : post.totalLikes,
            //    totalComments: !post.totalComments ? 0 : post.totalComments,
            //    authorName: author?.username || "Unknown Author",
            //    isMine: post.authorID === parseInt(userID)

            if (createPost) {
                return NextResponse.json({
                    message: "OK",
                    status: "Post created",
                    createdPost: createPost
                });
            }
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

// Helper function to check if a directory exists, and create it if it doesn't
async function ensureDirectoryExists(path: string) {
    try {
        await stat(path); // Check if directory exists
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            // Directory does not exist, so create it
            await mkdir(path, { recursive: true });
        } else {
            throw err; // Some other error occurred
        }
    }
}
