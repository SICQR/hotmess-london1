import { useState } from 'react';
import { SellerLayout } from '../../components/layouts/SellerLayout';
import { RouteId } from '../../lib/routes';
import { Upload, X } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '../../components/ui/button';
import { createListing, uploadImage } from '../../lib/api/messmarket';

interface SellerListingCreateProps {
  onNavigate: (route: RouteId, params?: Record<string, string>) => void;
}

export function SellerListingCreate({ onNavigate }: SellerListingCreateProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    tags: '',
    shippingCost: '',
    processingTime: '1-3'
  });
  const [images, setImages] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast.error('Maximum 5 images allowed');
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (status: 'draft' | 'active') => {
    // Validation
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }
    if (!formData.price || parseFloat(formData.price) <= 0) {
      toast.error('Valid price is required');
      return;
    }
    if (!formData.stock || parseInt(formData.stock) < 0) {
      toast.error('Valid stock quantity is required');
      return;
    }

    try {
      setSubmitting(true);
      if (import.meta.env.DEV) {
        console.log('Starting listing creation...', { status, imageCount: images.length });
      }
      
      // Upload images first
      const imageUrls: string[] = [];
      for (const file of images) {
        try {
          if (import.meta.env.DEV) {
            console.log(`Uploading image: ${file.name} (${file.size} bytes)`);
          }
          const { url } = await uploadImage(file);
          if (import.meta.env.DEV) {
            console.log(`Upload successful: ${url}`);
          }
          imageUrls.push(url);
        } catch (err) {
          console.error('Image upload failed:', err);
          const errorMsg = err instanceof Error ? err.message : 'Unknown error';
          toast.error(`Failed to upload ${file.name}: ${errorMsg}`);
          setSubmitting(false);
          return;
        }
      }
      
      if (import.meta.env.DEV) {
        console.log('All images uploaded, creating listing...', imageUrls);
      }
      
      // Create listing
      const listingData = {
        title: formData.title.trim(),
        description: formData.description.trim(),
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
        category: formData.category || null,
        tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
        images: imageUrls,
        shipping_cost: formData.shippingCost ? parseFloat(formData.shippingCost) : 0,
        processing_time: formData.processingTime,
        status
      };
      
      if (import.meta.env.DEV) {
        console.log('Creating listing with data:', listingData);
      }
      const { listing } = await createListing(listingData);
      if (import.meta.env.DEV) {
        console.log('Listing created successfully:', listing);
      }
      
      toast.success(status === 'draft' ? 'Draft saved' : 'Listing published');
      onNavigate('sellerListings');
    } catch (err) {
      console.error('Failed to create listing:', err);
      const errorMsg = err instanceof Error ? err.message : 'Failed to create listing';
      toast.error(errorMsg);
      setSubmitting(false);
    }
  };

  return (
    <SellerLayout currentRoute="sellerListingsNew" onNavigate={onNavigate}>
      <div className="max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="uppercase tracking-[-0.04em] text-white mb-2" style={{ fontWeight: 900, fontSize: '48px' }}>
            CREATE LISTING
          </h1>
          <p className="text-white/60 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '14px' }}>
            Add a new product to MessMarket
          </p>
        </div>

        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white/5 border border-white/10 p-6">
            <h2 className="uppercase tracking-wider text-white mb-4" style={{ fontWeight: 900, fontSize: '20px' }}>
              PRODUCT IMAGES
            </h2>
            <p className="text-white/60 mb-4" style={{ fontWeight: 400, fontSize: '13px' }}>
              Upload up to 5 images. First image will be the main product photo.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {/* Uploaded Images */}
              {images.map((file, idx) => (
                <div key={idx} className="relative aspect-square bg-black border border-white/10 overflow-hidden group">
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Upload ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => removeImage(idx)}
                    className="absolute top-2 right-2 p-1 bg-red-500 hover:bg-red-600 transition-colors opacity-0 group-hover:opacity-100"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4 text-white" />
                  </button>
                  {idx === 0 && (
                    <div className="absolute bottom-0 left-0 right-0 bg-hot/90 px-2 py-1 text-center uppercase tracking-wider" style={{ fontWeight: 900, fontSize: '9px' }}>
                      MAIN
                    </div>
                  )}
                </div>
              ))}
              
              {/* Upload Button */}
              {images.length < 5 && (
                <label className="aspect-square bg-white/5 border-2 border-dashed border-white/20 hover:border-hot transition-colors flex flex-col items-center justify-center cursor-pointer">
                  <Upload className="w-8 h-8 text-white/40 mb-2" />
                  <span className="text-white/40 uppercase tracking-wider" style={{ fontWeight: 700, fontSize: '11px' }}>Upload</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>

          {/* Details */}
          <div className="bg-white/5 border border-white/10 p-6 space-y-4">
            <h2 className="uppercase tracking-wider text-white mb-4" style={{ fontWeight: 900, fontSize: '20px' }}>
              PRODUCT DETAILS
            </h2>

            <div>
              <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                Title *
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => handleInputChange('title', e.target.value)}
                placeholder="e.g. Custom Leather Harness - Black"
                className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot transition-colors"
                maxLength={100}
              />
            </div>

            <div>
              <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                placeholder="Describe your product, materials, sizing, care instructions..."
                rows={6}
                className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot transition-colors resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Price (£) *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot transition-colors"
                />
              </div>

              <div>
                <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Stock Quantity *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.stock}
                  onChange={(e) => handleInputChange('stock', e.target.value)}
                  placeholder="0"
                  className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot transition-colors"
              >
                <option value="">Select a category</option>
                <option value="clothing">Clothing</option>
                <option value="accessories">Accessories</option>
                <option value="gear">Gear</option>
                <option value="toys">Toys</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                Tags (comma-separated)
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => handleInputChange('tags', e.target.value)}
                placeholder="e.g. leather, harness, black, custom"
                className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot transition-colors"
              />
            </div>
          </div>

          {/* Shipping */}
          <div className="bg-white/5 border border-white/10 p-6 space-y-4">
            <h2 className="uppercase tracking-wider text-white mb-4" style={{ fontWeight: 900, fontSize: '20px' }}>
              SHIPPING
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Shipping Cost (£)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.shippingCost}
                  onChange={(e) => handleInputChange('shippingCost', e.target.value)}
                  placeholder="0.00"
                  className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot transition-colors"
                />
                <p className="text-white/40 mt-1" style={{ fontWeight: 400, fontSize: '11px' }}>
                  Leave blank for free shipping
                </p>
              </div>

              <div>
                <label className="block text-white/60 uppercase tracking-wider mb-2" style={{ fontWeight: 700, fontSize: '11px' }}>
                  Processing Time
                </label>
                <select
                  value={formData.processingTime}
                  onChange={(e) => handleInputChange('processingTime', e.target.value)}
                  className="w-full px-4 py-3 bg-black border border-white/20 text-white focus:outline-none focus:border-hot transition-colors"
                >
                  <option value="1-3">1-3 business days</option>
                  <option value="3-5">3-5 business days</option>
                  <option value="5-7">5-7 business days</option>
                  <option value="1-2w">1-2 weeks</option>
                  <option value="2-4w">2-4 weeks</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col md:flex-row gap-3">
            <Button
              onClick={() => onNavigate('sellerListings')}
              variant="outline"
              disabled={submitting}
              className="flex-1 border-white/20 py-6"
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              CANCEL
            </Button>
            <Button
              onClick={() => handleSubmit('draft')}
              disabled={submitting}
              variant="outline"
              className="px-6 border-white/20 py-6"
              style={{ fontWeight: 700, fontSize: '14px' }}
            >
              {submitting ? 'SAVING...' : 'SAVE AS DRAFT'}
            </Button>
            <Button
              onClick={() => handleSubmit('active')}
              disabled={submitting}
              className="px-8 bg-hot hover:bg-white text-white hover:text-black py-6"
              style={{ fontWeight: 900, fontSize: '14px' }}
            >
              {submitting ? 'PUBLISHING...' : 'PUBLISH LISTING'}
            </Button>
          </div>
        </div>
      </div>
    </SellerLayout>
  );
}
