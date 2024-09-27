"use server"
export async function initPostStatusAction(postID: number | undefined, userID: number | undefined
) {
    let res
    await fetch("http://localhost:3000/api/getPostStatus", {
        method: "POST",
        body: JSON.stringify({
            postID,
            userID
        })
    }).then((res) => res.json())
        .then((data) => {
            res = data.data
        })
    return res
}