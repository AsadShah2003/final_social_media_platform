import { useSession } from "next-auth/react";
import MainArea from "@/components/home/MainArea";
import { inter } from "@/utils/Fonts";

export default function Home() {
  return (

    <div className={inter.className + " w-screen h-fit"}>
      <MainArea />
    </div>
  )
}
