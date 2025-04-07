import React from "react";

const variants = {
  primary: "bg-blue-100 text-blue-800",
  secondary: "bg-gray-100 text-gray-800",
  success: "bg-green-100 text-green-800",
  danger: "bg-red-100 text-red-800",
  warning: "bg-yellow-100 text-yellow-800",
  info: "bg-sky-100 text-sky-800",
  dark: "bg-gray-700 text-white",
};

const sizes = {
  sm: "text-xs px-2 py-0.5",
  md: "text-sm px-2.5 py-0.5",
  lg: "text-base px-3 py-1",
};

const Badge = ({
  children,
  variant = "primary",
  size = "md",
  rounded = "full",
  className = "",
  ...props
}) => {
  const variantClasses = variants[variant] || variants.primary;
  const sizeClasses = sizes[size] || sizes.md;
  const roundedClass = rounded === "full" ? "rounded-full" : "rounded";

  return (
    <span
      className={`
        inline-flex items-center font-medium
        ${variantClasses}
        ${sizeClasses}
        ${roundedClass}
        ${className}
      `}
      {...props}
    >
      {children}
    </span>
  );
};

export default Badge;
