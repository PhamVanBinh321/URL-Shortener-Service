import { useState } from "react";
import {
  Link2,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Search,
  Calendar,
  SlidersHorizontal,
  List,
  LayoutGrid,
  Rows3,
  Edit2,
  Share2,
  MoreHorizontal,
  Copy,
  ArrowRight,
  Info,
  Menu
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MobileNav } from "./MobileNav";

interface LinksPageProps {
  onNavigateToLanding: () => void;
  onNavigateToHome: () => void;
  onViewLinkDetail: (linkId: number) => void;
  onNavigateToAnalytics: () => void;
}

// Mock data for links
const mockLinks = [
  {
    id: 1,
    title: "Đăng nhập vào trang | Hệ thống đào tạo trực tuyến",
    shortUrl: "bit.ly/3L2hIeO",
    originalUrl: "https://courses.ut.edu.vn/course/view.php?id=17537&section=2",
    clicks: "Click data",
    date: "Dec 26, 2025",
    tags: "No tags",
    color: "bg-teal-500"
  },
  {
    id: 2,
    title: "Product Launch Campaign 2025",
    shortUrl: "bit.ly/launch25",
    originalUrl: "https://marketing.company.com/campaigns/product-launch-q1-2025",
    clicks: "1.2K clicks",
    date: "Dec 20, 2025",
    tags: "marketing",
    color: "bg-purple-500"
  },
  {
    id: 3,
    title: "Annual Report Q4 2024",
    shortUrl: "bit.ly/q4report",
    originalUrl: "https://docs.company.com/reports/annual-q4-2024-financial",
    clicks: "856 clicks",
    date: "Dec 15, 2025",
    tags: "reports",
    color: "bg-blue-500"
  },
];

