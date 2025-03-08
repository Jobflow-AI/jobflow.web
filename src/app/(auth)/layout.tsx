import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JobFlow | Login",
  description: "Track, Find, and Land Your Dream Job—All in One Place!",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <>
        <div>
          {children}
        </div>
    
    </>
  );
}
