import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import SignupForm from "./form";

export default async function SignupPage() {
  const session = await getServerSession();
  if (session) {
    redirect("/");
  }
  return <SignupForm />;
}
