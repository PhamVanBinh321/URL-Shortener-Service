import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Search,
  Calendar,
  SlidersHorizontal,
  Download,
  MoreHorizontal,
  TrendingUp,
  Menu
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { Input } from "./ui/input";
import { Avatar, AvatarFallback } from "./ui/avatar";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import { MobileNav } from "./MobileNav";



// Mock data
const engagementsOverTimeData = [
  { date: "23/12", value: 35 },
  { date: "24/12", value: 28 },
  { date: "25/12", value: 20 },
  { date: "26/12", value: 15 },
  { date: "27/12", value: 40 },
  { date: "28/12", value: 30 },
  { date: "29/12", value: 10 },
  { date: "30/12", value: 25 },
  { date: "31/12", value: 35 },
  { date: "1/1", value: 20 },
  { date: "2/1", value: 12 },
  { date: "3/1", value: 28 },
  { date: "4/1", value: 25 },
  { date: "5/1", value: 10 },
  { date: "6/1", value: 38 },
  { date: "7/1", value: 32 },
  { date: "8/1", value: 45 },
  { date: "9/1", value: 22 },
];

const deviceData = [
  { name: "Desktop", value: 146, color: "#06b6d4" },
  { name: "E-Reader", value: 101, color: "#7dd3fc" },
  { name: "Tablet", value: 70, color: "#3b82f6" },
  { name: "Mobile", value: 50, color: "#bfdbfe" },
  { name: "Unknown", value: 14, color: "#f97316" },
];

const referrerData = [
  { name: "LinkedIn", value: 42 },
  { name: "Facebook", value: 5 },
  { name: "Google", value: 20 },
  { name: "Twitter", value: 3 },
  { name: "Bitly", value: 15 },
  { name: "Direct", value: 8 },
  { name: "Other", value: 4 },
];

const locationData = [
  { rank: 1, country: "United States", engagements: 205, percentage: 47.8 },
  { rank: 2, country: "Japan", engagements: 6, percentage: 1.4 },
  { rank: 3, country: "Mexico", engagements: 19, percentage: 4.4 },
  { rank: 4, country: "Russian Federation", engagements: 5, percentage: 1.2 },
  { rank: 5, country: "India", engagements: 27, percentage: 6.3 },
  { rank: 6, country: "Canada", engagements: 80, percentage: 18.6 },
];

