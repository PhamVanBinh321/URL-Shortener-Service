import { useState } from "react";
import { 
  Link2, 
  BarChart3, 
  Settings, 
  LogOut,
  Copy,
  ExternalLink,
  MoreVertical,
  TrendingUp,
  Home
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

interface DashboardProps {
  onNavigateToLanding: () => void;
  onNavigateToLinks: () => void;
  onNavigateToAnalytics: () => void;
}

// Mock data for the table
const mockLinks = [
  {
    id: 1,
    shortUrl: "short.ly/abc123",
    originalUrl: "https://example.com/very-long-url-that-needs-shortening",
    clicks: 1234,
    created: "2 days ago",
  },
  {
    id: 2,
    shortUrl: "short.ly/xyz789",
    originalUrl: "https://mywebsite.com/blog/article-about-marketing",
    clicks: 856,
    created: "5 days ago",
  },
  {
    id: 3,
    shortUrl: "short.ly/def456",
    originalUrl: "https://store.com/products/amazing-product",
    clicks: 2341,
    created: "1 week ago",
  },
  {
    id: 4,
    shortUrl: "short.ly/ghi012",
    originalUrl: "https://docs.company.com/documentation/getting-started",
    clicks: 567,
    created: "2 weeks ago",
  },
];

// Mock data for the chart
const chartData = [
  { name: "Mon", clicks: 120 },
  { name: "Tue", clicks: 180 },
  { name: "Wed", clicks: 150 },
  { name: "Thu", clicks: 240 },
  { name: "Fri", clicks: 300 },
  { name: "Sat", clicks: 200 },
  { name: "Sun", clicks: 160 },
];

export function Dashboard({ onNavigateToLanding, onNavigateToLinks, onNavigateToAnalytics }: DashboardProps) {
  const [url, setUrl] = useState("");

  const handleShorten = () => {
    if (url) {
      // Mock shortening functionality
      alert(`URL shortened: short.ly/${Math.random().toString(36).substr(2, 6)}`);
      setUrl("");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
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
              onClick={onNavigateToLinks}
              className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-lg"
            >
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
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-gray-200">
          <div className="px-8 py-4 flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">My Links</h1>
              <p className="text-sm text-gray-600">Manage and track your shortened URLs</p>
            </div>
            
            <div className="flex items-center gap-4">
              <Avatar className="w-10 h-10">
                <AvatarFallback className="bg-blue-600 text-white">JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">
          {/* Create New Link Card */}
          <Card className="p-6 mb-8 bg-white rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Create New Short Link</h2>
            <div className="flex gap-3">
              <Input 
                type="url"
                placeholder="Paste your long URL here"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="flex-1 rounded-full border-gray-300"
              />
              <Button 
                onClick={handleShorten}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8"
              >
                Shorten
              </Button>
            </div>
          </Card>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-600">Total Links</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">127</p>
                </div>
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Link2 className="w-5 h-5 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>12% from last month</span>
              </div>
            </Card>

            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-600">Total Clicks</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">4,998</p>
                </div>
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>28% from last month</span>
              </div>
            </Card>

            <Card className="p-6 bg-white rounded-xl shadow-sm">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <p className="text-sm text-gray-600">Avg. Click Rate</p>
                  <p className="text-3xl font-bold text-gray-900 mt-1">39.4</p>
                </div>
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-1 text-sm text-green-600">
                <TrendingUp className="w-4 h-4" />
                <span>8% from last month</span>
              </div>
            </Card>
          </div>

          {/* Click Analytics Chart */}
          <Card className="p-6 mb-8 bg-white rounded-xl shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Click Analytics (Last 7 Days)</h2>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis dataKey="name" stroke="#6b7280" />
                <YAxis stroke="#6b7280" />
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
            <div className="p-6 border-b border-gray-200">
              <h2 className="text-lg font-bold text-gray-900">Recent Links</h2>
            </div>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Short URL</TableHead>
                  <TableHead>Original URL</TableHead>
                  <TableHead>Clicks</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockLinks.map((link) => (
                  <TableRow key={link.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="text-blue-600 font-medium">{link.shortUrl}</span>
                        <button className="text-gray-400 hover:text-gray-600">
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2 max-w-md">
                        <span className="text-gray-600 truncate">{link.originalUrl}</span>
                        <a href={link.originalUrl} target="_blank" rel="noopener noreferrer" className="text-gray-400 hover:text-gray-600 flex-shrink-0">
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-medium text-gray-900">{link.clicks.toLocaleString()}</span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">{link.created}</span>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>Edit</DropdownMenuItem>
                          <DropdownMenuItem>View Analytics</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </main>
      </div>
    </div>
  );
}