import { create } from "zustand"

export const useHome = create((set: any) => ({
    //curr interacting post
    refresh: false,
    doRefresh: () => set((state: any) => ({ refresh: !state.refresh })),

    posts: [],
    setPosts: (new_posts: []) => set(() => ({
        posts: new_posts
    })),
    addSinglePost: (post: any) => set((state: any) => ({
        posts: [...state.posts, post]
    })),
    removePost: (postID: number) => set((state: any) => ({
        posts: state.posts.filter((post: any) => post.id !== postID)
    }))

}))