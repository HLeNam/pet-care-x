import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import orderApi from '../../../../../apis/order.api';
import { Pagination } from '../../../components/Pagination';
import { X } from 'lucide-react';
import type { Order } from '../../../../../types/order.type';

const OrderHistory = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const pageSize = 10;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Fetch orders from API
  const { data, isLoading, isError } = useQuery({
    queryKey: ['orders', currentPage, pageSize],
    queryFn: () =>
      orderApi.getOrders({
        pageNo: currentPage - 1, // API uses 0-based index
        pageSize,
        sortBy: 'ngayLap',
        sortDir: 'desc'
      })
  });

  const orders = data?.data?.data?.items || [];
  const totalPages = data?.data?.data?.totalPage || 0;

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      'Đã hoàn thành': { label: 'Completed', className: 'bg-green-100 text-green-700' },
      'Đang giao hàng': { label: 'Shipping', className: 'bg-blue-100 text-blue-700' },
      'Đang xử lý': { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
      'Đã hủy': { label: 'Cancelled', className: 'bg-red-100 text-red-700' },
      'Đã thanh toán': { label: 'Paid', className: 'bg-emerald-100 text-emerald-700' },
      'Chưa thanh toán': { label: 'Unpaid', className: 'bg-orange-100 text-orange-700' }
    };

    const config = statusConfig[status] || { label: status, className: 'bg-gray-100 text-gray-700' };

    return <span className={`rounded-full px-3 py-1 text-xs font-medium ${config.className}`}>{config.label}</span>;
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className='mx-auto max-w-6xl'>
        <h2 className='mb-6 text-xl font-semibold text-gray-800'>Order History</h2>
        <div className='flex items-center justify-center py-12'>
          <div className='h-12 w-12 animate-spin rounded-full border-4 border-lime-500 border-t-transparent'></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='mx-auto max-w-6xl'>
        <h2 className='mb-6 text-xl font-semibold text-gray-800'>Order History</h2>
        <div className='rounded-lg bg-red-50 p-6 text-center text-red-600'>
          <p>Error loading orders. Please try again later.</p>
        </div>
      </div>
    );
  }

  return (
    <div className='mx-auto max-w-6xl'>
      <h2 className='mb-6 text-xl font-semibold text-gray-800'>Order History</h2>

      {/* Orders List */}
      <div className='space-y-4'>
        {orders.map((order) => (
          <div key={order.idHoaDon} className='rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>{order.maHoaDon}</h3>
                  {getStatusBadge(order.trangThai)}
                </div>
                <div className='mt-2 flex items-center gap-6 text-sm text-gray-600'>
                  <span className='flex items-center gap-1'>
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
                      />
                    </svg>
                    {new Date(order.ngayLap).toLocaleDateString('vi-VN')}
                  </span>
                  <span className='flex items-center gap-1'>
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
                      />
                    </svg>
                    {order.chiTietMuaHang.length} products
                  </span>
                  <span className='flex items-center gap-1'>
                    <svg className='h-4 w-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z'
                      />
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M15 11a3 3 0 11-6 0 3 3 0 016 0z'
                      />
                    </svg>
                    {order.tenChiNhanh}
                  </span>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-2xl font-bold text-lime-600'>{order.tienThanhToan.toLocaleString('vi-VN')}đ</p>
                <button
                  onClick={() => setSelectedOrder(order)}
                  className='mt-2 cursor-pointer text-sm text-lime-600 hover:text-lime-700 hover:underline'
                >
                  View Details →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && !isLoading && (
        <div className='rounded-lg bg-white p-12 text-center shadow-md'>
          <svg className='mx-auto h-16 w-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z'
            />
          </svg>
          <p className='mt-4 text-gray-600'>No orders yet</p>
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className='mt-8 flex justify-center'>
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          onClick={() => setSelectedOrder(null)}
          className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className='relative flex max-h-[90vh] w-full max-w-4xl flex-col rounded-lg bg-white shadow-xl'
          >
            {/* Header */}
            <div className='flex flex-shrink-0 items-center justify-between rounded-t-lg border-b bg-white p-6'>
              <div>
                <h3 className='text-2xl font-bold text-gray-800'>Order Details</h3>
                <p className='mt-1 text-sm text-gray-600'>{selectedOrder.maHoaDon}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className='cursor-pointer rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700'
              >
                <X className='h-6 w-6' />
              </button>
            </div>

            {/* Content - Scrollable Body */}
            <div className='overflow-y-auto p-6'>
              {/* Order Info */}
              <div className='mb-6 grid grid-cols-1 gap-6 md:grid-cols-2'>
                <div className='rounded-lg bg-gray-50 p-4'>
                  <h4 className='mb-3 font-semibold text-gray-800'>Order Information</h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Order ID:</span>
                      <span className='font-medium text-gray-800'>{selectedOrder.maHoaDon}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Date:</span>
                      <span className='font-medium text-gray-800'>
                        {new Date(selectedOrder.ngayLap).toLocaleDateString('vi-VN')}
                      </span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Status:</span>
                      <span>{getStatusBadge(selectedOrder.trangThai)}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Payment Method:</span>
                      <span className='font-medium text-gray-800'>{selectedOrder.hinhThucThanhToan}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Branch:</span>
                      <span className='font-medium text-gray-800'>{selectedOrder.tenChiNhanh}</span>
                    </div>
                  </div>
                </div>

                <div className='rounded-lg bg-gray-50 p-4'>
                  <h4 className='mb-3 font-semibold text-gray-800'>Delivery Information</h4>
                  <div className='space-y-2 text-sm'>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Recipient:</span>
                      <span className='font-medium text-gray-800'>{selectedOrder.tenNguoiNhan}</span>
                    </div>
                    <div className='flex justify-between'>
                      <span className='text-gray-600'>Phone:</span>
                      <span className='font-medium text-gray-800'>{selectedOrder.soDienThoaiNguoiNhan}</span>
                    </div>
                    <div>
                      <span className='text-gray-600'>Address:</span>
                      <p className='mt-1 font-medium text-gray-800'>{selectedOrder.diaChiGiaoHang}</p>
                    </div>
                    {selectedOrder.ghiChu && (
                      <div>
                        <span className='text-gray-600'>Note:</span>
                        <p className='mt-1 font-medium text-gray-800'>{selectedOrder.ghiChu}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Products */}
              <div className='mb-6'>
                <h4 className='mb-4 font-semibold text-gray-800'>Products</h4>
                <div className='space-y-3'>
                  {selectedOrder.chiTietMuaHang.map((item, index) => (
                    <div key={index} className='flex gap-4 rounded-lg border border-gray-200 bg-white p-4'>
                      <div className='h-20 w-20 flex-shrink-0 overflow-hidden rounded-lg bg-gray-100'>
                        {item.hinhAnh ? (
                          <img
                            src={item.hinhAnh}
                            alt={item.tenSanPham}
                            className='h-full w-full object-cover'
                            onError={(e) => {
                              e.currentTarget.src = '/placeholder-product.png';
                            }}
                          />
                        ) : (
                          <div className='flex h-full w-full items-center justify-center text-gray-400'>
                            <svg className='h-8 w-8' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path
                                strokeLinecap='round'
                                strokeLinejoin='round'
                                strokeWidth={2}
                                d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z'
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className='flex flex-1 flex-col justify-between'>
                        <div>
                          <h5 className='font-medium text-gray-800'>{item.tenSanPham}</h5>
                          <p className='mt-1 text-sm text-gray-600'>
                            {item.loaiSanPham} • Exp: {new Date(item.hanSuDung).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                        <div className='flex items-center justify-between'>
                          <span className='text-sm text-gray-600'>
                            {Number(item.giaBan).toLocaleString('vi-VN')}đ × {item.soLuongMua}
                          </span>
                          <span className='font-semibold text-lime-600'>{item.thanhTien.toLocaleString('vi-VN')}đ</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Footer - Order Summary */}
            <div className='flex-shrink-0 rounded-b-lg border-t bg-gray-50 p-6'>
              <div className='space-y-2 text-sm'>
                <div className='flex justify-between'>
                  <span className='text-gray-600'>Subtotal:</span>
                  <span className='font-medium text-gray-800'>{selectedOrder.tongTien.toLocaleString('vi-VN')}đ</span>
                </div>
                {selectedOrder.khuyenMai > 0 && (
                  <div className='flex justify-between'>
                    <span className='text-gray-600'>Discount:</span>
                    <span className='font-medium text-red-600'>
                      -{selectedOrder.khuyenMai.toLocaleString('vi-VN')}đ
                    </span>
                  </div>
                )}
                <div className='border-t border-gray-300 pt-2'></div>
                <div className='flex justify-between text-lg'>
                  <span className='font-semibold text-gray-800'>Total:</span>
                  <span className='font-bold text-lime-600'>
                    {selectedOrder.tienThanhToan.toLocaleString('vi-VN')}đ
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
