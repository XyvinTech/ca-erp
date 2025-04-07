import React, { Fragment, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { BellIcon, CheckIcon, TrashIcon } from "@heroicons/react/24/outline";
import { useNotifications } from "../context/NotificationContext";
import { formatDistanceToNow } from "date-fns";

const NotificationDropdown = () => {
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    deleteNotification,
  } = useNotifications();
  const [isOpen, setIsOpen] = useState(false);

  const handleMarkAsRead = (e, id) => {
    e.stopPropagation();
    markAsRead(id);
  };

  const handleDeleteNotification = (e, id) => {
    e.stopPropagation();
    deleteNotification(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsRead();
  };

  // Format the notification date
  const formatDate = (dateString) => {
    try {
      return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
      return "Unknown date";
    }
  };

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button
          className="bg-white p-1 rounded-full text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="sr-only">View notifications</span>
          <BellIcon className="h-6 w-6" aria-hidden="true" />
          {unreadCount > 0 && (
            <span className="absolute top-0 right-0 block h-5 w-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center transform -translate-y-1/2 translate-x-1/2">
              {unreadCount > 9 ? "9+" : unreadCount}
            </span>
          )}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
        afterEnter={() => setIsOpen(true)}
        afterLeave={() => setIsOpen(false)}
      >
        <Menu.Items className="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-10">
          <div className="py-1">
            <div className="px-4 py-2 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-sm font-medium text-gray-900">
                Notifications
              </h3>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllAsRead}
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  Mark all as read
                </button>
              )}
            </div>

            {notifications.length === 0 ? (
              <div className="px-4 py-3 text-sm text-gray-500 text-center">
                No notifications
              </div>
            ) : (
              <div className="max-h-96 overflow-y-auto">
                {notifications.map((notification) => (
                  <Menu.Item key={notification.id}>
                    {({ active }) => (
                      <div
                        className={`
                          ${active ? "bg-gray-50" : ""}
                          ${!notification.read ? "bg-blue-50" : ""}
                          px-4 py-2 border-b border-gray-100 last:border-b-0
                        `}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {formatDate(notification.createdAt)}
                            </p>
                          </div>
                          <div className="flex space-x-1 ml-2">
                            {!notification.read && (
                              <button
                                onClick={(e) =>
                                  handleMarkAsRead(e, notification.id)
                                }
                                className="p-1 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                              >
                                <span className="sr-only">Mark as read</span>
                                <CheckIcon
                                  className="h-4 w-4"
                                  aria-hidden="true"
                                />
                              </button>
                            )}
                            <button
                              onClick={(e) =>
                                handleDeleteNotification(e, notification.id)
                              }
                              className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100"
                            >
                              <span className="sr-only">Delete</span>
                              <TrashIcon
                                className="h-4 w-4"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Menu.Item>
                ))}
              </div>
            )}

            {notifications.length > 0 && (
              <div className="px-4 py-2 border-t border-gray-200 text-center">
                <button
                  type="button"
                  className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                >
                  View all notifications
                </button>
              </div>
            )}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default NotificationDropdown;
