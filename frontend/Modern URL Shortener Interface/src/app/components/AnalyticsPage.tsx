import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Calendar,
  SlidersHorizontal,
  Download,
  MoreHorizontal,
  TrendingUp,
  Menu
} from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
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
import { api, AnalyticsStats } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export function AnalyticsPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Colors for charts
  const COLORS = ["#06b6d4", "#7dd3fc", "#3b82f6", "#bfdbfe", "#f97316", "#8b5cf6", "#ec4899"];

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      // Fetch stats for last 30 days
      const response = await api.analytics.getOverviewStats(30);
      if (response.success && response.data) {
        setStats(response.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch analytics:", err);
      setError("Failed to load analytics data");
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  // Format data for Recharts
  const lineChartData = stats?.clicks_by_date?.map(item => ({
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    value: item.clicks
  })).reverse() || [];

  const deviceData = stats?.clicks_by_device?.map((item, index) => ({
    name: item.device_type || 'Unknown',
    value: item.clicks,
    color: COLORS[index % COLORS.length]
  })) || [];

  const referrerData = stats?.top_referers?.map(item => ({
    name: item.referer.replace('https://', '').replace('http://', '').replace('www.', '').split('/')[0] || 'Direct',
    value: item.clicks
  })) || [];

  const locationData = stats?.clicks_by_country?.map((item, index) => ({
    rank: index + 1,
    country: item.country || 'Unknown',
    engagements: item.clicks,
    percentage: stats.total_clicks > 0 ? ((item.clicks / stats.total_clicks) * 100).toFixed(1) : 0
  })) || [];

  const totalEngagements = stats?.total_clicks || 0;

  // Find top dates
  const sortedDates = [...(stats?.clicks_by_date || [])].sort((a, b) => b.clicks - a.clicks);
  const topDate = sortedDates.length > 0 ? sortedDates[0] : null;

  // Find top location
  const topLocation = locationData.length > 0 ? locationData[0] : null;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-500">Loading analytics...</p>
        </div>
      </div>
    );
  }

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
          <div className="mb-3 px-4">
            <p className="text-sm font-medium text-gray-900">{user?.name}</p>
            <p className="text-xs text-gray-500 truncate">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
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
                <AvatarFallback className="bg-blue-600 text-white text-sm">
                  {user?.name?.charAt(0) || "U"}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-4 sm:p-8 overflow-auto">
          {/* Page Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6">Overview Analytics</h1>

            {/* Date Range and Filters */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4">
              <div className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
                <span className="text-xs sm:text-sm">Last 30 Days</span>
                <Calendar className="w-4 h-4 text-gray-400 ml-2" />
              </div>

              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <SlidersHorizontal className="w-4 h-4" />
                Add filters
              </Button>

              <span className="text-xs sm:text-sm text-gray-600 hidden lg:block">Showing aggregated data for all links</span>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {(!stats?.total_clicks || stats?.total_clicks === 0) ? (
            <div className="p-12 text-center bg-white rounded-lg border border-gray-200">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No analytics data yet</h3>
              <p className="text-gray-500 mb-6">Share your links to start tracking clicks and engagements!</p>
              <Button onClick={() => navigate('/links')} className="bg-blue-600 hover:bg-blue-700 text-white">
                Go to Links
              </Button>
            </div>
          ) : (
            <>
              {/* Analytics Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-4 sm:mb-6">
                {/* Top performing date */}
                <Card className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                      Top performing date by <span className="underline">Total Engagements</span>
                    </h2>
                  </div>

                  <div className="text-center py-6 sm:py-8">
                    <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-gray-900 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                      {topDate ? new Date(topDate.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'N/A'}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-2">{topDate ? topDate.clicks : 0} Engagements</p>
                  </div>
                </Card>

                {/* Total Engagements by device */}
                <Card className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                      <span className="underline">Total Engagements</span> by device
                    </h2>
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

                    <div className="space-y-3 flex-1 w-full">
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
                </div>

                <ResponsiveContainer width="100%" height={200} className="sm:h-[300px]">
                  <LineChart data={lineChartData}>
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
                  </div>

                  <div className="text-center py-6 sm:py-8">
                    <TrendingUp className="w-6 sm:w-8 h-6 sm:h-8 text-gray-900 mx-auto mb-3 sm:mb-4" />
                    <h3 className="text-lg sm:text-2xl font-bold text-gray-900 mb-2">
                      {topLocation ? topLocation.country : 'N/A'}
                    </h3>
                    <p className="text-base sm:text-lg text-gray-600 mb-2">{topLocation ? topLocation.engagements : 0} Engagements</p>
                  </div>
                </Card>

                {/* Total Engagements by referrer */}
                <Card className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-4 sm:mb-6">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                      <span className="underline">Total Engagements</span> by referrer
                    </h2>
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

              {/* Total Engagements by location TABLE */}
              <Card className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <h2 className="text-sm sm:text-base font-semibold text-gray-900">
                    <span className="underline">Total Engagements</span> by location
                  </h2>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Map Placeholder */}
                  <div className="bg-gray-50 rounded-lg p-8 flex items-center justify-center min-h-[300px]">
                    <div className="text-center text-gray-400">
                      <p>Map visualization coming soon</p>
                    </div>
                  </div>

                  {/* Table */}
                  <div>
                    <div className="flex gap-4 mb-4 border-b border-gray-200">
                      <button className="pb-2 border-b-2 border-gray-900 font-medium">Countries</button>
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
                            <TableCell className="text-right">{location.percentage}%</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </div>
              </Card>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
