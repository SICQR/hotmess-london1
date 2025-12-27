import { useState, useEffect } from 'react';
import { Button } from '../../components/design-system/Button';
import { Input } from '../../components/design-system/Input';
import { Card } from '../../components/design-system/Card';
import { Badge } from '../../components/design-system/Badge';
import { ArrowLeft, Upload, X, AlertCircle, Check } from 'lucide-react';

interface ListingFormData {
  title: string;
  description: string;
  price: string;
  category: string;
  condition: string;
  size: string;
  brand: string;
  shipsFrom: string;
  shippingUK: string;
  shippingEU: string;
  shippingUSA: string;
  customRequestsAccepted: boolean;
  discretePackaging: boolean;
  noRefunds: boolean;
  isNsfw: boolean;
  tags: string[];
}

interface UploadedImage {
  id: string;
  url: string;
  file?: File;
}

const CATEGORIES = [
  'Used Underwear',
  'Socks',
  'Gym Gear',
  'Fetish Wear',
  'Custom Content',
  'Other',
];

const CONDITIONS = [
  'New with tags',
  'New without tags',
  'Used (1 day)',
  'Used (3 days)',
  'Used (1 week)',
  'Well worn',
];

export default function EditListing() {
  const router = {
    push: (path: string) => {
      if (typeof window !== 'undefined') window.location.href = path;
    },
    back: () => {
      if (typeof window !== 'undefined') window.history.back();
    },
  };
  const [listingId, setListingId] = useState<string>('');
  const [formData, setFormData] = useState<ListingFormData>({
    title: 'Calvin Klein Briefs',
    description: 'Worn 3 days, gym sessions included. Size M. Custom requests available.',
    price: '45',
    category: 'Used Underwear',
    condition: 'Used (3 days)',
    size: 'Medium',
    brand: 'Calvin Klein',
    shipsFrom: 'London, UK',
    shippingUK: '3',
    shippingEU: '8',
    shippingUSA: '12',
    customRequestsAccepted: true,
    discretePackaging: true,
    noRefunds: true,
    isNsfw: true,
    tags: ['gym', 'underwear', 'worn'],
  });

  const [images, setImages] = useState<UploadedImage[]>([
    { id: '1', url: 'https://via.placeholder.com/400x400?text=Image+1' },
    { id: '2', url: 'https://via.placeholder.com/400x400?text=Image+2' },
  ]);

  const [newTag, setNewTag] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    // In production, fetch listing data
    // const id = window.location.pathname.split('/').pop()?.replace('/edit', '');
    // setListingId(id || '');
    // fetchListingData(id);
  }, []);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const newImages = files.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      url: URL.createObjectURL(file),
      file,
    }));
    setImages([...images, ...newImages]);
  };

  const handleRemoveImage = (id: string) => {
    setImages(images.filter((img) => img.id !== id));
  };

  const handleAddTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim().toLowerCase())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim().toLowerCase()],
      });
      setNewTag('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((t) => t !== tag),
    });
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = 'Title is required';
    if (!formData.description.trim()) newErrors.description = 'Description is required';
    if (!formData.price || parseFloat(formData.price) <= 0) newErrors.price = 'Valid price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    if (images.length === 0) newErrors.images = 'At least one image is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      return;
    }

    setIsSaving(true);
    setSaveSuccess(false);

    try {
      // In production, upload images and save listing
      // await uploadImages(images.filter(img => img.file));
      // await updateListing(listingId, formData);

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));

      setSaveSuccess(true);
      setTimeout(() => {
        router.push('/seller/listings');
      }, 2000);
    } catch (error) {
      console.error('Failed to save listing:', error);
      setErrors({ submit: 'Failed to save listing. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pb-24">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-black/95 backdrop-blur border-b border-white/10">
        <div className="flex items-center justify-between p-4">
          <button
            onClick={() => router.push('/seller/listings')}
            className="p-2 hover:bg-white/10 rounded transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl uppercase tracking-wider">Edit Listing</h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="px-4 py-6 max-w-2xl mx-auto">
        {/* Success Message */}
        {saveSuccess && (
          <Card className="p-4 bg-green-500/10 border-green-500/20 mb-6">
            <div className="flex items-center gap-3">
              <Check className="w-5 h-5 text-green-500" />
              <p className="text-green-500">Listing updated successfully!</p>
            </div>
          </Card>
        )}

        {/* Error Message */}
        {errors.submit && (
          <Card className="p-4 bg-red-500/10 border-red-500/20 mb-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <p className="text-red-500">{errors.submit}</p>
            </div>
          </Card>
        )}

        {/* Images */}
        <section className="mb-6">
          <label className="block text-sm font-medium mb-3">
            Photos * <span className="text-white/60">(Max 10)</span>
          </label>
          
          <div className="grid grid-cols-3 gap-3 mb-3">
            {images.map((image) => (
              <div key={image.id} className="relative aspect-square">
                <img
                  src={image.url}
                  alt="Listing"
                  className="w-full h-full object-cover rounded border border-white/10"
                />
                <button
                  onClick={() => handleRemoveImage(image.id)}
                  className="absolute -top-2 -right-2 p-1 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            
            {images.length < 10 && (
              <label className="aspect-square border-2 border-dashed border-white/20 rounded flex items-center justify-center cursor-pointer hover:border-hot transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <div className="text-center">
                  <Upload className="w-6 h-6 mx-auto mb-1 text-white/40" />
                  <span className="text-xs text-white/60">Upload</span>
                </div>
              </label>
            )}
          </div>
          
          {errors.images && (
            <p className="text-sm text-red-500">{errors.images}</p>
          )}
        </section>

        {/* Basic Info */}
        <section className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Title *</label>
            <Input
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="Brief, descriptive title"
              error={errors.title}
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Detailed description of the item..."
              rows={4}
              className={`w-full px-4 py-3 bg-white/5 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-hot ${
                errors.description ? 'border-red-500' : 'border-white/10'
              }`}
            />
            {errors.description && (
              <p className="text-sm text-red-500 mt-1">{errors.description}</p>
            )}
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Price (£) *</label>
            <Input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              placeholder="0.00"
              error={errors.price}
            />
          </div>
        </section>

        {/* Category & Details */}
        <section className="mb-6">
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Category *</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-hot"
            >
              <option value="">Select category</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            {errors.category && (
              <p className="text-sm text-red-500 mt-1">{errors.category}</p>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Condition</label>
              <select
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded focus:outline-none focus:ring-2 focus:ring-hot"
              >
                {CONDITIONS.map((cond) => (
                  <option key={cond} value={cond}>{cond}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Size</label>
              <Input
                value={formData.size}
                onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                placeholder="e.g., Medium"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Brand</label>
              <Input
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g., Calvin Klein"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Ships From</label>
              <Input
                value={formData.shipsFrom}
                onChange={(e) => setFormData({ ...formData, shipsFrom: e.target.value })}
                placeholder="e.g., London, UK"
              />
            </div>
          </div>
        </section>

        {/* Shipping */}
        <section className="mb-6">
          <h3 className="text-sm font-medium mb-3">Shipping Rates (£)</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-xs text-white/60 mb-2">UK</label>
              <Input
                type="number"
                value={formData.shippingUK}
                onChange={(e) => setFormData({ ...formData, shippingUK: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-2">EU</label>
              <Input
                type="number"
                value={formData.shippingEU}
                onChange={(e) => setFormData({ ...formData, shippingEU: e.target.value })}
                placeholder="0.00"
              />
            </div>
            <div>
              <label className="block text-xs text-white/60 mb-2">USA</label>
              <Input
                type="number"
                value={formData.shippingUSA}
                onChange={(e) => setFormData({ ...formData, shippingUSA: e.target.value })}
                placeholder="0.00"
              />
            </div>
          </div>
        </section>

        {/* Tags */}
        <section className="mb-6">
          <label className="block text-sm font-medium mb-3">Tags</label>
          <div className="flex flex-wrap gap-2 mb-3">
            {formData.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-2">
                {tag}
                <button onClick={() => handleRemoveTag(tag)}>
                  <X className="w-3 h-3" />
                </button>
              </Badge>
            ))}
          </div>
          <div className="flex gap-2">
            <Input
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddTag())}
              placeholder="Add tag..."
              className="flex-1"
            />
            <Button onClick={handleAddTag} variant="outline" size="sm">
              Add
            </Button>
          </div>
        </section>

        {/* Policies */}
        <section className="mb-6">
          <h3 className="text-sm font-medium mb-3">Policies</h3>
          <div className="space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.customRequestsAccepted}
                onChange={(e) => setFormData({ ...formData, customRequestsAccepted: e.target.checked })}
                className="mt-1"
              />
              <span className="text-sm">Custom requests accepted</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.discretePackaging}
                onChange={(e) => setFormData({ ...formData, discretePackaging: e.target.checked })}
                className="mt-1"
              />
              <span className="text-sm">Discreet packaging</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.noRefunds}
                onChange={(e) => setFormData({ ...formData, noRefunds: e.target.checked })}
                className="mt-1"
              />
              <span className="text-sm">No refunds on used items</span>
            </label>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.isNsfw}
                onChange={(e) => setFormData({ ...formData, isNsfw: e.target.checked })}
                className="mt-1"
              />
              <span className="text-sm">Mark as NSFW (18+)</span>
            </label>
          </div>
        </section>

        {/* Actions */}
        <div className="flex gap-3">
          <Button
            onClick={() => router.push('/seller/listings')}
            variant="outline"
            className="flex-1"
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="primary"
            className="flex-1"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </div>
  );
}
