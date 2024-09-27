import { prisma } from "@/prisma/prisma";
import { NextResponse } from "next/server";

function getQueryParamsFromURL(url: string) {
    return parseInt(url.split("?")[1].split("=")[1])
}

export async function GET(req: Request) {

    try {
        const uid = getQueryParamsFromURL(req.url)
        const getSuggestions = await prisma.users.findMany()
        if (!getSuggestions) {
            return NextResponse.json({
                message: "ERROR",
                status: "No suggestion to show"
            })
        }
        // also tell whether I follow the suggest 
        const withFollowingCheck = await Promise.all(
            getSuggestions.map(async (suggestion: any) => {
                const checkDoIFollowIt = await prisma.following.findFirst({
                    where: {
                        userID: uid,
                        followingID: suggestion.id,
                    }
                })

                return {
                    ...suggestion,
                    amIFollowing: checkDoIFollowIt ? true : false
                }
            })
        )



        return NextResponse.json({
            message: "OK",
            suggestions: withFollowingCheck
        })


    } catch (error: any) {
        return NextResponse.json({
            message: "ERROR",
            status: error.message
        })
    }

}