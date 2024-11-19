import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Find Your Job | Login",
  description:
    "Single Platform to get job from all platform",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
        <div className="flex flex-wrap items-center justify-center">
          {children}
        </div>
    
    </>
  );
}
