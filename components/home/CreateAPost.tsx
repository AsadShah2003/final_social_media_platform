"use client"
import { useEffect, useState } from "react";
import { FcStackOfPhotos } from "react-icons/fc";
import { AiOutlineClose } from 'react-icons/ai'; // Cross icon
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarImage, AvatarFallback } from '@radix-ui/react-avatar'
import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from '../ui/button'
import { inter, roboto } from "@/utils/Fonts"
import { useRef } from "react";
import { initPostUpload } from "@/actions/post-upload-action";
import { useToast } from "../custom/CustomToast";
import { getSession } from "next-auth/react";
import { useHome } from "@/store/useHome";


const CreateAPost = () => {
    let uid = 0
    const [img, setImg] = useState<string | null>("")
    const getAuthState = async () => {
        const session = await getSession()
        if (session && session.user && session.user.profileImage && session.user.id) {
            setImg(`/profile/user_${session.user.id}/${session.user.profileImage}`)
            uid = session.user.id
        }
    }

    useEffect(() => {
        getAuthState()

    }, [])


    return <>
        <div className='write_a_comment w-full py-4 flex items-center gap-4 p-3 rounded-lg'>
            <Avatar className='ring-1  ring-gray-300 rounded-full p-0.5'>
                <AvatarImage className='rounded-full !w-10 !h-10 !object-cover !bg-center' src={
                    img ? img : undefined
                } alt="@shadcn" />
                <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <PostCreateModal />
        </div >


    </>
}

export default CreateAPost


const PostCreateModal = () => {
    const { doRefresh } = useHome()
    const [selectedImages, setSelectedImages] = useState<string[]>([]);  //for previewing
    const [images, setImages] = useState<File[]>([]); // store the File objects for upload
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [isUploading, setIsUploading] = useState(false)
    const [postContent, setPostContent] = useState("")
    const { showToast } = useToast()
    const closeRef = useRef<any>()

    const handleFileInputClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click(); // Programmatic click on input
        }
    };

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files) {
            const imageUrls = Array.from(files).map(file => URL.createObjectURL(file)); // Create URLs for preview
            setSelectedImages(prevImages => [...prevImages, ...imageUrls]); // Append to previous images

            const imgs = []
            for (let i = 0; i < files.length; i++) {
                imgs.push(files?.[i])
            }

            setImages(imgs)
        }
    };

    const handleRemoveImage = (indexToRemove: number) => {
        setSelectedImages(prevImages => prevImages.filter((_, index) => index !== indexToRemove));
    };

    const { addSinglePost } = useHome()
    const handlePostUpload = async () => {
        const session = await getSession()

        if (session && session.user) {
            setIsUploading(true)

            setTimeout(async () => {
                if (images) {
                    const buildFormData = new FormData()
                    buildFormData.set("postContent", postContent)
                    buildFormData.set("authorID", session.user.id?.toString()!)

                    images.forEach((image, index) => {
                        buildFormData.append(`image${index + 1}`, image);  // Append each image file to formData
                    });

                    const res: any = await initPostUpload(buildFormData)
                    console.log("After post creation : ", res)

                    if (res.message === "OK") {
                        setIsUploading(false)
                        if (closeRef.current) {
                            closeRef.current.click()
                        }
                        addSinglePost(res.createdPost)

                        showToast("Successfully created the post", "success", 3000)
                        doRefresh()
                    }
                }

            }, 1500)

        }


        return
    }

    return (
        <Dialog>
            <DialogTrigger>
                <div className="cursor-pointer bg-gray-200 border border-gray-200 w-[600px] text-left p-3 rounded-full">
                    <p className={roboto.className + ' pl-2 text-sm'}>Create a new post</p>
                </div>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create Post</DialogTitle>
                    <DialogDescription>
                        Start creating your new post by providing info below
                    </DialogDescription>
                </DialogHeader>
                <form action={handlePostUpload} className="mt-2 w-full">
                    <Textarea placeholder="What's on your mind" className="resize-none border border-gray-300" onChange={(e) => setPostContent(e.target.value)} />
                    <div onClick={handleFileInputClick} className="mt-5">
                        <div className="flex items-center gap-2 cursor-pointer">
                            <FcStackOfPhotos size={26} />
                            <span className={inter.className + ' text-[0.8rem]'}>Attach Media</span>
                        </div>
                        <input
                            accept=".jpg, .jpeg, .png"
                            ref={fileInputRef}
                            className="hidden"
                            id="fileInput"
                            type="file"
                            onChange={handleFileChange}
                            multiple
                        />
                    </div>

                    {/* Render the image previews */}
                    {selectedImages.length > 0 && (
                        <div className="mt-4 flex gap-2 flex-wrap">
                            {selectedImages.map((image, index) => (
                                <div key={index} className="relative w-12 h-12 rounded-lg">
                                    <img src={image} alt="Selected preview" className="rounded-lg w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        className="absolute top-[-0.5rem] right-[-0.5rem] bg-white text-red-500 rounded-full p-1"
                                        onClick={() => handleRemoveImage(index)}
                                    >
                                        <AiOutlineClose size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}

                    <Button disabled={isUploading} type="submit" className="mt-4 relative top-2 w-full p-6 text-[1rem]">Post</Button>
                </form>
            </DialogContent>
            <DialogFooter className="hidden">
                <DialogClose asChild>
                    <   button ref={closeRef}>close</button>
                </DialogClose>

            </DialogFooter>
        </Dialog>
    );
};
