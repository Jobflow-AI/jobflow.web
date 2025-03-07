import React from "react";
import Image from "next/image";

interface ButtonProps {
  icon?: React.ReactNode;
  text: string;
  className?: string;
  iconclass?: string;
}

const CustomButton: React.FC<ButtonProps> = ({ icon, text, className = "" , iconclass = ""}) => {
  return (
    <button
      className={`w-full flex items-center gap-3 px-2 py-2 rounded-lg bg-[#b9ff2c] transition-all duration-300 relative ${className}`}
    >
      {/* Floating Icon */}
      <div className={`bg-white shadow-[0_8px_15px_rgba(0,0,0,0.3)] rounded-md flex items-center justify-center ${iconclass}`}>
        {React.isValidElement(icon) ? (
          React.cloneElement(icon, {
            className: `w-3 h-3 ${icon.props.className || ""}`, // Merge existing class
          })
        ) : (
          <Image src={icon} alt="button icon" width={24} height={24} />
        )}
      </div>

      {text}
    </button>
  );
};

export default CustomButton;
