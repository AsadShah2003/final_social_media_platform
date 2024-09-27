import Image from "next/image"
import Link from "next/link"

const Navbar = () => {
    return (
        <header className='bg-white z-[2000] w-screen border-b border-b-gray-400 sticky top-0 h-fit'>
            <nav className='h-fit max-w-[1500px] mx-auto p-2 flex justify-center items-center'>
                <Link href="/">
                    <Image
                        alt='post-image'
                        width={0}
                        height={0}
                        unoptimized
                        className='z-[1] rounded-md w-[4.4rem] object-cover h-14'
                        priority
                        src={`/logo.png`
                        }
                    //src={`../../storage/user_${authorID}/${new Date(time).toISOString().split('T')[0]}/${}`}
                    />
                </Link>
            </nav>
        </header>
    )
}

export default Navbar