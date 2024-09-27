"use server"

export async function initSuggestionsAction(uid: number) {
    let res: [] = []
    await fetch(`http://localhost:3000/api/getSuggestions?userID=${uid}`, {
        method: "GET",
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => res.json())
        .then((data) => {
            res = data.suggestions
        })
    return res
}