export function LinksPage({ onNavigateToLanding, onNavigateToHome, onViewLinkDetail, onNavigateToAnalytics }: LinksPageProps) {
  const [viewMode, setViewMode] = useState<"list" | "card" | "grid">("card");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        currentPage="links"
        onNavigateToHome={onNavigateToHome}
        onNavigateToLinks={() => { }}
        onNavigateToAnalytics={onNavigateToAnalytics}
        onNavigateToLanding={onNavigateToLanding}
      />

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:fixed lg:left-0 lg:top-0 lg:h-full w-64 bg-white border-r border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Link2 className="w-8 h-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">Shortify</span>
          </div>
        </div>

        <nav className="flex-1 p-4">
          <div className="space-y-1">
            <button
              onClick={onNavigateToHome}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
              <Link2 className="w-5 h-5" />
              <span>Links</span>
            </button>
            <button
              onClick={onNavigateToAnalytics}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <BarChart3 className="w-5 h-5" />
              <span>Analytics</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg">
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-gray-200">
          <button
            onClick={onNavigateToLanding}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-4 sm:px-8 py-4 flex justify-between items-center gap-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              <div className="hidden sm:flex items-center gap-4 flex-1">
                <Search className="w-5 h-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  className="max-w-md border-gray-300"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <Button className="bg-teal-600 hover:bg-teal-700 text-white hidden sm:inline-flex">
                Upgrade
              </Button>
              <button className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hidden sm:flex">
                ?
              </button>
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-gray-700 text-white">VP</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          {/* Page Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Bitly Links</h1>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full sm:w-auto">
              Create link
            </Button>
          </div>

          {/* Mobile Search Bar */}
          <div className="sm:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 outline-none text-sm"
            />
          </div>

          {/* Filter Bar */}
          <div className="bg-white rounded-lg border border-gray-200 mb-6">
            <div className="p-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
              <div className="hidden sm:flex flex-1 items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg">
                <Search className="w-4 h-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search links"
                  className="flex-1 outline-none text-sm"
                />
              </div>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Filter by created date</span>
                <span className="sm:hidden">Date</span>
              </Button>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <SlidersHorizontal className="w-4 h-4" />
                <span className="hidden sm:inline">Add filters</span>
                <span className="sm:hidden">Filters</span>
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-sm text-gray-600">0 selected</span>
              <Button variant="ghost" size="sm" className="text-gray-600">
                Export
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                Hide
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600">
                Tag
              </Button>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded ${viewMode === "list" ? "bg-gray-100" : ""}`}
                >
                  <List className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setViewMode("card")}
                  className={`p-2 rounded ${viewMode === "card" ? "bg-gray-100" : ""}`}
                >
                  <Rows3 className="w-4 h-4 text-gray-600" />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded ${viewMode === "grid" ? "bg-gray-100" : ""}`}
                >
                  <LayoutGrid className="w-4 h-4 text-gray-600" />
                </button>
              </div>

              <Select defaultValue="active">
                <SelectTrigger className="w-full sm:w-[140px]">
                  <SelectValue placeholder="Show:" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Show: Active</SelectItem>
                  <SelectItem value="archived">Show: Archived</SelectItem>
                  <SelectItem value="all">Show: All</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Links List */}
          <div className="space-y-4 mb-8">
            {mockLinks.map((link) => (
              <Card
                key={link.id}
                className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                onClick={() => onViewLinkDetail(link.id)}
              >
                <div className="flex items-start gap-3 sm:gap-4">
                  {/* Color Icon */}
                  <div className={`w-10 h-10 ${link.color} rounded flex-shrink-0`}>
                    <svg viewBox="0 0 40 40" className="w-full h-full">
                      <rect x="8" y="16" width="8" height="16" fill="white" opacity="0.8" />
                      <rect x="20" y="8" width="8" height="24" fill="white" opacity="0.9" />
                      <rect x="32" y="12" width="8" height="20" fill="white" />
                    </svg>
                  </div>

                  {/* Link Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 mb-2">{link.title}</h3>

                    <div className="flex items-center gap-2 mb-3">
                      <span className="text-blue-600 font-medium">{link.shortUrl}</span>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Copy className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                      <ArrowRight className="w-4 h-4" />
                      <span className="truncate">{link.originalUrl}</span>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>{link.clicks}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        {link.date}
                      </span>
                      <span>{link.tags}</span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                    <button
                      className="p-2 hover:bg-gray-100 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Edit2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                      }}
                    >
                      <Share2 className="w-4 h-4 text-gray-600" />
                    </button>
                    <button
                      className="p-2 hover:bg-gray-100 rounded"
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewLinkDetail(link.id);
                      }}
                    >
                      <BarChart3 className="w-4 h-4 text-gray-600" />
                    </button>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-2 hover:bg-gray-100 rounded"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-4 h-4 text-gray-600" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Duplicate</DropdownMenuItem>
                        <DropdownMenuItem>Archive</DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  {/* Mobile More Button */}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button
                        className="sm:hidden p-2 hover:bg-gray-100 rounded flex-shrink-0"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <MoreHorizontal className="w-5 h-5 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Edit2 className="w-4 h-4 mr-2" />Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                        <Share2 className="w-4 h-4 mr-2" />Share
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => { e.stopPropagation(); onViewLinkDetail(link.id); }}>
                        <BarChart3 className="w-4 h-4 mr-2" />Analytics
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => e.stopPropagation()}>Archive</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600" onClick={(e) => e.stopPropagation()}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </Card>
            ))}
          </div>

          {/* Info Banner */}
          <div className="bg-teal-50 border border-teal-200 rounded-lg p-4 mb-6">
            <div className="flex items-start gap-3">
              <Info className="w-5 h-5 text-teal-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-700">
                Change a link's destination, even after you've shared it.{" "}
                <a href="#" className="text-teal-600 font-medium hover:underline">
                  Get redirects with every plan. View plans
                </a>
              </p>
            </div>
          </div>

          {/* End Message */}
          <div className="flex items-center justify-center gap-4 py-8">
            <div className="h-px bg-gray-300 w-20"></div>
            <span className="text-sm text-gray-500">You've reached the end of your links</span>
            <div className="h-px bg-gray-300 w-20"></div>
          </div>
        </main>
      </div>
    </div>
  );
}