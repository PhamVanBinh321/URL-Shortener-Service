import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft,
  Edit2,
  Share2,
  MoreVertical,
  Copy,
  Calendar,
  Globe,
  Monitor
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
import { api, URL, AnalyticsStats } from "../../services/api";

const COLORS = ["#f97316", "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899"];

export function LinkDetail() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [link, setLink] = useState<URL | null>(null);
  const [stats, setStats] = useState<AnalyticsStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchData(parseInt(id));
    }
  }, [id]);

  const fetchData = async (linkId: number) => {
    try {
      setIsLoading(true);
      setError(null);

      // Fetch link details
      const linkResponse = await api.urls.getById(linkId);
      if (linkResponse.success) {
        setLink(linkResponse.data);
      }

      // Fetch link stats
      const statsResponse = await api.analytics.getURLStats(linkId, 30);
      if (statsResponse.success) {
        setStats(statsResponse.data);
      }
    } catch (err: any) {
      console.error("Failed to fetch link details:", err);
      setError(err.response?.data?.message || "Failed to load link details");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!link || !window.confirm("Are you sure you want to delete this link? This action cannot be undone.")) return;

    try {
      await api.urls.delete(link.id);
      navigate("/links");
    } catch (err) {
      alert("Failed to delete link");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert("Copied to clipboard!");
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !link) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 gap-4">
        <div className="text-red-500 text-lg">{error || "Link not found"}</div>
        <Button onClick={() => navigate("/links")}>Back to Links</Button>
      </div>
    );
  }

  // Format data for charts
  const referrersData = stats?.top_referers?.map(r => ({
    name: r.referer || 'Direct',
    value: r.clicks
  })) || [];

  const devicesData = stats?.clicks_by_device?.map(d => ({
    name: d.device_type,
    value: d.clicks
  })) || [];

  const engagementsData = stats?.clicks_by_date?.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    engagements: d.clicks
  })) || [];

  const locationsData = stats?.clicks_by_country?.map(c => ({
    country: c.country,
    clicks: c.clicks,
    percentage: stats.total_clicks > 0 ? Math.round((c.clicks / stats.total_clicks) * 100) : 0
  })) || [];

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
            {/* Icon */}
            <div className="w-12 h-12 bg-blue-100 rounded flex items-center justify-center flex-shrink-0">
              <Globe className="w-6 h-6 text-blue-600" />
            </div>

            {/* Link Details */}
            <div className="flex-1">
              <div className="flex items-start justify-between mb-4">
                <h1 className="text-2xl font-bold text-gray-900">{link.title || link.original_url}</h1>
                <div className="flex items-center gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded">
                    <Edit2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded" onClick={() => copyToClipboard(link.short_url)}>
                    <Share2 className="w-5 h-5 text-gray-600" />
                  </button>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-2 hover:bg-gray-100 rounded">
                        <MoreVertical className="w-5 h-5 text-gray-600" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={handleDelete} className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-3">
                <a href={link.short_url} target="_blank" rel="noreferrer" className="text-blue-600 font-medium hover:underline">
                  {link.short_url}
                </a>
                <button
                  onClick={() => copyToClipboard(link.short_url)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center gap-2 text-gray-600 mb-4 truncate max-w-2xl">
                <span>↳</span>
                <span className="text-sm truncate">{link.original_url}</span>
              </div>

              <div className="flex items-center gap-6 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(link.created_at).toLocaleDateString()}</span>
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
              {link.qr_code ? (
                <img src={link.qr_code} alt="QR Code" className="w-full h-full" />
              ) : (
                <div className="text-gray-400 text-sm text-center">QR Code not available</div>
              )}
            </div>
          </div>
        </Card>

        {/* Analytics Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Referrers */}
          <Card className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Referrers</h2>
            </div>
            {referrersData.length > 0 ? (
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
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {referrersData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600 truncate max-w-[100px]" title={item.name}>{item.name}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">No referrer data yet</div>
            )}
          </Card>

          {/* Devices */}
          <Card className="p-6 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-900">Devices</h2>
            </div>
            {devicesData.length > 0 ? (
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
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-3">
                  {devicesData.map((item, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }}></div>
                      <div className="flex-1">
                        <div className="text-sm text-gray-600">{item.name}</div>
                      </div>
                      <div className="text-sm font-medium text-gray-900">{item.value}</div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-10 text-gray-500">No device data yet</div>
            )}
          </Card>
        </div>

        {/* Engagements over time */}
        <Card className="p-6 mb-6 bg-white rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-bold text-gray-900">Engagements over time (30 Days)</h2>
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
                allowDecimals={false}
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
          </div>
          <div className="space-y-4">
            {locationsData.length > 0 ? locationsData.map((location, index) => (
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
            )) : (
              <div className="text-center py-4 text-gray-500">No location data yet</div>
            )}
          </div>
        </Card>
      </main>
    </div>
  );
}
