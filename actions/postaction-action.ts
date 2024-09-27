"use server"
import axios from "axios"

export async function initPostAction_Action(type: string, userID: number, postID: number) {
    "use server"
    const req = await axios.post("http://localhost:3000/api/postAction", {
        type,
        userID,
        postID
    })
    const res = await req.data
    return res
}