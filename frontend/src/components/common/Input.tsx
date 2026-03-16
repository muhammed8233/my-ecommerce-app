import React from 'react';

// 1. Define the interface for the Input props
interface InputProps {
  label?: string;                     // Optional label text
  type?: string;                      // Defaults to "text", but can be "number", "email", etc.
  value: string | number;             // The current value (from state)
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // The update function
  placeholder?: string;               // Optional ghost text
  required?: boolean;                 // HTML5 validation flag
}

const Input = ({ 
  label, 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required = false 
}: InputProps) => { // 2. Apply the interface here

  return (
    <div className="mb-4 text-left">
      {label && (
        <label className="block text-sm font-bold mb-2 text-gray-700">
          {label}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full px-3 py-2 border rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all border-gray-300"
      />
    </div>
  );
};

export default Input;
