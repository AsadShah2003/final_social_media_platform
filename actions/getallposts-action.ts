"use server"

export async function getAllPosts(uid: number) {
    let res: [] = []
    await fetch("http://localhost:3000/api/getAllPosts", {
        method: "POST",
        body: JSON.stringify({
            userID: uid
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => res.json())
        .then((data) => {
            res = data.posts
        })
    return res
}