import React from "react";
import { TASK_STATUS } from "../config/constants";
import Badge from "./Badge";

const statusVariants = {
  [TASK_STATUS.TODO]: {
    variant: "secondary",
    icon: (
      <svg
        className="w-3 h-3 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  [TASK_STATUS.IN_PROGRESS]: {
    variant: "info",
    icon: (
      <svg
        className="w-3 h-3 mr-1 animate-spin"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
        />
      </svg>
    ),
  },
  [TASK_STATUS.UNDER_REVIEW]: {
    variant: "warning",
    icon: (
      <svg
        className="w-3 h-3 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
        <path
          fillRule="evenodd"
          d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
  [TASK_STATUS.COMPLETED]: {
    variant: "success",
    icon: (
      <svg
        className="w-3 h-3 mr-1"
        fill="currentColor"
        viewBox="0 0 20 20"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
          clipRule="evenodd"
        />
      </svg>
    ),
  },
};

const StatusBadge = ({ status, showIcon = true, ...props }) => {
  const statusConfig =
    statusVariants[status] || statusVariants[TASK_STATUS.TODO];

  return (
    <Badge variant={statusConfig.variant} {...props}>
      {showIcon && statusConfig.icon}
      {status}
    </Badge>
  );
};

export default StatusBadge;
