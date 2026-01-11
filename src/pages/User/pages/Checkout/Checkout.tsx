import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, CreditCard, MapPin, Phone, User, FileText, CheckCircle2 } from 'lucide-react';
import { useCart } from '~/hooks/useCart';
import { useMutation } from '@tanstack/react-query';
import orderApi from '~/apis/order.api';
import type { OrderRequest } from '~/types/order.type';
import { toast } from 'react-toastify';

const Checkout = () => {
  const navigate = useNavigate();
  const { cart, clearCart } = useCart();

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const [formData, setFormData] = useState({
    tenNguoiNhan: '',
    soDienThoaiNguoiNhan: '',
    diaChiGiaoHang: '',
    ghiChu: '',
    // hinhThucThanhToan: 'CASH'
    hinhThucThanhToan: 'Tiền mặt'
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isOrderSuccess, setIsOrderSuccess] = useState(false);

  const createOrderMutation = useMutation({
    mutationFn: (data: OrderRequest) => orderApi.createOrder(data),
    onSuccess: () => {
      setIsOrderSuccess(true);
      clearCart();
      toast.success('Order placed successfully!');
      setTimeout(() => {
        navigate('/');
      }, 3000);
    },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    onError: (error: any) => {
      toast.error(error?.response?.data?.message || 'Failed to place order');
    }
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.tenNguoiNhan.trim()) {
      newErrors.tenNguoiNhan = 'Please enter recipient name';
    }

    if (!formData.soDienThoaiNguoiNhan.trim()) {
      newErrors.soDienThoaiNguoiNhan = 'Please enter phone number';
    } else if (!/^(0|\+84)[0-9]{9}$/.test(formData.soDienThoaiNguoiNhan.replace(/\s/g, ''))) {
      newErrors.soDienThoaiNguoiNhan = 'Invalid phone number';
    }

    if (!formData.diaChiGiaoHang.trim()) {
      newErrors.diaChiGiaoHang = 'Please enter delivery address';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error('Please fill in all required fields');
      return;
    }

    // Lấy branchId từ cart item đầu tiên (tất cả items đều cùng branch)
    const branchId = cart.items[0]?.branchId;

    const orderData: OrderRequest = {
      chitietMuaHang: cart.items.map((item) => ({
        idSanPham: Number(item.productId),
        soLuong: item.quantity
      })),
      idChiNhanh: Number(branchId),
      hinhThucThanhToan: formData.hinhThucThanhToan,
      tenNguoiNhan: formData.tenNguoiNhan,
      soDienThoaiNguoiNhan: formData.soDienThoaiNguoiNhan,
      diaChiGiaoHang: formData.diaChiGiaoHang,
      ghiChu: formData.ghiChu
    };

    createOrderMutation.mutate(orderData);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Redirect if cart is empty
  if (cart.totalItems === 0 && !isOrderSuccess) {
    navigate('/cart');
    return null;
  }

  // Success message
  if (isOrderSuccess) {
    return (
      <div className='container mx-auto px-4 py-6 sm:py-8 lg:py-12'>
        <div className='flex flex-col items-center justify-center py-12 sm:py-16 lg:py-20'>
          <CheckCircle2 className='mb-4 h-20 w-20 text-green-500 sm:h-24 sm:w-24 lg:h-28 lg:w-28' />
          <h2 className='mb-2 text-2xl font-semibold text-gray-800 sm:text-3xl lg:text-4xl'>Order Successful!</h2>
          <p className='mb-6 text-center text-sm text-gray-600 sm:text-base lg:text-lg'>
            Your order has been placed successfully. Thank you for shopping with us!
          </p>
          <p className='text-xs text-gray-500 sm:text-sm'>Redirecting to home page...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='container mx-auto px-4 py-4 sm:py-6 lg:py-8 xl:py-10'>
      {/* Header */}
      <div className='mb-4 sm:mb-6 lg:mb-8'>
        <button
          onClick={() => navigate('/cart')}
          className='mb-3 flex cursor-pointer items-center gap-2 text-sm text-gray-600 transition-colors hover:text-orange-600 sm:mb-4 sm:text-base'
        >
          <ArrowLeft className='h-4 w-4 sm:h-5 sm:w-5' />
          <span className='font-medium'>Back to Cart</span>
        </button>
        <h1 className='text-2xl font-bold text-gray-800 sm:text-3xl lg:text-4xl'>Checkout</h1>
        <p className='mt-1 text-xs text-gray-600 sm:mt-1.5 sm:text-sm lg:text-base'>Complete your order information</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className='grid gap-4 sm:gap-6 lg:grid-cols-3 lg:gap-6 xl:gap-8'>
          {/* Order Form */}
          <div className='space-y-4 sm:space-y-5 lg:col-span-2'>
            {/* Delivery Information */}
            <div className='rounded-xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6'>
              <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 sm:text-xl'>
                <MapPin className='h-5 w-5 text-orange-600' />
                Delivery Information
              </h2>

              <div className='space-y-4'>
                {/* Recipient Name */}
                <div>
                  <label
                    htmlFor='tenNguoiNhan'
                    className='mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700'
                  >
                    <User className='h-4 w-4' />
                    Recipient Name <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='text'
                    id='tenNguoiNhan'
                    name='tenNguoiNhan'
                    value={formData.tenNguoiNhan}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${errors.tenNguoiNhan ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none`}
                    placeholder='Enter recipient name'
                  />
                  {errors.tenNguoiNhan && <p className='mt-1 text-xs text-red-500'>{errors.tenNguoiNhan}</p>}
                </div>

                {/* Phone Number */}
                <div>
                  <label
                    htmlFor='soDienThoaiNguoiNhan'
                    className='mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700'
                  >
                    <Phone className='h-4 w-4' />
                    Phone Number <span className='text-red-500'>*</span>
                  </label>
                  <input
                    type='tel'
                    id='soDienThoaiNguoiNhan'
                    name='soDienThoaiNguoiNhan'
                    value={formData.soDienThoaiNguoiNhan}
                    onChange={handleInputChange}
                    className={`w-full rounded-lg border ${errors.soDienThoaiNguoiNhan ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none`}
                    placeholder='Enter phone number'
                  />
                  {errors.soDienThoaiNguoiNhan && (
                    <p className='mt-1 text-xs text-red-500'>{errors.soDienThoaiNguoiNhan}</p>
                  )}
                </div>

                {/* Delivery Address */}
                <div>
                  <label
                    htmlFor='diaChiGiaoHang'
                    className='mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700'
                  >
                    <MapPin className='h-4 w-4' />
                    Delivery Address <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    id='diaChiGiaoHang'
                    name='diaChiGiaoHang'
                    value={formData.diaChiGiaoHang}
                    onChange={handleInputChange}
                    rows={3}
                    className={`w-full rounded-lg border ${errors.diaChiGiaoHang ? 'border-red-500' : 'border-gray-300'} px-4 py-2.5 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none`}
                    placeholder='Enter delivery address'
                  />
                  {errors.diaChiGiaoHang && <p className='mt-1 text-xs text-red-500'>{errors.diaChiGiaoHang}</p>}
                </div>

                {/* Note */}
                <div>
                  <label htmlFor='ghiChu' className='mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700'>
                    <FileText className='h-4 w-4' />
                    Note (Optional)
                  </label>
                  <textarea
                    id='ghiChu'
                    name='ghiChu'
                    value={formData.ghiChu}
                    onChange={handleInputChange}
                    rows={2}
                    className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none'
                    placeholder='Any special requests or notes'
                  />
                </div>
              </div>
            </div>

            {/* Branch & Payment */}
            <div className='rounded-xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6'>
              <h2 className='mb-4 flex items-center gap-2 text-lg font-semibold text-gray-800 sm:text-xl'>
                <CreditCard className='h-5 w-5 text-orange-600' />
                Payment Method
              </h2>

              <div className='space-y-4'>
                {/* Branch Info */}
                <div className='rounded-lg border border-orange-200 bg-orange-50 p-3'>
                  <div className='flex items-center gap-2 text-sm'>
                    <Package className='h-4 w-4 text-orange-600' />
                    <span className='font-medium text-gray-700'>Branch:</span>
                    <span className='font-semibold text-gray-800'>{cart.items[0]?.branchName}</span>
                  </div>
                </div>

                {/* Payment Method */}
                <div>
                  <label
                    htmlFor='hinhThucThanhToan'
                    className='mb-1.5 flex items-center gap-2 text-sm font-medium text-gray-700'
                  >
                    <CreditCard className='h-4 w-4' />
                    Payment Method
                  </label>
                  <select
                    id='hinhThucThanhToan'
                    name='hinhThucThanhToan'
                    value={formData.hinhThucThanhToan}
                    onChange={handleInputChange}
                    className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-200 focus:outline-none'
                  >
                    {/* <option value='CASH'>Cash on Delivery</option>
                    <option value='CARD'>Credit/Debit Card</option>
                    <option value='BANK_TRANSFER'>Bank Transfer</option> */}
                    <option value='Tiền mặt'>Cash on Delivery</option>
                    <option value='Thẻ tín dụng'>Credit/Debit Card</option>
                    <option value='Chuyển khoản'>Bank Transfer</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div className='lg:col-span-1'>
            <div className='sticky top-4 rounded-xl border border-gray-200 bg-white p-4 sm:p-5 lg:p-6'>
              <h2 className='mb-4 text-lg font-semibold text-gray-800 sm:text-xl'>Order Summary</h2>

              {/* Products List */}
              <div className='mb-4 space-y-3 border-b border-gray-200 pb-4'>
                {cart.items.map((item) => (
                  <div key={`${item.productId}-${item.branchId}`} className='flex gap-3'>
                    <div className='h-16 w-16 flex-shrink-0 overflow-hidden rounded-lg border border-gray-200'>
                      <img
                        src={item.productImage}
                        alt={item.productName}
                        className='h-full w-full object-cover'
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://placehold.co/400x400?text=No+Image';
                        }}
                      />
                    </div>
                    <div className='flex-1'>
                      <h3 className='line-clamp-2 text-sm font-medium text-gray-800'>{item.productName}</h3>
                      <div className='mt-1 flex items-center justify-between'>
                        <span className='text-xs text-gray-500'>x{item.quantity}</span>
                        <span className='text-sm font-semibold text-gray-800'>
                          {(item.price * item.quantity).toLocaleString('vi-VN')}₫
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Price Summary */}
              <div className='space-y-2 border-b border-gray-200 pb-4'>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Subtotal</span>
                  <span className='font-medium text-gray-800'>{cart.totalPrice.toLocaleString('vi-VN')}₫</span>
                </div>
                <div className='flex justify-between text-sm'>
                  <span className='text-gray-600'>Shipping</span>
                  <span className='font-medium text-green-600'>Free</span>
                </div>
              </div>

              {/* Total */}
              <div className='mt-4 flex justify-between'>
                <span className='text-base font-semibold text-gray-800 sm:text-lg'>Total</span>
                <span className='text-lg font-bold text-orange-600 sm:text-xl'>
                  {cart.totalPrice.toLocaleString('vi-VN')}₫
                </span>
              </div>

              {/* Place Order Button */}
              <button
                type='submit'
                disabled={createOrderMutation.isPending}
                className='mt-6 w-full rounded-full bg-orange-500 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base'
              >
                {createOrderMutation.isPending ? 'Processing...' : 'Place Order'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default Checkout;
