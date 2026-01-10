import { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  ShoppingCart,
  Minus,
  Plus,
  ArrowLeft,
  Package,
  Store,
  X,
  ChevronLeft,
  ChevronRight,
  Loader2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { useCart } from '~/hooks/useCart';
import type { Product, ProductCategory } from '~/types/product.type';
import productApi from '~/apis/product.api';

const categoryLabels: Record<ProductCategory, string> = {
  food: 'Food',
  medicine: 'Medicine',
  accessory: 'Accessory'
};

const categoryColors: Record<ProductCategory, string> = {
  food: 'bg-orange-100 text-orange-700',
  medicine: 'bg-green-100 text-green-700',
  accessory: 'bg-blue-100 text-blue-700'
};

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart, cart } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedBranch, setSelectedBranch] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalImageIndex, setModalImageIndex] = useState(0);

  // Fetch product details from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['product', id],
    queryFn: () => productApi.getProductDetails(id!),
    enabled: !!id
  });

  // Transform API response to Product type
  const product: Product | null = useMemo(() => {
    if (!data?.data.data) return null;

    return {
      _id: String(data.data.data.idSanPham),
      name: data.data.data.tenSanPham,
      description: data.data.data.loaiSanPham,
      category:
        data.data.data.loaiSanPham.toLowerCase() === 'thức ăn'
          ? 'food'
          : data.data.data.loaiSanPham.toLowerCase() === 'thuốc'
            ? 'medicine'
            : ('accessory' as ProductCategory),
      price: parseFloat(data.data.data.giaBan),
      stock: data.data.data.tonKho?.reduce((sum, stock) => sum + stock.soLuong, 0) || 0,
      image: data.data.data.hinhAnh || 'https://placehold.co/800x800?text=No+Image',
      images: data.data.data.hinhAnh ? [data.data.data.hinhAnh] : ['https://placehold.co/800x800?text=No+Image'],
      rating: 4.5,
      sold: data.data.data.tonKho?.reduce((sum, stock) => sum + stock.soLuongDaBan, 0) || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
  }, [data]);

  // Transform tonKho to branches
  const branches = useMemo(() => {
    if (!data?.data.data?.tonKho) return [];

    return data.data.data.tonKho.map((item) => ({
      _id: String(item.idChiNhanh),
      name: item.tenChiNhanh,
      stock: item.soLuong
    }));
  }, [data]);

  // Select first available branch when product loads
  useEffect(() => {
    if (product && branches.length > 0) {
      const availableBranch = branches.find((b) => b.stock > 0);
      if (availableBranch) {
        setSelectedBranch(availableBranch._id);
      }
      window.scrollTo(0, 0);
    }
  }, [product, branches]);

  // Handle ESC key to close modal
  useEffect(() => {
    const handleEscKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isModalOpen) {
        setIsModalOpen(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => window.removeEventListener('keydown', handleEscKey);
  }, [isModalOpen]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isModalOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isModalOpen]);

  const handleQuantityChange = (change: number) => {
    const selectedBranchData = branches.find((b) => b._id === selectedBranch);
    const maxStock = selectedBranchData?.stock || 0;

    setQuantity((prev) => {
      const newValue = prev + change;
      if (newValue < 1) return 1;
      if (newValue > maxStock) return maxStock;
      return newValue;
    });
  };

  const handleAddToCart = () => {
    if (!selectedBranch) {
      toast.error('Please select a branch');
      return;
    }

    if (!product) {
      return;
    }

    const selectedBranchData = branches.find((b) => b._id === selectedBranch);
    if (!selectedBranchData) {
      toast.error('Invalid branch selected');
      return;
    }

    const cartBranchId = cart.items[0]?.branchId;
    if (cartBranchId && cartBranchId !== selectedBranch) {
      toast.error('Cannot add items from different branches to the cart.');
      return;
    }

    // Add to cart using context
    addToCart({
      productId: product._id,
      productName: product.name,
      productImage: product.image,
      price: product.price,
      quantity: quantity,
      branchId: selectedBranch,
      branchName: selectedBranchData.name,
      maxStock: selectedBranchData.stock
    });

    toast.success(`Added ${quantity} product${quantity > 1 ? 's' : ''} to cart!`);

    // Reset quantity to 1 after adding to cart
    setQuantity(1);
  };

  const openModal = (index: number) => {
    setModalImageIndex(index);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const navigateModal = (direction: 'prev' | 'next') => {
    if (!product) return;
    const images = product.images || [product.image];

    if (direction === 'prev') {
      setModalImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    } else {
      setModalImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }
  };

  const selectedBranchData = branches.find((b) => b._id === selectedBranch);

  if (isLoading) {
    return (
      <div className='Container py-6 sm:py-8'>
        <div className='flex h-96 flex-col items-center justify-center gap-4'>
          <Loader2 className='h-12 w-12 animate-spin text-orange-600' />
          <p className='text-gray-600'>Loading product details...</p>
        </div>
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className='Container py-6 sm:py-8'>
        <div className='flex flex-col items-center justify-center py-12 sm:py-16'>
          <Package className='mb-3 h-20 w-20 text-gray-400 sm:mb-4 sm:h-24 sm:w-24' />
          <h2 className='mb-2 text-xl font-semibold text-gray-700 sm:text-2xl'>Product not found</h2>
          <button
            onClick={() => navigate('/')}
            className='mt-3 rounded-full bg-orange-500 px-5 py-2 text-sm text-white transition-colors hover:bg-orange-600 sm:mt-4 sm:px-6 sm:text-base'
          >
            Back to home
          </button>
        </div>
      </div>
    );
  }

  const images = product.images || [product.image];
  const isOutOfStock = !selectedBranchData || selectedBranchData.stock === 0;

  return (
    <div className='Container py-4 sm:py-6 lg:py-8'>
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className='mb-4 flex cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors hover:text-orange-600 sm:mb-6 sm:text-base'
      >
        <ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5' />
        <span className='font-medium'>Back</span>
      </button>

      <div className='grid gap-6 lg:grid-cols-2 lg:gap-8 xl:gap-10'>
        {/* Product Images */}
        <div className='space-y-3 sm:space-y-4'>
          {/* Main Image */}
          <div className='overflow-hidden rounded-xl border border-gray-200 bg-white sm:rounded-2xl'>
            <button
              onClick={() => openModal(selectedImage)}
              className='w-full cursor-zoom-in transition-opacity hover:opacity-90'
            >
              <div className='aspect-square bg-orange-50 p-3 sm:p-4'>
                <img
                  src={images[selectedImage]}
                  alt={product.name}
                  className='h-full w-full object-cover'
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://placehold.co/800x800?text=No+Image';
                  }}
                />
              </div>
            </button>
          </div>

          {/* Thumbnail Images */}
          {images.length > 1 && (
            <div className='grid grid-cols-3 gap-2 sm:grid-cols-4'>
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`cursor-pointer overflow-hidden rounded-lg border-2 transition-all ${
                    selectedImage === index ? 'border-orange-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className='aspect-square bg-orange-50 p-1.5 sm:p-2'>
                    <img
                      src={img}
                      alt={`${product.name} ${index + 1}`}
                      className='h-full w-full object-cover'
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://placehold.co/200x200?text=No+Image';
                      }}
                    />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className='space-y-4 sm:space-y-5 lg:space-y-6'>
          {/* Product Name */}
          <div>
            <h1 className='mb-2 text-2xl leading-tight font-bold text-gray-800 sm:mb-3 sm:text-3xl lg:text-4xl'>
              {product.name}
            </h1>
            <div className='flex flex-wrap items-center gap-2'>
              <span
                className={`rounded-full px-2.5 py-1 text-xs font-semibold sm:px-3 sm:text-sm ${categoryColors[product.category]}`}
              >
                {categoryLabels[product.category]}
              </span>
              {product.sold && (
                <div className='flex items-center gap-1 text-xs text-gray-600 sm:text-sm'>
                  {product.sold && <span className='text-gray-400'>({product.sold} sold)</span>}
                </div>
              )}
            </div>
          </div>

          {/* Vaccine Type (if applicable) */}
          {product.category === 'medicine' && (
            <div className='rounded-lg border border-green-200 bg-green-50 p-3 sm:p-4'>
              <p className='text-xs font-semibold text-green-800 sm:text-sm'>Vaccine Type</p>
              <p className='text-sm text-green-700 sm:text-base'>Core Vaccine</p>
            </div>
          )}

          {/* Manufacturer */}
          <div className='space-y-1'>
            <p className='text-xs font-semibold text-gray-700 sm:text-sm'>Manufacturer</p>
            <p className='text-sm text-gray-600 sm:text-base'>-</p>
          </div>

          {/* Description */}
          <div className='space-y-1'>
            <p className='text-xs font-semibold text-gray-700 sm:text-sm'>Product Description</p>
            <p className='text-sm leading-relaxed text-gray-600 sm:text-base'>{product.description}</p>
          </div>

          {/* Price */}
          <div className='rounded-xl border border-orange-200 bg-orange-50 p-4 sm:rounded-2xl sm:p-5 lg:p-6'>
            <p className='mb-1 text-xs text-gray-600 sm:text-sm'>Price</p>
            <p className='text-3xl font-bold text-orange-600 sm:text-4xl'>{product.price.toLocaleString('vi-VN')}₫</p>
          </div>

          {/* Branch Selection */}
          <div className='space-y-2 sm:space-y-3'>
            <label className='flex items-center gap-2 text-xs font-semibold text-gray-700 sm:text-sm'>
              <Store className='h-4 w-4 text-gray-600 sm:h-5 sm:w-5' />
              Select Branch
            </label>
            <select
              value={selectedBranch}
              onChange={(e) => {
                setSelectedBranch(e.target.value);
                setQuantity(1);
              }}
              className='w-full cursor-pointer rounded-lg border-2 border-gray-200 bg-white px-3 py-2.5 text-sm text-gray-800 transition-colors focus:border-lime-400 focus:ring-2 focus:ring-lime-200 focus:outline-none sm:px-4 sm:py-3 sm:text-base'
            >
              <option value='' className='!cursor-pointer'>
                -- Select Branch --
              </option>
              {branches.map((branch) => (
                <option key={branch._id} value={branch._id} disabled={branch.stock === 0} className='!cursor-pointer'>
                  {branch.name} {branch.stock === 0 ? '(Out of stock)' : `(${branch.stock} items)`}
                </option>
              ))}
            </select>
          </div>

          {/* Stock and Quantity */}
          {selectedBranch && (
            <div className='space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-3 sm:space-y-4 sm:p-4'>
              <div className='flex items-center justify-between'>
                <span className='text-xs font-semibold text-gray-700 sm:text-sm'>Stock Quantity</span>
                <span
                  className={`text-base font-bold sm:text-lg ${isOutOfStock ? 'text-red-600' : selectedBranchData.stock < 10 ? 'text-orange-600' : 'text-green-600'}`}
                >
                  {selectedBranchData?.stock ?? 0} items
                </span>
              </div>

              {!isOutOfStock && (
                <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4'>
                  <span className='text-xs font-semibold text-gray-700 sm:text-sm'>Quantity</span>
                  <div className='flex items-center gap-2 sm:gap-3'>
                    <button
                      onClick={() => handleQuantityChange(-1)}
                      disabled={quantity <= 1}
                      className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 transition-all hover:border-lime-400 hover:bg-lime-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10'
                    >
                      <Minus className='h-4 w-4 sm:h-5 sm:w-5' />
                    </button>
                    <input
                      type='number'
                      value={quantity}
                      onChange={(e) => {
                        const val = parseInt(e.target.value) || 1;
                        setQuantity(Math.min(Math.max(1, val), selectedBranchData.stock));
                      }}
                      className='w-16 rounded-lg border-2 border-gray-200 bg-white px-2 py-2 text-center text-base font-semibold text-gray-800 transition-colors focus:border-lime-400 focus:ring-2 focus:ring-lime-200 focus:outline-none sm:w-20 sm:px-3 sm:text-lg'
                      min='1'
                      max={selectedBranchData.stock}
                    />
                    <button
                      onClick={() => handleQuantityChange(1)}
                      disabled={quantity >= selectedBranchData.stock}
                      className='flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg border-2 border-gray-300 bg-white text-gray-700 transition-all hover:border-lime-400 hover:bg-lime-50 disabled:cursor-not-allowed disabled:opacity-40 sm:h-10 sm:w-10'
                    >
                      <Plus className='h-4 w-4 sm:h-5 sm:w-5' />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Add to Cart Button */}
          <button
            onClick={handleAddToCart}
            disabled={!selectedBranch || isOutOfStock}
            className='flex w-full cursor-pointer items-center justify-center gap-2 rounded-full bg-lime-500 py-3 text-base font-bold text-white transition-all hover:bg-lime-600 disabled:cursor-not-allowed disabled:bg-gray-300 disabled:text-gray-500 sm:gap-3 sm:py-4 sm:text-lg'
          >
            <ShoppingCart className='h-5 w-5 sm:h-6 sm:w-6' />
            {isOutOfStock ? 'Out of stock' : 'Add to cart'}
          </button>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && (
        <div
          className='bg-opacity-90 fixed inset-0 z-50 flex items-center justify-center bg-black/90'
          onClick={closeModal}
        >
          {/* Close button */}
          <button
            onClick={closeModal}
            className='bg-opacity-70 hover:bg-opacity-90 absolute top-2 right-2 z-10 cursor-pointer rounded-full bg-gray-800 p-2 text-white transition-all sm:top-4 sm:right-4'
            aria-label='Close'
          >
            <X className='h-6 w-6 sm:h-8 sm:w-8' />
          </button>

          {/* Previous button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateModal('prev');
              }}
              className='bg-opacity-70 hover:bg-opacity-90 absolute left-2 z-10 cursor-pointer rounded-full bg-gray-800 p-2 text-white transition-all sm:left-4 sm:p-3'
              aria-label='Previous image'
            >
              <ChevronLeft className='h-6 w-6 sm:h-8 sm:w-8' />
            </button>
          )}

          {/* Image */}
          <div
            className='relative flex h-[90vh] w-[90vw] items-center justify-center'
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={images[modalImageIndex]}
              alt={`${product.name} - Image ${modalImageIndex + 1}`}
              className='max-h-full max-w-full object-contain'
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://placehold.co/800x800?text=No+Image';
              }}
            />
            {/* Image counter */}
            {images.length > 1 && (
              <div className='bg-opacity-60 absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-black px-3 py-1.5 text-xs text-white sm:px-4 sm:py-2 sm:text-sm'>
                {modalImageIndex + 1} / {images.length}
              </div>
            )}
          </div>

          {/* Next button */}
          {images.length > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                navigateModal('next');
              }}
              className='bg-opacity-70 hover:bg-opacity-90 absolute right-2 z-10 cursor-pointer rounded-full bg-gray-800 p-2 text-white transition-all sm:right-4 sm:p-3'
              aria-label='Next image'
            >
              <ChevronRight className='h-6 w-6 sm:h-8 sm:w-8' />
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetail;
