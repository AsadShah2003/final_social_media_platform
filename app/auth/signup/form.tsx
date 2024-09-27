"use client"
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VscLoading } from "react-icons/vsc";
import { FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { initSignupAction } from "@/actions/signup-actions";

const SignupForm = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const registerAction = async (formData: FormData) => {
    setIsLoading(true)

    const username = formData.get("username")?.toString()
    const password = formData.get("password")?.toString()

    if (username && password) {
      setTimeout(async () => {
        await initSignupAction(username, password).then((res) => {
          console.log(res)
          setIsLoading(false)
        })
      }, 1500)
    }

  };

  return (
    <div className="max-w-[600px] mt-32 shadow-md h-fit">
      {/* LOGIN CONTAINER */}
      <div className=" flex flex-col w-full gap-16 pb-10">
        {/* Login form */}
        <div className={" flex-[1] p-5 flex flex-col items-center"}>
          <h1 className="mt-4 text-3xl font-bold">Register a new account</h1>
          <p className="mt-5">
            Please fill in the info below to register a new account
          </p>
          <form
            action={registerAction}
            className={" mt-6 flex flex-col w-full mx-auto gap-3"}
          >
            <div className="flex flex-col gap-3">
              <Label htmlFor="email">Username*</Label>
              <Input
                className="p-6"
                type="text"
                name="username"
                autoComplete="on"
                placeholder="Write your username"
              />
            </div>
            <div className="mt-0.5 flex flex-col gap-3">
              <Label htmlFor="email">Password*</Label>
              <Input
                className="p-6"
                type="password"
                name="password"
                autoComplete="on"
                placeholder="Write your Password"
              />
            </div>
            <div className="relative">
              <Button
                type="submit"
                className="mt-3 p-6 w-full"
                variant="default"
                disabled={isLoading}
              >
                Signup
              </Button>
              {isLoading && (
                <VscLoading
                  color="white"
                  size={18}
                  className="font-bold absolute top-[1.6rem] left-[8.5rem] animate-spin"
                />
              )}
            </div>
          </form>
          <div className="mt-4 flex flex-col  gap-6">
            <div className={"flex items-center gap-1"}>
              <span className="text-sm">Already have an account?</span>
              <Link
                className="text-sm text-blue-500 font-medium"
                href="/auth/signin"
              >
                Signin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupForm;
