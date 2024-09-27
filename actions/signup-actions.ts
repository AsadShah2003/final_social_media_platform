"use server"
import axios from "axios"

export async function initSignupAction(username: string, password: string) {
    "use server"
    const req = await axios.post("http://localhost:3000/api/auth/signup", {
        username,
        password
    })
    const res = await req.data
    return res
}