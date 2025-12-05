// Complete Admin Panel
import { PageTemplate } from '../components/PageTemplate';
import { RouteId } from '../lib/routes';
import { BarChart, Package, FileText, Shield, Flag, FileCheck, Users, Activity, Settings, Zap } from 'lucide-react';
import { motion } from 'motion/react';
import { mockProducts, mockOrders, mockPosts, formatPrice, formatDate } from '../lib/mockData';
import { useState } from 'react';

type NavFunction = (route: RouteId, params?: Record<string, string>) => void;

// ADMIN DASHBOARD
export function AdminDashboard({ onNavigate }: { onNavigate: NavFunction }) {
  const adminPages = [
    { route: 'adminBeacons' as RouteId, title: 'Beacons', count: 'NEW', icon: Zap },
    { route: 'adminOrders' as RouteId, title: 'Orders', count: '12 new', icon: Package },
    { route: 'adminProducts' as RouteId, title: 'Products', count: `${mockProducts.length} active`, icon: Package },
    { route: 'adminVendors' as RouteId, title: 'Vendors', count: '3 pending', icon: Users },
    { route: 'adminContent' as RouteId, title: 'Content', count: '3 drafts', icon: FileText },
    { route: 'adminModeration' as RouteId, title: 'Moderation', count: '5 queued', icon: Shield },
    { route: 'adminReports' as RouteId, title: 'Reports', count: '2 open', icon: Flag },
    { route: 'adminDsar' as RouteId, title: 'DSAR', count: '1 pending', icon: FileCheck },
    { route: 'adminUsers' as RouteId, title: 'Users', count: '1,247 total', icon: Users },
    { route: 'adminAudit' as RouteId, title: 'Audit Log', count: 'Last 30 days', icon: Activity },
  ];

  return (
    <PageTemplate title="Admin Dashboard" subtitle="HOTMESS control panel" icon={Settings} onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-12">
          <div className="bg-white/5 border border-white/20 p-8">
            <div className="text-4xl text-hot mb-2" style={{ fontWeight: 900 }}>£12,450</div>
            <div className="text-white/60 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>Revenue (30d)</div>
          </div>
          <div className="bg-white/5 border border-white/20 p-8">
            <div className="text-4xl text-hot mb-2" style={{ fontWeight: 900 }}>1,247</div>
            <div className="text-white/60 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>Total Users</div>
          </div>
          <div className="bg-white/5 border border-white/20 p-8">
            <div className="text-4xl text-hot mb-2" style={{ fontWeight: 900 }}>847</div>
            <div className="text-white/60 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>Active (7d)</div>
          </div>
          <div className="bg-white/5 border border-white/20 p-8">
            <div className="text-4xl text-hot mb-2" style={{ fontWeight: 900 }}>2</div>
            <div className="text-white/60 uppercase tracking-wider text-sm" style={{ fontWeight: 700 }}>Open Reports</div>
          </div>
        </div>

        {/* Admin sections */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {adminPages.map((page, i) => {
            const Icon = page.icon;
            return (
              <motion.button
                key={page.route}
                onClick={() => onNavigate(page.route)}
                className="bg-white/5 border border-white/20 hover:border-hot p-8 text-left transition-all"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Icon size={32} className="text-hot mb-4" />
                <h3 className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900 }}>{page.title}</h3>
                <p className="text-white/60 text-sm">{page.count}</p>
              </motion.button>
            );
          })}
        </div>
      </div>
    </PageTemplate>
  );
}

