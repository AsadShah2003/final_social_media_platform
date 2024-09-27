"use server"
import axios from "axios"

export async function initProfileUpdateAction(data: FormData) {
    "use server"
    const req = await fetch("http://localhost:3000/api/updateProfile", {
        method: "POST",
        body: data
    })
    const res = await req.json()
    return res
}