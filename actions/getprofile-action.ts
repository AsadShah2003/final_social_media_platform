"use server"

export async function initGetProfileAction(userID?: number) {
    let res: any
    await fetch(`http://localhost:3000/api/getProfile?userID=${userID}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => res.json())
        .then((data) => {
            res = data.profile
        })
    return res
}