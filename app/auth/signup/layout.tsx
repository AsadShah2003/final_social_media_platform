import React from "react";

const SignupLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="min-h-screen w-full max-w-[1200px] mx-auto flex justify-center pt-32">
      {children}
    </main>
  );
};

export default SignupLayout;