// ADMIN ORDERS
export function AdminOrders({ onNavigate }: { onNavigate: NavFunction }) {
  return (
    <PageTemplate title="Orders" subtitle="Manage customer orders" icon={Package} backRoute="admin" backLabel="Admin Dashboard" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        <div className="bg-white/5 border border-white/20">
          <div className="p-6 border-b border-white/10">
            <div className="grid grid-cols-6 gap-4 text-white/60 uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
              <div className="col-span-2">Order ID</div>
              <div>Date</div>
              <div>Customer</div>
              <div>Total</div>
              <div>Status</div>
            </div>
          </div>
          {mockOrders.map(order => (
            <div key={order.id} className="p-6 border-b border-white/10 hover:bg-white/5 transition-colors">
              <div className="grid grid-cols-6 gap-4 items-center">
                <div className="col-span-2 text-white" style={{ fontWeight: 700 }}>{order.id}</div>
                <div className="text-white/60">{order.date}</div>
                <div className="text-white/60">Marcus_87</div>
                <div className="text-hot" style={{ fontWeight: 900 }}>{formatPrice(order.total)}</div>
                <div>
                  <span className="px-2 py-1 bg-hot/20 border border-hot/40 text-hot text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
                    {order.status}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
}

// ADMIN PRODUCTS
export function AdminProducts({ onNavigate }: { onNavigate: NavFunction }) {
  const [products, setProducts] = useState(mockProducts);

  const handleAddProduct = () => {
    alert('Add Product modal would open here (in production)');
  };

  const handleEdit = (productId: string) => {
    alert(`Edit product ${productId} (in production, opens edit modal)`);
  };

  const handleToggleActive = (productId: string) => {
    setProducts(prev => prev.map(p => 
      p.id === productId ? { ...p, active: !p.active } : p
    ));
  };

  return (
    <PageTemplate title="Products" subtitle="Manage shop inventory" icon={Package} backRoute="admin" backLabel="Admin Dashboard" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        <div className="mb-6">
          <button 
            onClick={handleAddProduct}
            className="bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all" 
            style={{ fontWeight: 900 }}
          >
            + Add Product
          </button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              className="bg-white/5 border border-white/20 overflow-hidden"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: i * 0.1 }}
            >
              <div className="aspect-square bg-white/5">
                <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-hot text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>{product.category}</span>
                    <h3 className="text-white uppercase tracking-wider mt-1" style={{ fontWeight: 700 }}>{product.title}</h3>
                  </div>
                  <span className="text-hot" style={{ fontWeight: 900, fontSize: '18px' }}>{formatPrice(product.pricePence)}</span>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(product.id)}
                    className="flex-1 bg-white/10 border border-white/20 hover:border-hot px-4 py-2 text-white text-sm uppercase tracking-wider transition-all" 
                    style={{ fontWeight: 700 }}
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleToggleActive(product.id)}
                    className="flex-1 bg-hot/10 border border-hot/30 hover:bg-hot/20 px-4 py-2 text-hot text-sm uppercase tracking-wider transition-all" 
                    style={{ fontWeight: 700 }}
                  >
                    {product.active ? 'Disable' : 'Enable'}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
}

// ADMIN CONTENT
export function AdminContent({ onNavigate }: { onNavigate: NavFunction }) {
  const handleManageShows = () => {
    alert('Radio Shows management panel would open here (in production, navigate to /admin/content/shows)');
  };

  const handleManagePages = () => {
    alert('Editorial Pages management would open here (in production, navigate to /admin/content/pages)');
  };

  return (
    <PageTemplate title="Content" subtitle="Manage pages, shows, and editorial" icon={FileText} backRoute="admin" backLabel="Admin Dashboard" onNavigate={onNavigate}>
      <div className="max-w-4xl">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/5 border border-white/20 p-8">
            <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>Radio Shows</h3>
            <button 
              onClick={handleManageShows}
              className="w-full bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all" 
              style={{ fontWeight: 900 }}
            >
              Manage Shows
            </button>
          </div>
          <div className="bg-white/5 border border-white/20 p-8">
            <h3 className="text-white uppercase tracking-wider mb-4" style={{ fontWeight: 900 }}>Editorial Pages</h3>
            <button 
              onClick={handleManagePages}
              className="w-full bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all" 
              style={{ fontWeight: 900 }}
            >
              Manage Pages
            </button>
          </div>
        </div>
      </div>
    </PageTemplate>
  );
}

// ADMIN MODERATION
export function AdminModeration({ onNavigate }: { onNavigate: NavFunction }) {
  const [posts, setPosts] = useState(mockPosts);
  const queuedPosts = posts.filter(p => p.status === 'QUEUED');
  
  const handleApprove = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, status: 'LIVE' as const } : p
    ));
    alert(`Post ${postId} approved and published`);
  };

  const handleRemove = (postId: string) => {
    setPosts(prev => prev.map(p => 
      p.id === postId ? { ...p, status: 'REMOVED' as const } : p
    ));
    alert(`Post ${postId} removed`);
  };
  
  return (
    <PageTemplate title="Moderation" subtitle="Review queued content" icon={Shield} backRoute="admin" backLabel="Admin Dashboard" onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-6">
        {queuedPosts.length === 0 ? (
          <div className="bg-white/5 border border-white/20 p-12 text-center">
            <p className="text-white/60">No posts in moderation queue</p>
          </div>
        ) : (
          queuedPosts.map(post => (
            <div key={post.id} className="bg-white/5 border border-white/20 p-8">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <h3 className="text-white uppercase tracking-wider mb-1" style={{ fontWeight: 900 }}>{post.title || 'Post'}</h3>
                  <p className="text-white/60 text-sm">By {post.authorName} • {formatDate(post.createdAt)}</p>
                </div>
                <span className="px-3 py-1 bg-hot/20 border border-hot/40 text-hot text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
                  Queued
                </span>
              </div>
              <div className="text-white/80 mb-6 whitespace-pre-wrap">{post.body}</div>
              <div className="flex gap-3">
                <button 
                  onClick={() => handleApprove(post.id)}
                  className="flex-1 bg-white border border-white text-black px-6 py-3 uppercase tracking-wider hover:bg-white/90 transition-all" 
                  style={{ fontWeight: 900 }}
                >
                  Approve
                </button>
                <button 
                  onClick={() => handleRemove(post.id)}
                  className="flex-1 bg-hot/10 border border-hot/30 hover:bg-hot/20 text-hot px-6 py-3 uppercase tracking-wider transition-all" 
                  style={{ fontWeight: 900 }}
                >
                  Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </PageTemplate>
  );
}

// ADMIN REPORTS
export function AdminReports({ onNavigate }: { onNavigate: NavFunction }) {
  const mockReports = [
    { id: 'REP-001', type: 'Harassment', postId: '2', reporter: 'User_456', createdAt: '2025-11-24T20:15:00Z', status: 'open' },
    { id: 'REP-002', type: 'Spam', postId: '5', reporter: 'User_789', createdAt: '2025-11-24T18:30:00Z', status: 'open' },
  ];

  const handleViewPost = (postId: string) => {
    onNavigate('communityPost', { id: postId });
  };

  const handleTakeAction = (reportId: string) => {
    alert(`Action panel for report ${reportId} would open here (warn user, remove content, ban user, etc.)`);
  };

  return (
    <PageTemplate title="Reports" subtitle="Review abuse reports" icon={Flag} backRoute="admin" backLabel="Admin Dashboard" onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-6">
        {mockReports.map(report => (
          <div key={report.id} className="bg-white/5 border border-white/20 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white uppercase tracking-wider mb-1" style={{ fontWeight: 900 }}>{report.id}</h3>
                <p className="text-white/60 text-sm">
                  {report.type} • Reported by {report.reporter} • {formatDate(report.createdAt)}
                </p>
              </div>
              <span className="px-3 py-1 bg-hot/20 border border-hot/40 text-hot text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
                {report.status}
              </span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleViewPost(report.postId)}
                className="flex-1 bg-white/10 border border-white/20 hover:border-hot px-6 py-3 text-white uppercase tracking-wider transition-all" 
                style={{ fontWeight: 700 }}
              >
                View Post
              </button>
              <button 
                onClick={() => handleTakeAction(report.id)}
                className="flex-1 bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all" 
                style={{ fontWeight: 900 }}
              >
                Take Action
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageTemplate>
  );
}

// ADMIN DSAR
export function AdminDSAR({ onNavigate }: { onNavigate: NavFunction }) {
  const mockDsarRequests = [
    { id: 'DSAR-001', email: 'user@example.com', type: 'export', createdAt: '2025-11-23T14:22:00Z', status: 'pending' },
  ];

  const handleProcess = (requestId: string) => {
    alert(`Processing DSAR request ${requestId}... (In production: generate export, send email, mark complete)`);
  };

  const handleDownload = (requestId: string) => {
    alert(`Downloading data for ${requestId}... (In production: download JSON export)`);
  };

  return (
    <PageTemplate title="DSAR Requests" subtitle="Data Subject Access Requests" icon={FileCheck} backRoute="admin" backLabel="Admin Dashboard" onNavigate={onNavigate}>
      <div className="max-w-4xl space-y-6">
        {mockDsarRequests.map(request => (
          <div key={request.id} className="bg-white/5 border border-white/20 p-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h3 className="text-white uppercase tracking-wider mb-1" style={{ fontWeight: 900 }}>{request.id}</h3>
                <p className="text-white/60 text-sm">
                  {request.type.toUpperCase()} • {request.email} • {formatDate(request.createdAt)}
                </p>
              </div>
              <span className="px-3 py-1 bg-hot/20 border border-hot/40 text-hot text-xs uppercase tracking-wider" style={{ fontWeight: 700 }}>
                {request.status}
              </span>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => handleProcess(request.id)}
                className="flex-1 bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all" 
                style={{ fontWeight: 900 }}
              >
                Process Request
              </button>
              <button 
                onClick={() => handleDownload(request.id)}
                className="flex-1 bg-white/10 border border-white/20 hover:border-hot px-6 py-3 text-white uppercase tracking-wider transition-all" 
                style={{ fontWeight: 700 }}
              >
                Download Data
              </button>
            </div>
          </div>
        ))}
      </div>
    </PageTemplate>
  );
}

// ADMIN USERS
export function AdminUsers({ onNavigate }: { onNavigate: NavFunction }) {
  const mockUsers = [
    { id: '1', displayName: 'Marcus_87', email: 'marcus@example.com', role: 'USER', createdAt: '2025-09-12T14:22:00Z' },
    { id: '2', displayName: 'JakeLDN', email: 'jake@example.com', role: 'USER', createdAt: '2025-10-01T09:15:00Z' },
    { id: '3', displayName: 'Admin', email: 'admin@hotmesslondon.com', role: 'ADMIN', createdAt: '2025-01-01T00:00:00Z' },
  ];

  return (
    <PageTemplate title="Users" subtitle="Manage user accounts" icon={Users} backRoute="admin" backLabel="Admin Dashboard" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        <div className="bg-white/5 border border-white/20">
          <div className="p-6 border-b border-white/10">
            <div className="grid grid-cols-5 gap-4 text-white/60 uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
              <div>Display Name</div>
              <div className="col-span-2">Email</div>
              <div>Role</div>
              <div>Joined</div>
            </div>
          </div>
          {mockUsers.map(user => (
            <div key={user.id} className="p-6 border-b border-white/10 hover:bg-white/5 transition-colors">
              <div className="grid grid-cols-5 gap-4 items-center">
                <div className="text-white" style={{ fontWeight: 700 }}>{user.displayName}</div>
                <div className="col-span-2 text-white/60">{user.email}</div>
                <div>
                  <span className={`px-2 py-1 text-xs uppercase tracking-wider ${
                    user.role === 'ADMIN' 
                      ? 'bg-hot/20 border border-hot/40 text-hot' 
                      : 'bg-white/10 border border-white/20 text-white/60'
                  }`} style={{ fontWeight: 700 }}>
                    {user.role}
                  </span>
                </div>
                <div className="text-white/60 text-sm">{new Date(user.createdAt).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
}

// ADMIN AUDIT
export function AdminAudit({ onNavigate }: { onNavigate: NavFunction }) {
  const mockAuditEvents = [
    { id: '1', action: 'ORDER_PAID', userId: 'Marcus_87', meta: 'Order ORD-2025-0847', createdAt: '2025-11-20T15:34:00Z' },
    { id: '2', action: 'POST_REMOVED', userId: 'Admin', meta: 'Post #42 (spam)', createdAt: '2025-11-19T11:22:00Z' },
    { id: '3', action: 'USER_BANNED', userId: 'Admin', meta: 'User #999 (harassment)', createdAt: '2025-11-18T09:15:00Z' },
  ];

  return (
    <PageTemplate title="Audit Log" subtitle="Last 30 days" icon={Activity} backRoute="admin" backLabel="Admin Dashboard" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        <div className="bg-white/5 border border-white/20">
          <div className="p-6 border-b border-white/10">
            <div className="grid grid-cols-4 gap-4 text-white/60 uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>
              <div>Action</div>
              <div>User</div>
              <div>Details</div>
              <div>Timestamp</div>
            </div>
          </div>
          {mockAuditEvents.map(event => (
            <div key={event.id} className="p-6 border-b border-white/10 hover:bg-white/5 transition-colors">
              <div className="grid grid-cols-4 gap-4 items-center">
                <div className="text-hot uppercase tracking-wider text-xs" style={{ fontWeight: 700 }}>{event.action}</div>
                <div className="text-white/60">{event.userId}</div>
                <div className="text-white/60">{event.meta}</div>
                <div className="text-white/60 text-sm">{formatDate(event.createdAt)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </PageTemplate>
  );
}