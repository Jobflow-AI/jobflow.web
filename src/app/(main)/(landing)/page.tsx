import Image from "next/image";
import HeroSection from "./_components/HeroSection";
import JobSection from "./_components/JobSection";
import TabSection from "./_components/TabSection";
import Footer from "./_components/Footer";

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-r from-[#FFF8F2] via-[#FDBA74] to-[#FFF8F2] min-h-screen">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6">
        <div className="text-2xl font-bold">JobFlow</div>
        {/* <nav className="space-x-6 text-lg">
          <a href="#" className="hover:text-gray-700">
            Product
          </a>
          <a href="#" className="hover:text-gray-700">
            Templates
          </a>
          <a href="#" className="hover:text-gray-700">
            Pricing
          </a>
          <a href="#" className="hover:text-gray-700">
            Solutions
          </a>
        </nav> 
        <button className="px-6 py-2 bg-black text-white rounded-full hover:opacity-90">
          Get Started — It's Free
        </button>*/}
      </header>

      {/* Hero Section */}
      <HeroSection />

      {/* Job Cards Section */}
      <JobSection />

      {/* Tabs Section */}
      <TabSection />

      {/* Footer  */}
      <Footer />
    </div>
  );
};

export default LandingPage;
