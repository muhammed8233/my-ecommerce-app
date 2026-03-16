import React from 'react';

// 1. Define the "shape" of the props
interface ButtonProps {
  children: React.ReactNode;          // Anything inside the tags (text, icons)
  onClick?: () => void;               // Optional click function
  type?: "button" | "submit" | "reset"; // Specific HTML types
  variant?: "primary" | "danger" | "outline"; // Only these 3 are allowed
  disabled?: boolean;
}

const Button = ({ 
  children, 
  onClick, 
  type = "button", 
  variant = "primary", 
  disabled = false 
}: ButtonProps) => { // 2. Apply the interface here

  const baseStyles = "px-4 py-2 rounded font-medium transition-colors disabled:opacity-50";
  
  // 3. Type the variants object so TS knows the keys
  const variants: Record<string, string> = {
    primary: "bg-blue-600 text-white hover:bg-blue-700",
    danger: "bg-red-600 text-white hover:bg-red-700",
    outline: "border border-gray-300 text-gray-700 hover:bg-gray-50",
  };

  return (
    <button 
      type={type} 
      onClick={onClick} 
      disabled={disabled} 
      className={`${baseStyles} ${variants[variant]}`}
    >
      {children}
    </button>
  );
};

export default Button;
