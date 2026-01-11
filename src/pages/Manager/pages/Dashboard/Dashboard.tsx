import { DollarSign, Activity, ShoppingBag, Users } from 'lucide-react';
import { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Pagination } from '~/pages/User/components/Pagination';
import managerApi from '~/apis/manager.api';

const Dashboard = () => {
  const [doctorFilter, setDoctorFilter] = useState<'5' | '10' | 'all'>('5');
  const [doctorPage, setDoctorPage] = useState(1);
  const [branchPage, setBranchPage] = useState(1);
  const [dateRange, setDateRange] = useState<'this_month' | 'last_month' | 'last_3_months' | 'last_6_months'>(
    'this_month'
  );
  const [doctorDateRange, setDoctorDateRange] = useState<
    'this_month' | 'last_month' | 'last_3_months' | 'last_6_months'
  >('this_month');

  const ITEMS_PER_PAGE = 5;

  // Calculate date range for API params
  const { startDate, endDate } = useMemo(() => {
    const today = new Date();
    let end = new Date();
    let start = new Date();

    switch (dateRange) {
      case 'this_month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0); // Last day of this month
        break;
      case 'last_month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
        break;
      case 'last_3_months':
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 'last_6_months':
        start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }, [dateRange]);

  // Calculate date range for doctor appointments
  const { startDate: doctorStartDate, endDate: doctorEndDate } = useMemo(() => {
    const today = new Date();
    let end = new Date();
    let start = new Date();

    switch (doctorDateRange) {
      case 'this_month':
        start = new Date(today.getFullYear(), today.getMonth(), 1);
        end = new Date(today.getFullYear(), today.getMonth() + 1, 0);
        break;
      case 'last_month':
        start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        end = new Date(today.getFullYear(), today.getMonth(), 0);
        break;
      case 'last_3_months':
        start = new Date(today.getFullYear(), today.getMonth() - 3, 1);
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
      case 'last_6_months':
        start = new Date(today.getFullYear(), today.getMonth() - 6, 1);
        end = new Date(today.getFullYear(), today.getMonth(), today.getDate());
        break;
    }

    return {
      startDate: start.toISOString().split('T')[0],
      endDate: end.toISOString().split('T')[0]
    };
  }, [doctorDateRange]);

  // Fetch revenue by branch
  const { data: revenueData, isLoading: isLoadingRevenue } = useQuery({
    queryKey: ['revenueByBranch', startDate, endDate],
    queryFn: () => managerApi.getRevenueByBranch({ startDate, endDate }),
    select: (response) => response.data.data
  });

  // Fetch appointments by branch
  const { data: appointmentsData, isLoading: isLoadingAppointments } = useQuery({
    queryKey: ['appointmentsByBranch', startDate, endDate],
    queryFn: () => managerApi.getAppointmentsByBranch({ startDate, endDate }),
    select: (response) => response.data.data
  });

  // Fetch sales revenue by branch
  const { data: salesRevenueData, isLoading: isLoadingSalesRevenue } = useQuery({
    queryKey: ['salesRevenueByBranch', startDate, endDate],
    queryFn: () => managerApi.getSalesRevenueByBranch({ startDate, endDate }),
    select: (response) => response.data.data
  });

  // Fetch doctor appointments
  const { data: doctorAppointmentsData, isLoading: isLoadingDoctorAppointments } = useQuery({
    queryKey: ['doctorAppointments', doctorStartDate, doctorEndDate, doctorPage, doctorFilter, ITEMS_PER_PAGE],
    queryFn: () =>
      managerApi.getDoctorAppointments({
        startDate: doctorStartDate,
        endDate: doctorEndDate,
        page: doctorPage - 1, // API uses 0-based index
        size: ITEMS_PER_PAGE,
        topN: doctorFilter === 'all' ? undefined : parseInt(doctorFilter)
      }),
    select: (response) => response.data.data
  });

  // Merge data from both APIs
  const mergedBranchData = useMemo(() => {
    if (!revenueData || !appointmentsData || !salesRevenueData) return [];

    return revenueData.revenueByBranch.map((revenue) => {
      const appointment = appointmentsData.appointmentByBranch.find((apt) => apt.idChiNhanh === revenue.idChiNhanh);
      const salesRevenue = salesRevenueData.salesRevenueByBranch.find(
        (sales) => sales.idChiNhanh === revenue.idChiNhanh
      );

      return {
        idChiNhanh: revenue.idChiNhanh,
        branch: revenue.tenChiNhanh,
        revenue: revenue.tongDoanhThuChiNhanh,
        appointments: appointment?.soLichHenDaHoanThanh || 0,
        salesRevenue: salesRevenue?.tongDoanhThuBanHangChiNhanh || 0
      };
    });
  }, [revenueData, appointmentsData, salesRevenueData]);

  // Stats data - sử dụng dữ liệu từ API
  const stats = [
    {
      title: 'Total Revenue',
      value: revenueData?.totalRevenue ? `${revenueData.totalRevenue.toLocaleString('vi-VN')} ₫` : '0 ₫',
      icon: DollarSign,
      change: '+12.5%',
      changeType: 'increase' as const,
      isLoading: isLoadingRevenue
    },
    {
      title: 'Total Appointments',
      value: appointmentsData?.totalSuccessfulAppointments
        ? appointmentsData.totalSuccessfulAppointments.toLocaleString('vi-VN')
        : '0',
      icon: Activity,
      change: '+8.2%',
      changeType: 'increase' as const,
      isLoading: isLoadingAppointments
    },
    {
      title: 'Product Sales Revenue',
      value: salesRevenueData?.totalSalesRevenue
        ? `${salesRevenueData.totalSalesRevenue.toLocaleString('vi-VN')} ₫`
        : '0 ₫',
      icon: ShoppingBag,
      change: '+15.3%',
      changeType: 'increase' as const,
      isLoading: isLoadingSalesRevenue
    }
  ];

  // Use merged data from APIs
  const allBranchRevenue = mergedBranchData;

  // Calculate pagination for branches
  const totalBranchPages = Math.ceil(allBranchRevenue.length / ITEMS_PER_PAGE);
  const paginatedBranchRevenue = allBranchRevenue.slice((branchPage - 1) * ITEMS_PER_PAGE, branchPage * ITEMS_PER_PAGE);

  // Use API data for doctors
  const doctorsList = doctorAppointmentsData?.content || [];
  const totalDoctorPages = doctorAppointmentsData?.totalPages || 0;

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
                    {stat.isLoading ? (
                      <div className='mt-1 h-8 w-32 animate-pulse rounded bg-gray-200'></div>
                    ) : (
                      <p className='mt-1 text-2xl font-bold text-gray-900'>{stat.value}</p>
                    )}
                  </div>
                </div>
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
          <select
            value={dateRange}
            onChange={(e) => {
              setDateRange(e.target.value as typeof dateRange);
              setBranchPage(1);
            }}
            className='focus:ring-opacity-20 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
          >
            <option value='this_month'>This Month</option>
            <option value='last_month'>Last Month</option>
            <option value='last_3_months'>Last 3 Months</option>
            <option value='last_6_months'>Last 6 Months</option>
          </select>
        </div>

        <div className='overflow-x-auto'>
          {isLoadingRevenue || isLoadingAppointments || isLoadingSalesRevenue ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent'></div>
                <p className='mt-2 text-sm text-gray-500'>Loading data...</p>
              </div>
            </div>
          ) : allBranchRevenue.length === 0 ? (
            <div className='flex items-center justify-center py-12'>
              <p className='text-sm text-gray-500'>No data available for the selected period</p>
            </div>
          ) : (
            <table className='w-full'>
              <thead>
                <tr className='border-b border-gray-200 text-left'>
                  <th className='pb-3 text-sm font-semibold text-gray-700'>Branch</th>
                  <th className='pb-3 text-right text-sm font-semibold text-gray-700'>Revenue</th>
                  <th className='pb-3 text-right text-sm font-semibold text-gray-700'>Appointments</th>
                  <th className='pb-3 text-right text-sm font-semibold text-gray-700'>Sales Revenue</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-gray-100'>
                {paginatedBranchRevenue.map((item) => (
                  <tr key={item.idChiNhanh} className='transition-colors duration-200 hover:bg-gray-50'>
                    <td className='py-4 text-sm font-medium text-gray-900'>{item.branch}</td>
                    <td className='py-4 text-right text-sm text-gray-900'>{item.revenue.toLocaleString('vi-VN')} ₫</td>
                    <td className='py-4 text-right text-sm text-gray-900'>{item.appointments}</td>
                    <td className='py-4 text-right text-sm text-gray-900'>
                      {item.salesRevenue.toLocaleString('vi-VN')} ₫
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
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
          <div className='flex items-center gap-3'>
            <select
              value={doctorDateRange}
              onChange={(e) => {
                setDoctorDateRange(e.target.value as typeof doctorDateRange);
                setDoctorPage(1);
              }}
              className='focus:ring-opacity-20 rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition-colors duration-200 hover:border-gray-400 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
            >
              <option value='this_month'>This Month</option>
              <option value='last_month'>Last Month</option>
              <option value='last_3_months'>Last 3 Months</option>
              <option value='last_6_months'>Last 6 Months</option>
            </select>
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
        </div>

        <div className='space-y-4'>
          {isLoadingDoctorAppointments ? (
            <div className='flex items-center justify-center py-12'>
              <div className='text-center'>
                <div className='inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-orange-600 border-r-transparent'></div>
                <p className='mt-2 text-sm text-gray-500'>Loading data...</p>
              </div>
            </div>
          ) : doctorsList.length === 0 ? (
            <div className='flex items-center justify-center py-12'>
              <p className='text-sm text-gray-500'>No data available for the selected period</p>
            </div>
          ) : (
            doctorsList.map((doctor) => (
              <div
                key={doctor.doctorId}
                className='flex items-center justify-between rounded-lg border border-gray-100 p-4 transition-all duration-200 hover:border-gray-200 hover:bg-gray-50'
              >
                <div className='flex items-center gap-4'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                    <Users className='h-5 w-5 text-orange-600' />
                  </div>
                  <div>
                    <p className='font-medium text-gray-900'>{doctor.doctorName}</p>
                    <p className='text-sm text-gray-500'>{doctor.branchName}</p>
                  </div>
                </div>
                <div className='text-right'>
                  <p className='text-lg font-semibold text-gray-900'>{doctor.completedAppointments}</p>
                  <p className='text-sm text-gray-500'>appointments</p>
                </div>
              </div>
            ))
          )}
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
