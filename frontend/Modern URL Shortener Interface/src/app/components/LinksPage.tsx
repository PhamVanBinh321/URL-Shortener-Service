import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Link2,
  BarChart3,
  Settings,
  LogOut,
  Home,
  Search,
  Calendar,
  List,
  LayoutGrid,
  Rows3,
  Edit2,
  Share2,
  MoreHorizontal,
  Copy,
  ArrowRight,
  Menu,
  Trash2
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
import { CreateLinkModal } from "./CreateLinkModal";
import { EditLinkModal } from "./EditLinkModal";
import { api, URL as URLType } from "../../services/api";
import { useAuth } from "../../contexts/AuthContext";

export function LinksPage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [viewMode, setViewMode] = useState<"list" | "card" | "grid">("card");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState<any>(null);

  // Real data states
  const [links, setLinks] = useState<URLType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchLinks(searchQuery);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const refreshLinks = () => fetchLinks(searchQuery);

  const fetchLinks = async (query = "") => {
    try {
      setIsLoading(true);
      const response = await api.urls.getAll(1, 1000, query);
      if (response.success && response.data) {
        setLinks(response.data);
      }
    } catch (error) {
      console.error("Failed to fetch links:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateLink = async (url: string, customSlug: string, title: string) => {
    try {
      const response = await api.urls.create({
        original_url: url,
        custom_alias: customSlug || undefined,
        title: title || undefined
      });

      if (response.success) {
        setCreateModalOpen(false);
        refreshLinks(); // Reload list
        alert(`✅ Link created successfully!`);
      }
    } catch (error: any) {
      alert(`❌ Failed to create link: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };



  const handleEditLink = (link: URLType) => {
    setEditingLink({
      id: link.id,
      shortUrl: link.short_url,
      destinationUrl: link.original_url,
      title: link.title,
      tags: "No tags" // Backend doesn't support tags yet
    });
    setEditModalOpen(true);
  };

  const handleSaveEdit = async (title: string) => {
    if (!editingLink) return;

    try {
      const response = await api.urls.update(editingLink.id, {
        title: title
      });

      if (response.success) {
        setEditModalOpen(false);
        setEditingLink(null);
        refreshLinks(); // Reload list
        alert("✅ Link updated successfully!");
      }
    } catch (error: any) {
      alert(`❌ Failed to update link: ${error.response?.data?.message || 'Unknown error'}`);
    }
  };

  const handleDeleteLink = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this link? This action cannot be undone.")) {
      return;
    }

    try {
      const response = await api.urls.delete(id);
      if (response.success) {
        refreshLinks();
        alert("✅ Link deleted successfully!");
      }
    } catch (error: any) {
      alert(`❌ Failed to delete link: ${error.response?.data?.message || 'Unknown error'}`);
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
    return new Date(dateString).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric"
    });
  };



  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      <MobileNav
        isOpen={mobileNavOpen}
        onClose={() => setMobileNavOpen(false)}
        currentPage="links"
        onNavigateToHome={() => navigate('/dashboard')}
        onNavigateToLinks={() => { }}
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
            <button
              onClick={() => navigate('/dashboard')}
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
          <div className="px-4 sm:px-8 py-4 flex justify-between items-center gap-4">
            <div className="flex items-center gap-2 sm:gap-4 flex-1">
              <button
                onClick={() => setMobileNavOpen(true)}
                className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
              >
                <Menu className="w-6 h-6 text-gray-600" />
              </button>

              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Links</h1>

              <div className="hidden sm:flex items-center gap-2 flex-1 max-w-md ml-6">
                <Search className="w-5 h-5 text-gray-400 absolute ml-3" />
                <Input
                  type="text"
                  placeholder="Search links..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 border-gray-300 h-10"
                />
              </div>
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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Links</h1>
            <Button
              onClick={() => setCreateModalOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-lg w-full sm:w-auto"
            >
              Create link
            </Button>
          </div>

          {/* Mobile Search Bar */}
          <div className="sm:hidden mb-4 flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg">
            <Search className="w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
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
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 outline-none text-sm"
                />
              </div>
              <Button variant="outline" className="gap-2 w-full sm:w-auto">
                <Calendar className="w-4 h-4" />
                <span className="hidden sm:inline">Filter by created date</span>
                <span className="sm:hidden">Date</span>
              </Button>
            </div>
          </div>

          {/* Toolbar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <div className="hidden sm:flex items-center gap-4">
              <span className="text-sm text-gray-600">{links.length} results</span>
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
            </div>
          </div>

          {/* Links List */}
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-gray-500">Loading your links...</p>
            </div>
          ) : links.length === 0 ? (
            <div className="p-12 text-center bg-white rounded-lg border border-gray-200">
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Link2 className="w-8 h-8 text-blue-500" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">No links found</h3>
              <p className="text-gray-500 mb-6">Create your first shortened link to get started.</p>
              <Button onClick={() => setCreateModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                Create Link
              </Button>
            </div>
          ) : (
            <div className={viewMode === 'grid' ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
              {links.map((link) => (
                <Card
                  key={link.id}
                  className="p-4 sm:p-6 bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                  onClick={() => navigate(`/links/${link.id}`)}
                >
                  <div className="flex items-start gap-3 sm:gap-4">
                    {/* Icon */}
                    <div className={`w-10 h-10 bg-blue-100 rounded flex-shrink-0 flex items-center justify-center`}>
                      <Link2 className="w-5 h-5 text-blue-600" />
                    </div>

                    {/* Link Content */}
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium text-gray-900 mb-2 truncate">{link.title || link.original_url}</h3>

                      <div className="flex items-center gap-2 mb-3">
                        <span className="text-blue-600 font-medium">{link.short_url}</span>
                        <button
                          className="text-gray-400 hover:text-gray-600"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleCopy(link.short_url);
                          }}
                        >
                          <Copy className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                        <ArrowRight className="w-4 h-4" />
                        <span className="truncate">{link.original_url}</span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <BarChart3 className="w-4 h-4" />
                          <span>{link.clicks} clicks</span>
                        </div>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {formatDate(link.created_at)}
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="hidden sm:flex items-center gap-2 flex-shrink-0">
                      <button
                        className="p-2 hover:bg-gray-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditLink(link);
                        }}
                      >
                        <Edit2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(link.short_url);
                        }}
                      >
                        <Share2 className="w-4 h-4 text-gray-600" />
                      </button>
                      <button
                        className="p-2 hover:bg-gray-100 rounded"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/links/${link.id}`);
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
                          <DropdownMenuItem onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteLink(link.id);
                          }} className="text-red-600">
                            <Trash2 className="w-4 h-4 mr-2" /> Delete
                          </DropdownMenuItem>
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
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleEditLink(link);
                        }}>
                          <Edit2 className="w-4 h-4 mr-2" />Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(link.short_url);
                        }}>
                          <Share2 className="w-4 h-4 mr-2" />Copy
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={(e) => { e.stopPropagation(); navigate(`/links/${link.id}`); }}>
                          <BarChart3 className="w-4 h-4 mr-2" />Analytics
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-red-600" onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteLink(link.id);
                        }}>
                          <Trash2 className="w-4 h-4 mr-2" /> Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* End Message */}
          {!isLoading && links.length > 0 && (
            <div className="flex items-center justify-center gap-4 py-8">
              <div className="h-px bg-gray-300 w-20"></div>
              <span className="text-sm text-gray-500">You've reached the end of your links</span>
              <div className="h-px bg-gray-300 w-20"></div>
            </div>
          )}
        </main>
      </div>

      {/* Create Link Modal */}
      <CreateLinkModal
        isOpen={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onCreateLink={handleCreateLink}
      />

      {/* Edit Link Modal */}
      {editingLink && (
        <EditLinkModal
          isOpen={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditingLink(null);
          }}
          onSave={handleSaveEdit}
          linkData={editingLink}
        />
      )}
    </div>
  );
}