export function AnalyticsPage() {
  const navigate = useNavigate();
  const totalEngagements = deviceData.reduce((sum, item) => sum + item.value, 0);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        currentPage="analytics"
        onNavigateToHome={() => navigate('/dashboard')}
        onNavigateToLinks={() => navigate('/links')}
        onNavigateToAnalytics={() => { }}
        onNavigateToLanding={() => navigate('/')}
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
              onClick={() => navigate('/dashboard')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Home className="w-5 h-5" />
              <span>Home</span>
            </button>
            <button
              onClick={() => navigate('/links')}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
              <Link2 className="w-5 h-5" />
              <span>Links</span>
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
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
            onClick={() => navigate('/')}
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
          <div className="px-4 sm:px-8 py-4 flex justify-between items-center">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Analytics</h1>
            </div>

            <div className="flex items-center gap-3">
              <Button className="hidden sm:flex bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg px-6">
                ⚡ Upgrade
              </Button>
              <Avatar className="w-9 h-9">
                <AvatarFallback className="bg-blue-600 text-white text-sm">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Analytics</h1>

            {/* Date Range and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
                <span className="text-xs sm:text-sm">Dec 23, 2025</span>
                <span className="text-gray-400">→</span>
                <span className="text-xs sm:text-sm">Dec 29, 2025</span>
                <Calendar className="w-4 h-4 text-gray-400 ml-2" />
              </div>

              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <SlidersHorizontal className="w-4 h-4" />
                Add filters
              </Button>

              <span className="text-xs sm:text-sm text-gray-600 hidden lg:block">Showing data for all links and QR Codes</span>
            </div>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Top performing date */}
            <Card className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  Top performing date by <span className="underline">Total Engagements</span>
                </h2>
                <button className="text-gray-400 hover:text-gray-600 hidden sm:block">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center py-6 sm:py-8">
                <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-gray-900 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">December 28, 2025</h3>
                <p className="text-base sm:text-lg text-gray-600 mb-2">42 Engagements</p>
                <p className="text-xs sm:text-sm text-gray-500">Dec 23 - Dec 29, 2025</p>
              </div>
            </Card>

            {/* Total Engagements by device */}
            <Card className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  <span className="underline">Total Engagements</span> by device
                </h2>
                <div className="hidden sm:flex gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
                <div className="w-40 sm:w-48 h-40 sm:h-48 relative">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={deviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={0}
                        dataKey="value"
                      >
                        {deviceData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <div className="text-3xl font-bold text-gray-900">{totalEngagements}</div>
                    <div className="text-sm text-gray-600">Engagements</div>
                  </div>
                </div>

                <div className="space-y-3 flex-1">
                  {deviceData.map((item, index) => (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }}></div>
                        <span className="text-sm text-gray-700">{item.name}</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>

          {/* Total Engagements over time */}
          <Card className="p-4 sm:p-6 mb-4 sm:mb-6 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                <span className="underline">Total Engagements</span> over time
              </h2>
              <div className="hidden sm:flex gap-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Download className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]">
              <LineChart data={engagementsOverTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="date"
                  stroke="#9ca3af"
                  tick={{ fontSize: 11 }}
                />
                <YAxis
                  stroke="#9ca3af"
                  tick={{ fontSize: 11 }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="value"
                  stroke="#06b6d4"
                  strokeWidth={2}
                  dot={{ fill: '#06b6d4', r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
            {/* Top performing location */}
            <Card className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  Top performing location by <span className="underline">Total Engagements</span>
                </h2>
                <button className="text-gray-400 hover:text-gray-600 hidden sm:block">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>

              <div className="text-center py-6 sm:py-8">
                <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-gray-900 mx-auto mb-3 sm:mb-4" />
                <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">United States & United Kingdom...</h3>
                <p className="text-base sm:text-lg text-gray-600 mb-2">205 Engagements</p>
                <p className="text-xs sm:text-sm text-gray-500">Dec 23 - Dec 29, 2025</p>
              </div>
            </Card>

            {/* Total Engagements by referrer */}
            <Card className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
              <div className="flex items-center justify-between mb-4 sm:mb-6">
                <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                  <span className="underline">Total Engagements</span> by referrer
                </h2>
                <div className="hidden sm:flex gap-2">
                  <button className="text-gray-400 hover:text-gray-600">
                    <Download className="w-5 h-5" />
                  </button>
                  <button className="text-gray-400 hover:text-gray-600">
                    <MoreHorizontal className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={referrerData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis
                    dataKey="name"
                    stroke="#9ca3af"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                  />
                  <YAxis
                    stroke="#9ca3af"
                    tick={{ fontSize: 11 }}
                    axisLine={false}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="value" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </Card>
          </div>

          {/* Total Engagements by location */}
          <Card className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-4 sm:mb-6">
              <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                <span className="underline">Total Engagements</span> by location
              </h2>
              <div className="hidden sm:flex gap-2">
                <button className="text-gray-400 hover:text-gray-600">
                  <Download className="w-5 h-5" />
                </button>
                <button className="text-gray-400 hover:text-gray-600">
                  <MoreHorizontal className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Map */}
              <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                <svg viewBox="0 0 400 200" className="w-full h-auto opacity-30">
                  {/* Simple world map outline */}
                  <path d="M50,80 L70,70 L90,75 L100,70 L110,75 L120,70 L130,80 L140,75 L150,80" stroke="#06b6d4" strokeWidth="2" fill="none" />
                  <path d="M80,100 L90,95 L100,100 L110,95 L120,100" stroke="#06b6d4" strokeWidth="2" fill="#a5f3fc" opacity="0.5" />
                  <path d="M200,90 L220,85 L240,90 L260,85 L280,95" stroke="#06b6d4" strokeWidth="2" fill="#a5f3fc" opacity="0.5" />
                </svg>
              </div>

              {/* Table */}
              <div>
                <div className="flex gap-4 mb-4 border-b border-gray-200">
                  <button className="pb-2 border-b-2 border-gray-900 font-medium">Countries</button>
                  <button className="pb-2 text-gray-500">Cities</button>
                </div>

                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">#</TableHead>
                      <TableHead>Country</TableHead>
                      <TableHead className="text-right">Engagements</TableHead>
                      <TableHead className="text-right">%</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {locationData.map((location) => (
                      <TableRow key={location.rank}>
                        <TableCell className="text-gray-500">{location.rank}</TableCell>
                        <TableCell className="font-medium">{location.country}</TableCell>
                        <TableCell className="text-right">{location.engagements}</TableCell>
                        <TableCell className="text-right">{location.percentage}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}
