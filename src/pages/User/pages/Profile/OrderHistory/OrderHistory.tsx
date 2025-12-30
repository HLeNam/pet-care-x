const OrderHistory = () => {
  // Mock data
  const orders = [
    {
      id: 'ORD-2025001',
      date: '2025-12-25',
      total: 450000,
      status: 'completed',
      items: 3
    },
    {
      id: 'ORD-2025002',
      date: '2025-12-20',
      total: 320000,
      status: 'shipping',
      items: 2
    }
  ];

  const getStatusBadge = (status: string) => {
    const statusConfig: Record<string, { label: string; className: string }> = {
      completed: { label: 'Completed', className: 'bg-green-100 text-green-700' },
      shipping: { label: 'Shipping', className: 'bg-blue-100 text-blue-700' },
      pending: { label: 'Pending', className: 'bg-yellow-100 text-yellow-700' },
      cancelled: { label: 'Cancelled', className: 'bg-red-100 text-red-700' }
    };

    const config = statusConfig[status] || statusConfig.pending;

    return <span className={`rounded-full px-3 py-1 text-xs font-medium ${config.className}`}>{config.label}</span>;
  };

  return (
    <div className='mx-auto max-w-6xl'>
      <h2 className='mb-6 text-xl font-semibold text-gray-800'>Order History</h2>

      {/* Orders List */}
      <div className='space-y-4'>
        {orders.map((order) => (
          <div key={order.id} className='rounded-lg bg-white p-6 shadow-md transition-shadow hover:shadow-lg'>
            <div className='flex items-center justify-between'>
              <div className='flex-1'>
                <div className='flex items-center gap-4'>
                  <h3 className='text-lg font-semibold text-gray-800'>{order.id}</h3>
                  {getStatusBadge(order.status)}
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
                    {new Date(order.date).toLocaleDateString('vi-VN')}
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
                    {order.items} products
                  </span>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-2xl font-bold text-lime-600'>{order.total.toLocaleString('vi-VN')}đ</p>
                {/* <button className='mt-2 text-sm text-lime-600 hover:text-lime-700 hover:underline'>
                  View Details →
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {orders.length === 0 && (
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
    </div>
  );
};

export default OrderHistory;
