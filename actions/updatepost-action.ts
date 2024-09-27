"use server"
export async function initPostUpdateAction(postID: number | undefined, actionType: string,
    actionBy: number | undefined, comment?: string
) {
    let res
    await fetch("http://localhost:3000/api/updatePost", {
        method: "POST",
        body: JSON.stringify({
            postID,
            actionType,
            actionBy,
            comment
        })
    }).then((res) => res.json())
        .then((data) => {
            res = data
        })
    return res

}