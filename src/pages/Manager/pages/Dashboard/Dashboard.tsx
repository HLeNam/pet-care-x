import { DollarSign, Activity, ShoppingBag, TrendingUp, Users } from 'lucide-react';
import { useState } from 'react';
import { Pagination } from '~/pages/User/components/Pagination';

const Dashboard = () => {
  const [doctorFilter, setDoctorFilter] = useState<'5' | '10' | 'all'>('5');
  const [doctorPage, setDoctorPage] = useState(1);
  const [branchPage, setBranchPage] = useState(1);

  const ITEMS_PER_PAGE = 5;
  // Mock data - sẽ được thay thế bằng API thực tế
  const stats = [
    {
      title: 'Total Revenue',
      value: '125,000,000 ₫',
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'increase' as const
    },
    {
      title: 'Total Appointments',
      value: '1,234',
      icon: Activity,
      change: '+8.2%',
      changeType: 'increase' as const
    },
    {
      title: 'Product Sales Revenue',
      value: '45,000,000 ₫',
      icon: ShoppingBag,
      change: '+15.3%',
      changeType: 'increase' as const
    }
  ];

  // Mock data cho doanh thu theo chi nhánh - Thêm nhiều chi nhánh hơn để test pagination
  const allBranchRevenue = [
    { branch: 'Chi nhánh Quận 1', revenue: 45000000, appointments: 456 },
    { branch: 'Chi nhánh Quận 3', revenue: 38000000, appointments: 392 },
    { branch: 'Chi nhánh Quận 7', revenue: 42000000, appointments: 386 },
    { branch: 'Chi nhánh Quận 5', revenue: 35000000, appointments: 358 },
    { branch: 'Chi nhánh Quận 10', revenue: 40000000, appointments: 412 },
    { branch: 'Chi nhánh Quận 2', revenue: 48000000, appointments: 475 },
    { branch: 'Chi nhánh Bình Thạnh', revenue: 43000000, appointments: 428 },
    { branch: 'Chi nhánh Tân Bình', revenue: 39000000, appointments: 395 },
    { branch: 'Chi nhánh Gò Vấp', revenue: 36000000, appointments: 368 },
    { branch: 'Chi nhánh Thủ Đức', revenue: 50000000, appointments: 492 }
  ];

  // Mock data cho thống kê theo bác sĩ
  const allDoctorStats = [
    { name: 'BS. Nguyễn Văn A', appointments: 145, branch: 'Chi nhánh Quận 1' },
    { name: 'BS. Trần Thị B', appointments: 132, branch: 'Chi nhánh Quận 3' },
    { name: 'BS. Lê Văn C', appointments: 128, branch: 'Chi nhánh Quận 7' },
    { name: 'BS. Phạm Thị D', appointments: 118, branch: 'Chi nhánh Quận 1' },
    { name: 'BS. Hoàng Văn E', appointments: 102, branch: 'Chi nhánh Quận 3' },
    { name: 'BS. Vũ Thị F', appointments: 98, branch: 'Chi nhánh Quận 7' },
    { name: 'BS. Đỗ Văn G', appointments: 95, branch: 'Chi nhánh Quận 1' },
    { name: 'BS. Bùi Thị H', appointments: 87, branch: 'Chi nhánh Quận 3' },
    { name: 'BS. Phan Văn I', appointments: 82, branch: 'Chi nhánh Quận 7' },
    { name: 'BS. Mai Thị K', appointments: 76, branch: 'Chi nhánh Quận 1' },
    { name: 'BS. Đặng Văn L', appointments: 71, branch: 'Chi nhánh Quận 3' },
    { name: 'BS. Trương Thị M', appointments: 68, branch: 'Chi nhánh Quận 7' }
  ];

  // Calculate pagination for branches
  const totalBranchPages = Math.ceil(allBranchRevenue.length / ITEMS_PER_PAGE);
  const paginatedBranchRevenue = allBranchRevenue.slice((branchPage - 1) * ITEMS_PER_PAGE, branchPage * ITEMS_PER_PAGE);

  // Filter and paginate doctors
  const filteredDoctors =
    doctorFilter === 'all' ? allDoctorStats : allDoctorStats.slice(0, doctorFilter === '5' ? 5 : 10);

  const totalDoctorPages = Math.ceil(filteredDoctors.length / ITEMS_PER_PAGE);
  const paginatedDoctors = filteredDoctors.slice((doctorPage - 1) * ITEMS_PER_PAGE, doctorPage * ITEMS_PER_PAGE);

  // Reset page when filter changes
  const handleDoctorFilterChange = (newFilter: '5' | '10' | 'all') => {
    setDoctorFilter(newFilter);
    setDoctorPage(1);
  };

  return (
    <div className='space-y-6'>
      {/* Page Title */}
      <div className='border-b border-gray-200 pb-4'>
        <h1 className='text-2xl font-bold text-gray-900'>Statistics & Reports</h1>
        <p className='mt-1 text-sm text-gray-500'>Business operations overview</p>
      </div>

      {/* Stats Cards */}
      <div className='grid gap-6 sm:grid-cols-2 lg:grid-cols-3'>
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.title}
              className='overflow-hidden rounded-lg border border-gray-200 bg-white p-6 transition-all duration-200 hover:border-gray-300'
            >
              <div className='flex items-center justify-between'>
                <div className='flex items-center gap-3'>
                  <div className='rounded-lg bg-orange-50 p-3'>
                    <Icon className='h-6 w-6 text-orange-600' />
                  </div>
                  <div>
                    <p className='text-sm font-medium text-gray-600'>{stat.title}</p>
                    <p className='mt-1 text-2xl font-bold text-gray-900'>{stat.value}</p>
                  </div>
                </div>
              </div>
              <div className='mt-4 flex items-center gap-1'>
                <TrendingUp
                  className={`h-4 w-4 ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}
                />
                <span
                  className={`text-sm font-medium ${stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'}`}
                >
                  {stat.change}
                </span>
                <span className='text-sm text-gray-500'>vs last month</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Revenue by Branch */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='mb-4 flex items-center justify-between border-b border-gray-200 pb-4'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>Revenue by Branch</h2>
            <p className='text-sm text-gray-500'>Current month statistics</p>
          </div>
          <select className='focus:ring-opacity-20 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'>
            <option>This Month</option>
            <option>Last Month</option>
            <option>Last 3 Months</option>
            <option>Last 6 Months</option>
          </select>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead>
              <tr className='border-b border-gray-200 text-left'>
                <th className='pb-3 text-sm font-semibold text-gray-700'>Branch</th>
                <th className='pb-3 text-right text-sm font-semibold text-gray-700'>Revenue</th>
                <th className='pb-3 text-right text-sm font-semibold text-gray-700'>Appointments</th>
                <th className='pb-3 text-right text-sm font-semibold text-gray-700'>Avg per Visit</th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-100'>
              {paginatedBranchRevenue.map((item, index) => (
                <tr key={index} className='transition-colors duration-200 hover:bg-gray-50'>
                  <td className='py-4 text-sm font-medium text-gray-900'>{item.branch}</td>
                  <td className='py-4 text-right text-sm text-gray-900'>{item.revenue.toLocaleString('vi-VN')} ₫</td>
                  <td className='py-4 text-right text-sm text-gray-900'>{item.appointments}</td>
                  <td className='py-4 text-right text-sm text-gray-900'>
                    {Math.round(item.revenue / item.appointments).toLocaleString('vi-VN')} ₫
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Branch Pagination */}
        {totalBranchPages > 1 && (
          <div className='mt-6 flex justify-center'>
            <Pagination currentPage={branchPage} totalPages={totalBranchPages} onPageChange={setBranchPage} />
          </div>
        )}
      </div>

      {/* Doctor Statistics */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='mb-4 flex items-center justify-between border-b border-gray-200 pb-4'>
          <div>
            <h2 className='text-lg font-semibold text-gray-900'>Appointments by Doctor</h2>
            <p className='text-sm text-gray-500'>
              {doctorFilter === 'all' ? 'All doctors' : `Top ${doctorFilter} doctors with the most appointments`}
            </p>
          </div>
          <select
            value={doctorFilter}
            onChange={(e) => handleDoctorFilterChange(e.target.value as '5' | '10' | 'all')}
            className='focus:ring-opacity-20 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
          >
            <option value='5'>Top 5</option>
            <option value='10'>Top 10</option>
            <option value='all'>All Doctors</option>
          </select>
        </div>

        <div className='space-y-4'>
          {paginatedDoctors.map((doctor, index) => (
            <div
              key={index}
              className='flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50'
            >
              <div className='flex items-center gap-4'>
                <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                  <Users className='h-5 w-5 text-orange-600' />
                </div>
                <div>
                  <p className='font-medium text-gray-900'>{doctor.name}</p>
                  <p className='text-sm text-gray-500'>{doctor.branch}</p>
                </div>
              </div>
              <div className='text-right'>
                <p className='text-lg font-semibold text-gray-900'>{doctor.appointments}</p>
                <p className='text-sm text-gray-500'>appointments</p>
              </div>
            </div>
          ))}
        </div>

        {/* Doctor Pagination */}
        {totalDoctorPages > 1 && (
          <div className='mt-6 flex justify-center'>
            <Pagination currentPage={doctorPage} totalPages={totalDoctorPages} onPageChange={setDoctorPage} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
