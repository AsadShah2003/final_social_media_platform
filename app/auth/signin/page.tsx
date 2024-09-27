import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SigninForm from "./form";

export default async function SigninPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return <SigninForm />;
}
