import { getUser } from "@/actions/user_actions";
import Sidebar from "@/components/shared/Sidebar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "JobFlow",
  description: "Track, Find, and Land Your Dream Job—All in One Place!",
};

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  const data = await getUser() || null

  return (
    <>
      {/* Navbar at the top */}
      
      <div className="flex overflow-hidden">
        {/* Sidebar fixed on the left */}
        <div className="fixed top-0 left-0 h-full w-16 bg-transparent">
          <Sidebar />
        </div>
        {/* Main content area for children */}
        <div className="ml-16 p-4 w-full">
          {children}
        </div>
      </div>
    </>
  );
}
