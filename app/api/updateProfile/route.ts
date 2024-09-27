import { prisma } from "@/prisma/prisma";
import { mkdir, stat } from "fs/promises";
import { writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import bcrypt from "bcrypt"

export async function POST(req: Request) {
    try {
        const frm = await req.formData()

        if (frm.get("toUpdate") === "password" && frm.get("newPassword")!.toString().length > 0) {
            let hashedPassword: string = await bcrypt.hash(frm.get("newPassword")!.toString(), 10)
            const updatePass = await prisma.users.update({
                where: {
                    id: parseInt(frm.get("userID")!.toString()),
                },
                data: {
                    password: hashedPassword
                }
            })
            if (!updatePass) {
                return NextResponse.json({
                    message: "ERROR",
                    status: "Error in changing password"
                });
            }

        } else if (frm.get("toUpdate") === "username" && frm.get("newUsername")!.toString().length > 0) {
            const updateUname = await prisma.users.update({
                where: {
                    id: parseInt(frm.get("userID")!.toString()),
                },
                data: {
                    username: frm.get("newUsername")!.toString()
                }
            })
            if (!updateUname) {
                return NextResponse.json({
                    message: "ERROR",
                    status: "Error in changing username"
                });
            }

        } else {

            const userFolder = join("public/profile", `user_${frm.get("userID")}`);
            await ensureDirectoryExists(userFolder);

            const file = frm.get("profileImage") as unknown as File;
            const bytes = await file.arrayBuffer();
            const buffer = Buffer.from(bytes);
            const filePath = join(userFolder, file.name);
            await writeFile(filePath, buffer);


            //update user in db
            const updateUser = await prisma.users.update({
                where: {
                    id: parseInt(frm.get("userID")!.toString()),
                },
                data: {
                    profileImage: filePath.split("\\")[3]
                }
            })

            if (!updateUser) {
                return NextResponse.json({
                    message: "ERROR",
                    status: `Can't update user profile`
                });
            }
            //public\profile\user_17\istockphoto-1333035210-612x612.jpg

            return NextResponse.json({
                message: "OK",
                status: `Successfully updated ${frm.get("toUpdate")?.toString()}}`,
                imgPath: filePath.split("\\")[3]
            });

        }

        return NextResponse.json({
            message: "ERROR",
            status: `Successfully updated ${frm.get("toUpdate")?.toString()}}`
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
