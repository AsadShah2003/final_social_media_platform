import React from "react";

const SigninLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen p-1 w-full max-w-[1200px] mx-auto flex justify-center pt-32">
      {children}
    </main>
  );
};

export default SigninLayout;
