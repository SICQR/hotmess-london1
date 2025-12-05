/**
 * Admin Products - Product management for Shopify shop
 */

import { useState, useEffect } from 'react';
import { AdminLayout } from '../../components/layouts/AdminLayout';
import { RouteId } from '../../lib/routes';
import { 
  Package, 
  Plus,
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { LoadingState } from '../../components/LoadingState';

interface AdminProductsProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

interface Product {
  id: string;
  name: string;
  collection: 'RAW' | 'HUNG' | 'HIGH' | 'SUPER';
  price: number;
  stock: number;
  status: 'active' | 'draft' | 'archived';
  sales: number;
  image: string;
  createdAt: string;
}

export function AdminProducts({ onNavigate }: AdminProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCollection, setFilterCollection] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    setLoading(true);
    // TODO: Replace with real Shopify API call
    setTimeout(() => {
      setProducts([
        {
          id: '1',
          name: 'CONVICT TEE',
          collection: 'RAW',
          price: 35,
          stock: 12,
          status: 'active',
          sales: 45,
          image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          createdAt: '2024-11-01'
        },
        {
          id: '2',
          name: 'LEATHER HARNESS',
          collection: 'HUNG',
          price: 89,
          stock: 3,
          status: 'active',
          sales: 12,
          image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400',
          createdAt: '2024-10-15'
        },
        {
          id: '3',
          name: 'MESH SHORTS',
          collection: 'HIGH',
          price: 45,
          stock: 0,
          status: 'active',
          sales: 67,
          image: 'https://images.unsplash.com/photo-1591195853828-11db59a44f6b?w=400',
          createdAt: '2024-09-20'
        },
        {
          id: '4',
          name: 'PREMIUM JOCKSTRAP',
          collection: 'SUPER',
          price: 55,
          stock: 24,
          status: 'active',
          sales: 89,
          image: 'https://images.unsplash.com/photo-1578932750294-f5075e85f44a?w=400',
          createdAt: '2024-08-10'
        }
      ]);
      setLoading(false);
    }, 500);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollection = filterCollection === 'all' || product.collection === filterCollection;
    const matchesStatus = filterStatus === 'all' || product.status === filterStatus;
    return matchesSearch && matchesCollection && matchesStatus;
  });

  const getCollectionColor = (collection: string) => {
    switch (collection) {
      case 'RAW': return 'bg-red-500/20 text-red-400 border-red-500/30';
      case 'HUNG': return 'bg-purple-500/20 text-purple-400 border-purple-500/30';
      case 'HIGH': return 'bg-green-500/20 text-green-400 border-green-500/30';
      case 'SUPER': return 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30';
      default: return 'bg-white/10 text-white/60 border-white/20';
    }
  };

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * p.sales), 0);
  const totalSales = products.reduce((sum, p) => sum + p.sales, 0);
  const lowStockCount = products.filter(p => p.stock < 5).length;

  if (loading) {
    return (
      <AdminLayout currentRoute="adminProducts" onNavigate={onNavigate}>
        <LoadingState />
      </AdminLayout>
    );
  }

  return (
    <AdminLayout currentRoute="adminProducts" onNavigate={onNavigate}>
      <div className="max-w-7xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
              SHOP PRODUCTS
            </h1>
            <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
              Manage Shopify products across all collections
            </p>
          </div>
          <button
            onClick={() => {
              alert('Create product flow - integrate with Shopify API');
            }}
            className="bg-hot hover:bg-white text-white hover:text-black px-6 py-3 uppercase tracking-wider transition-all flex items-center gap-2"
            style={{ fontWeight: 900, fontSize: '14px' }}
          >
            <Plus size={20} />
            Create Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><Package size={20} /></span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '28px' }}>
                {products.length}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Total Products
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><DollarSign size={20} /></span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '28px' }}>
                £{totalRevenue.toLocaleString()}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Total Revenue
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><TrendingUp size={20} /></span>
              <span className="text-hot" style={{ fontWeight: 900, fontSize: '28px' }}>
                {totalSales}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Total Sales
            </div>
          </div>
          <div className="bg-white/5 border border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-white/40"><AlertCircle size={20} /></span>
              <span className="text-yellow-500" style={{ fontWeight: 900, fontSize: '28px' }}>
                {lowStockCount}
              </span>
            </div>
            <div className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>
              Low Stock
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white/5 border border-white/10 p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div>
              <label className="text-white/60 uppercase tracking-wider mb-2 block" style={{ fontWeight: 700, fontSize: '11px' }}>
                Search Products
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Product name..."
                  className="w-full bg-black border border-white/20 text-white pl-10 pr-4 py-3 focus:border-hot outline-none"
                  style={{ fontWeight: 400, fontSize: '14px' }}
                />
              </div>
            </div>

            {/* Collection Filter */}
            <div>
              <label className="text-white/60 uppercase tracking-wider mb-2 block" style={{ fontWeight: 700, fontSize: '11px' }}>
                Filter by Collection
              </label>
              <select
                value={filterCollection}
                onChange={(e) => setFilterCollection(e.target.value)}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none"
                style={{ fontWeight: 400, fontSize: '14px' }}
              >
                <option value="all">All Collections</option>
                <option value="RAW">RAW</option>
                <option value="HUNG">HUNG</option>
                <option value="HIGH">HIGH</option>
                <option value="SUPER">SUPER</option>
              </select>
            </div>

            {/* Status Filter */}
            <div>
              <label className="text-white/60 uppercase tracking-wider mb-2 block" style={{ fontWeight: 700, fontSize: '11px' }}>
                Filter by Status
              </label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full bg-black border border-white/20 text-white px-4 py-3 focus:border-hot outline-none"
                style={{ fontWeight: 400, fontSize: '14px' }}
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="draft">Draft</option>
                <option value="archived">Archived</option>
              </select>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white/5 border border-white/10 hover:border-hot/50 transition-all group">
              <div className="aspect-square bg-white/10 overflow-hidden">
                <img 
                  src={product.image} 
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="text-white uppercase tracking-wider mb-2" style={{ fontWeight: 900, fontSize: '16px' }}>
                      {product.name}
                    </h3>
                    <span className={`inline-block px-2 py-1 border uppercase tracking-wider ${getCollectionColor(product.collection)}`} style={{ fontWeight: 700, fontSize: '10px' }}>
                      {product.collection}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 mb-4">
                  <div>
                    <div className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '10px' }}>
                      Price
                    </div>
                    <div className="text-white" style={{ fontWeight: 700, fontSize: '16px' }}>
                      £{product.price}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '10px' }}>
                      Stock
                    </div>
                    <div className={`${product.stock < 5 ? 'text-yellow-500' : 'text-white'}`} style={{ fontWeight: 700, fontSize: '16px' }}>
                      {product.stock}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '10px' }}>
                      Sold
                    </div>
                    <div className="text-hot" style={{ fontWeight: 700, fontSize: '16px' }}>
                      {product.sales}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button className="flex-1 bg-white/10 hover:bg-hot/20 border border-white/20 hover:border-hot text-white px-3 py-2 uppercase tracking-wider transition-all flex items-center justify-center gap-2" style={{ fontWeight: 700, fontSize: '12px' }}>
                    <Edit size={14} />
                    Edit
                  </button>
                  <button className="bg-white/10 hover:bg-red-500/20 border border-white/20 hover:border-red-500 text-white px-3 py-2 transition-all">
                    <Trash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="bg-white/5 border border-white/10 p-12 text-center">
            <Package className="mx-auto mb-4 text-white/20" size={48} />
            <p className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
              No products found
            </p>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
