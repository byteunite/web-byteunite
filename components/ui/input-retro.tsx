import React, { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

export const Input: React.FC<InputProps> = ({
    type = "text",
    placeholder = "Enter text",
    className = "",
    ...props
}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            className={`px-4 py-2 w-full rounded border-2 shadow-md transition focus:outline-hidden focus:shadow-xs mt-2 ${
                props["aria-invalid"]
                    ? "border-destructive text-destructive shadow-xs shadow-destructive"
                    : ""
            } ${className}`}
            {...props}
        />
    );
};
