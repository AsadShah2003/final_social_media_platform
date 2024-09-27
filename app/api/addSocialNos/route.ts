import { prisma } from "@/prisma/prisma"
import { NextResponse } from "next/server"


export async function POST(req: Request) {

    try {

        const { type, userID, followerID } = await req.json()

        console.log("I got : ", type, " ", userID, " ", followerID)

        if (type === "addFollower") {
            const createFollowerEntry = await prisma.followers.create({
                data: {
                    userID: parseInt(followerID),
                    followerID: parseInt(userID)
                }
            })
            const createFollowingEntry = await prisma.following.create({
                data: {
                    userID: parseInt(userID),
                    followingID: parseInt(followerID)
                }
            })

            if (!createFollowerEntry || !createFollowingEntry) {
                return NextResponse.json({
                    status: "ERROR",
                    message: "Cant create follower or following entry in db"
                })
            }
            return NextResponse.json({
                status: "OK",
                message: "Successfully created Follower and Following entry"
            })

        } else if (type === "removeFollower") {


            const followerRecordToDelete = await prisma.followers.findFirst({
                where: {
                    userID: parseInt(followerID),
                    followerID: parseInt(userID)
                }
            })
            const followingRecordToDelete = await prisma.following.findFirst({
                where: {
                    userID: parseInt(userID),
                    followingID: parseInt(followerID)
                }
            })

            console.log("Follower record del = ", followerRecordToDelete)
            console.log("Following record del = ", followingRecordToDelete)

            if (!followerRecordToDelete || !followingRecordToDelete) {
                return NextResponse.json({
                    status: "ERROR",
                    message: "Something went wrong in fetch the specific following and follower record"
                })
            }
            //just delete the entries from our following list
            const delFollowing = await prisma.following.delete({
                where: {
                    id: followingRecordToDelete.id,
                }
            })
            const delFollower = await prisma.followers.delete({
                where: {
                    id: followerRecordToDelete.id,
                }
            })

            if (!delFollower || !delFollowing) {
                return NextResponse.json({
                    status: "ERROR",
                    message: "Cant remove either follower or following entry from db"
                })
            }

            return NextResponse.json({
                status: "OK",
                message: "Successfully removed follower and following"
            })
        }

        return NextResponse.json({
            status: "ERROR",
            message: "Suomething went wrong"
        })

    } catch (error: any) {
        return NextResponse.json({
            message: "Something went wrong in adding social numbers to the profile",
            status: error.message
        })
    }

}