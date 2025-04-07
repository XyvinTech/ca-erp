import React from "react";

const Card = ({
  children,
  title,
  subtitle,
  footer,
  className = "",
  bodyClassName = "",
  titleClassName = "",
  subtitleClassName = "",
  footerClassName = "",
  hoverable = false,
  ...props
}) => {
  return (
    <div
      className={`
        bg-white rounded-lg shadow overflow-hidden
        ${hoverable ? "transition-shadow hover:shadow-md" : ""}
        ${className}
      `}
      {...props}
    >
      {(title || subtitle) && (
        <div className="px-4 py-4 sm:px-6 border-b border-gray-200">
          {title && (
            <h3
              className={`text-lg font-medium leading-6 text-gray-900 ${titleClassName}`}
            >
              {title}
            </h3>
          )}
          {subtitle && (
            <p className={`mt-1 text-sm text-gray-500 ${subtitleClassName}`}>
              {subtitle}
            </p>
          )}
        </div>
      )}

      <div className={`px-4 py-5 sm:p-6 ${bodyClassName}`}>{children}</div>

      {footer && (
        <div
          className={`px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200 ${footerClassName}`}
        >
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card;
