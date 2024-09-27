"use client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { VscLoading } from "react-icons/vsc";
import { FormEvent, useState } from "react";
import { Label } from "@/components/ui/label";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useToast } from "@/components/custom/CustomToast";


const SigninForm = () => {
  const { push } = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { showToast } = useToast()
  const onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      username: formData.get("username"),
      password: formData.get("password"),
      redirect: false,
    });

    if (res?.ok) {
      showToast("You are signed in successfully", "success", 3000)

      setIsLoading(false);
      console.log("Login success!")
      push("/")
    }
    if (res?.error) {
      showToast("Your sign in attempt failed", "error", 3000)

      console.log("Login Failed!")
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-[600px] mt-32 shadow-md h-fit">
      {/* LOGIN CONTAINER */}
      <div className=" flex flex-col w-full gap-16 pb-10">
        {/* Login form */}
        <div className={" flex-[1] p-5 flex flex-col items-center"}>
          <h1 className="mt-4 text-3xl font-bold">Login to your account</h1>
          <p className="mt-5">
            Please login with the data you entered during registration
          </p>
          <form
            onSubmit={onFormSubmit}
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
                Signin
              </Button>
              {isLoading && (
                <VscLoading
                  color="white"
                  size={18}
                  className="font-bold absolute top-[1.6rem] left-[9.6rem] animate-spin"
                />
              )}
            </div>
          </form>
          <div className="mt-4 flex flex-col  gap-6">
            <div className={"flex items-center gap-1"}>
              <span className="text-sm">Don&apos;t have an account?</span>
              <Link
                className="text-sm text-blue-500 font-medium"
                href="/auth/signup"
              >
                Signup
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SigninForm;
