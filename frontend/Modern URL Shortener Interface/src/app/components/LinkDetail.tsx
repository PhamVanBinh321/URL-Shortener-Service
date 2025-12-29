import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Share2,
  MoreVertical,
  Copy,
  Calendar,
  Tag,
  Lock,
  BarChart3 as BarChartIcon,
  Link2,
  Settings,
  LogOut,
  Home,
  Menu
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { MobileNav } from "./MobileNav";



// Mock data for charts
const referrersData = [
  { name: "Direct", value: 45, color: "#f97316" },
  { name: "Social Media", value: 30, color: "#06b6d4" },
  { name: "Search", value: 25, color: "#3b82f6" },
];

const devicesData = [
  { name: "Mobile", value: 52, color: "#f97316" },
  { name: "Desktop", value: 35, color: "#06b6d4" },
  { name: "Tablet", value: 13, color: "#3b82f6" },
];

const engagementsData = [
  { date: "Jan 1", engagements: 12 },
  { date: "Jan 2", engagements: 19 },
  { date: "Jan 3", engagements: 15 },
  { date: "Jan 4", engagements: 28 },
  { date: "Jan 5", engagements: 22 },
  { date: "Jan 6", engagements: 35 },
  { date: "Jan 7", engagements: 30 },
  { date: "Jan 8", engagements: 18 },
  { date: "Jan 9", engagements: 15 },
  { date: "Jan 10", engagements: 24 },
  { date: "Jan 11", engagements: 28 },
  { date: "Jan 12", engagements: 32 },
  { date: "Jan 13", engagements: 38 },
  { date: "Jan 14", engagements: 26 },
  { date: "Jan 15", engagements: 22 },
];

const locationsData = [
  { country: "United States", clicks: 1248, percentage: 45 },
  { country: "Vietnam", clicks: 756, percentage: 27 },
  { country: "United Kingdom", clicks: 432, percentage: 16 },
  { country: "Germany", clicks: 224, percentage: 8 },
  { country: "France", clicks: 112, percentage: 4 },
];

