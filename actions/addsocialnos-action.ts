"use server"
export async function initAddSocialNoAction(type: string, userID: number, followerID?: number | null) {
    let res
    await fetch("http://localhost:3000/api/addSocialNos", {
        method: "POST",
        body: JSON.stringify({
            type,
            userID, followerID
        })
    }).then((res) => res.json())
        .then((data) => {
            res = data
        })
    return res

}