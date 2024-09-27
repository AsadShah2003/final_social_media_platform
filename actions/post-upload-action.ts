"use server"
export async function initPostUpload(frmData: FormData) {
    let res
    await fetch("http://localhost:3000/api/uploadPost", {
        method: "POST",
        body: frmData
    }).then((res) => res.json())
        .then((data) => {
            res = data
        })
    return res
}