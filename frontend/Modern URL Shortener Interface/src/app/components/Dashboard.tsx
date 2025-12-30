import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  BarChart3,
  Settings,
  LogOut,
  Copy,
  ExternalLink,
  MoreVertical,
  TrendingUp,
  Home,
  Menu
} from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Card } from "./ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback } from "./ui/avatar";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { MobileNav } from "./MobileNav";
import { useAuth } from "../../contexts/AuthContext";
import { api, URL as URLType } from "../../services/api";

export function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [url, setUrl] = useState("");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [links, setLinks] = useState<URLType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalLinks: 0,
    totalClicks: 0,
    avgClickRate: 0,
  });
  const [chartData, setChartData] = useState<{ name: string; clicks: number }[]>([]);

  // Fetch user's links and stats
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setIsLoading(true);

      // Fetch links
      const linksResponse = await api.urls.getAll(1, 10);
      if (linksResponse.success && linksResponse.data) {
        setLinks(linksResponse.data);
      }

      // Fetch overview stats
      const statsResponse = await api.analytics.getOverviewStats(7);
      if (statsResponse.success && statsResponse.data) {
        const { total_clicks, clicks_by_date } = statsResponse.data;

        // Calculate total links if we have pagination info, otherwise use current page length
        const totalLinks = linksResponse.pagination?.total || linksResponse.data?.length || 0;
        const avgClickRate = totalLinks > 0 ? total_clicks / totalLinks : 0;

        setStats({
          totalLinks,
          totalClicks: total_clicks,
          avgClickRate: Math.round(avgClickRate * 10) / 10,
        });

        // Format chart data (last 7 days)
        // Ensure we explicitly sort and format for the chart
        const formattedChartData = formatChartData(clicks_by_date);
        setChartData(formattedChartData);
      }
    } catch (err: any) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data");
    } finally {
      setIsLoading(false);
    }
  };

  const formatChartData = (clicksByDate: any[]) => {
    // Create map of last 7 days
    const days = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const clicksMap = new Map(clicksByDate?.map((item: any) => [item.date.split('T')[0], item.clicks]) || []);

    return days.map(date => {
      const d = new Date(date);
      const name = d.toLocaleDateString('en-US', { weekday: 'short' });
      return {
        name,
        clicks: clicksMap.get(date) || 0
      };
    });
  };

  // Remove calculateStats as it's replaced by API data


  const handleShorten = async () => {
    if (!url) {
      setError("Please enter a URL");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      const response = await api.urls.create({
        original_url: url,
        title: `Link ${new Date().toLocaleDateString()}`,
      });

      if (response.success) {
        setUrl("");
        setUrl("");
        await fetchData();
        alert(`✅ URL shortened: ${response.data.short_url}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to shorten URL");
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = (shortUrl: string) => {
    navigator.clipboard.writeText(shortUrl);
    alert("✅ Copied to clipboard!");
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    return date.toLocaleDateString();
  };

  // Mock chart data (you can enhance this later with real analytics)


  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        currentPage="dashboard"
        onNavigateToHome={() => { }}
        onNavigateToLinks={() => navigate('/links')}
        onNavigateToAnalytics={() => navigate('/analytics')}
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
            <button className="w-full flex items-center gap-3 px-4 py-3 text-blue-600 bg-blue-50 rounded-lg">
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
            <button
              onClick={() => navigate('/analytics')}
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
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>

            <div className="flex items-center gap-3">
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
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Create New Link Card */}
          <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-white rounded-xl shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Create New Short Link</h2>
            <div className="flex flex-col sm:flex-row gap-3">
              <Input
                type="url"
                placeholder="Paste your long URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleShorten()}
                className="flex-1 rounded-full border-gray-300"
              />
              <Button
                onClick={handleShorten}
                disabled={!url || isCreating}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 w-full sm:w-auto disabled:opacity-50"
              >
                {isCreating ? "Creating..." : "Shorten"}
              </Button>
            </div>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <Card className="p-4 sm:p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-600">Total Links</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalLinks}</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-600">Total Clicks</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalClicks.toLocaleString()}</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 bg-white rounded-xl shadow-sm sm:col-span-2 lg:col-span-1">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-600">Avg. Click Rate</p>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.avgClickRate}</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Click Analytics Chart */}
          <Card className="p-4 sm:p-6 mb-6 sm:mb-8 bg-white rounded-xl shadow-sm">
            <h2 className="text-base sm:text-lg font-bold text-gray-900 mb-4">Click Analytics (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={200} className="sm:h-[250px]">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" tick={{ fontSize: 11 }} />
                <YAxis stroke="#6b7280" tick={{ fontSize: 11 }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'white',
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="clicks"
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ fill: '#2563eb', r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* Links Table */}
          <Card className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 sm:p-6 border-b border-gray-200">
              <h2 className="text-base sm:text-lg font-bold text-gray-900">Recent Links</h2>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="p-8 text-center text-gray-500">
                  <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
                  Loading links...
                </div>
              ) : links.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  No links yet. Create your first short link above!
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="min-w-[150px]">Short URL</TableHead>
                      <TableHead className="min-w-[250px]">Original URL</TableHead>
                      <TableHead className="min-w-[100px]">Clicks</TableHead>
                      <TableHead className="min-w-[120px]">Created</TableHead>
                      <TableHead className="w-[50px]"></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {links.map((link) => (
                      <TableRow key={link.id}>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <span className="text-blue-600 font-medium">{link.short_url}</span>
                            <button
                              onClick={() => handleCopy(link.short_url)}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2 max-w-md">
                            <span className="text-gray-600 truncate">{link.original_url}</span>
                            <a href={link.original_url} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                              <ExternalLink className="w-4 h-4" />
                            </a>
                          </div>
                        </TableCell>
                        <TableCell>
                          <span className="font-medium text-gray-900">{link.clicks.toLocaleString()}</span>
                        </TableCell>
                        <TableCell>
                          <span className="text-gray-600">{formatDate(link.created_at)}</span>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreVertical className="w-4 h-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => navigate(`/links/${link.id}`)}>
                                View Analytics
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </div>
          </Card>
        </main>
      </div>
    </div>
  );
}