export function LinkDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  // Mock link data
  const linkData = {
    title: "Đăng nhập vào trang | Hệ thống đào tạo trực tuyến",
    shortUrl: "bit.ly/3L2hIeO",
    originalUrl: "https://courses.ut.edu.vn/course/view.php?id=17537&section=2",
    created: "December 26, 2025 6:41 PM GMT+7",
    tags: "No tags",
  };

  return (
    <div className="min-h-screen bg-gray-50 overflow-auto">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="px-8 py-4">
          <button
            onClick={() => navigate('/links')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to list</span>
          </button>
        </div>
      </header>

      {/* Content */}
      <main className="px-8 py-6 max-w-7xl mx-auto">
        {/* Link Info Card */}
        <Card className="p-8 mb-6 bg-white rounded-lg border border-gray-200">
          <div className="flex items-start gap-6">
            {/* Color Icon */}
            <div className="w-12 h-12 bg-teal-500 rounded flex-shrink-0">
              <svg viewBox="0 0 48 48" className="w-full h-full">
                <rect x="10" y="20" width="8" height="16" fill="white" opacity="0.8" />
                <rect x="22" y="12" width="8" height="24" fill="white" opacity="0.9" />
                <rect x="34" y="16" width="8" height="20" fill="white" />
              </svg>
            </div>

            {/* Link Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{linkData.title}</h1>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Edit2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-600 font-medium">{linkData.shortUrl}</span>
                <button className="text-gray-400 hover:text-gray-600">
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-4">
                <span>↳</span>
                <span className="text-sm">{linkData.originalUrl}</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{linkData.created}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4" />
                  <span>{linkData.tags}</span>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* QR Code Section */}
        <Card className="p-8 mb-6 bg-white rounded-lg border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-6">QR Code</h2>
          <div className="flex items-start gap-8">
            <div className="w-40 h-40 bg-white border-2 border-gray-200 rounded-lg p-4 flex items-center justify-center">
              <svg viewBox="0 0 128 128" className="w-full h-full">
                {/* Simple QR Code pattern */}
                <rect x="0" y="0" width="16" height="16" fill="black" />
                <rect x="32" y="0" width="16" height="16" fill="black" />
                <rect x="64" y="0" width="16" height="16" fill="black" />
                <rect x="96" y="0" width="16" height="16" fill="black" />
                <rect x="112" y="0" width="16" height="16" fill="black" />

                <rect x="0" y="16" width="16" height="16" fill="black" />
                <rect x="80" y="16" width="16" height="16" fill="black" />
                <rect x="112" y="16" width="16" height="16" fill="black" />

                <rect x="0" y="32" width="16" height="16" fill="black" />
                <rect x="48" y="32" width="16" height="16" fill="black" />
                <rect x="80" y="32" width="16" height="16" fill="black" />
                <rect x="112" y="32" width="16" height="16" fill="black" />

                <rect x="0" y="48" width="16" height="16" fill="black" />
                <rect x="32" y="48" width="16" height="16" fill="black" />
                <rect x="64" y="48" width="16" height="16" fill="black" />
                <rect x="96" y="48" width="16" height="16" fill="black" />

                <rect x="16" y="64" width="16" height="16" fill="black" />
                <rect x="48" y="64" width="16" height="16" fill="black" />
                <rect x="80" y="64" width="16" height="16" fill="black" />

                <rect x="0" y="80" width="16" height="16" fill="black" />
                <rect x="64" y="80" width="16" height="16" fill="black" />
                <rect x="96" y="80" width="16" height="16" fill="black" />

                <rect x="32" y="96" width="16" height="16" fill="black" />
                <rect x="80" y="96" width="16" height="16" fill="black" />
                <rect x="112" y="96" width="16" height="16" fill="black" />

                <rect x="0" y="112" width="16" height="16" fill="black" />
                <rect x="48" y="112" width="16" height="16" fill="black" />
                <rect x="96" y="112" width="16" height="16" fill="black" />
              </svg>
            </div>
            <div>
              <Button variant="outline" className="gap-2">
                <BarChartIcon className="w-4 h-4" />
                Create QR Code
              </Button>
            </div>
          </div>
        </Card>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Referrers */}
          <Card className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Referrers</h2>
              <Button variant="outline" size="sm" className="gap-1">
                <Lock className="w-3 h-3" />
                Upgrade
              </Button>
            </div>
            <div className="flex items-center gap-8">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={referrersData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {referrersData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {referrersData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">{item.name}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          {/* Devices */}
          <Card className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Devices</h2>
              <Button variant="outline" size="sm" className="gap-1">
                <Lock className="w-3 h-3" />
                Upgrade
              </Button>
            </div>
            <div className="flex items-center gap-8">
              <div className="w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={devicesData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                    >
                      {devicesData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="space-y-3">
                {devicesData.map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <div className="flex-1">
                      <div className="text-sm text-gray-600">{item.name}</div>
                    </div>
                    <div className="text-sm font-medium text-gray-900">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>

        {/* Engagements over time */}
        <Card className="p-6 mb-6 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Engagements over time</h2>
            <Button variant="outline" size="sm" className="gap-1">
              <Lock className="w-3 h-3" />
              Upgrade
            </Button>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={engagementsData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis
                dataKey="date"
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <YAxis
                stroke="#9ca3af"
                tick={{ fontSize: 12 }}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'white',
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="engagements" fill="#06b6d4" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Locations */}
        <Card className="p-6 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Locations</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-1">
                <Lock className="w-3 h-3" />
                Upgrade
              </Button>
              <div className="flex gap-1 ml-2">
                <Button variant="ghost" size="sm" className="text-sm">Countries</Button>
                <Button variant="ghost" size="sm" className="text-sm text-gray-400">Cities</Button>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {locationsData.map((location, index) => (
              <div key={index} className="flex items-center gap-4">
                <div className="w-6 text-sm text-gray-500 text-right">{index + 1}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-900">{location.country}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-gray-600">{location.clicks}</span>
                      <span className="text-sm text-gray-500 w-8 text-right">{location.percentage}%</span>
                    </div>
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-blue-500 rounded-full transition-all"
                      style={{ width: `${location.percentage}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </main>
    </div>
  );
}
