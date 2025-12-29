import { useState } from "react";
import { X, Link2, Home, BarChart3, Settings, LogOut } from "lucide-react";

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentPage?: string;
  onNavigateToHome?: () => void;
  onNavigateToLinks?: () => void;
  onNavigateToAnalytics?: () => void;
  onNavigateToLanding?: () => void;
}

export function MobileNav({
  isOpen,
  onClose,
  currentPage,
  onNavigateToHome,
  onNavigateToLinks,
  onNavigateToAnalytics,
  onNavigateToLanding,
}: MobileNavProps) {
  const handleNavigate = (callback?: () => void) => {
    callback?.();
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white border-r border-gray-200 flex flex-col z-50 transform transition-transform duration-300 lg:hidden ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link2 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Shortify</span>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg">
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            {onNavigateToHome && (
              <button
                onClick={() => handleNavigate(onNavigateToHome)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  currentPage === "dashboard" || currentPage === "home"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Home className="w-5 h-5" />
                <span>Home</span>
              </button>
            )}
            {onNavigateToLinks && (
              <button
                onClick={() => handleNavigate(onNavigateToLinks)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  currentPage === "links"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <Link2 className="w-5 h-5" />
                <span>Links</span>
              </button>
            )}
            {onNavigateToAnalytics && (
              <button
                onClick={() => handleNavigate(onNavigateToAnalytics)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg ${
                  currentPage === "analytics"
                    ? "text-blue-600 bg-blue-50"
                    : "text-gray-600 hover:bg-gray-50"
                }`}
              >
                <BarChart3 className="w-5 h-5" />
                <span>Analytics</span>
              </button>
            )}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          {onNavigateToLanding && (
            <button
              onClick={() => handleNavigate(onNavigateToLanding)}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <LogOut className="w-5 h-5" />
              <span>Log Out</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
}
