import { Calendar as CalendarIcon, Clock, User, Phone, Filter } from 'lucide-react';
import { useState, useMemo } from 'react';
import { Pagination } from '~/pages/User/components/Pagination';

// Temporary mock data
const mockAppointments = [
  {
    id: 1,
    customerName: 'Nguyễn Văn A',
    petName: 'Milu',
    appointmentTime: '2026-01-06 09:00',
    status: 'Đã xác nhận',
    phone: '0901234567'
  },
  {
    id: 2,
    customerName: 'Trần Thị B',
    petName: 'Lucky',
    appointmentTime: '2026-01-06 10:30',
    status: 'Chờ xác nhận',
    phone: '0902345678'
  },
  {
    id: 3,
    customerName: 'Lê Văn C',
    petName: 'Bông',
    appointmentTime: '2026-01-06 14:00',
    status: 'Đã xác nhận',
    phone: '0903456789'
  },
  {
    id: 4,
    customerName: 'Phạm Thị D',
    petName: 'Cún',
    appointmentTime: '2026-01-06 15:30',
    status: 'Đã xác nhận',
    phone: '0904567890'
  },
  {
    id: 5,
    customerName: 'Hoàng Văn E',
    petName: 'Max',
    appointmentTime: '2026-01-06 16:00',
    status: 'Chờ xác nhận',
    phone: '0905678901'
  },
  {
    id: 6,
    customerName: 'Vũ Thị F',
    petName: 'Kitty',
    appointmentTime: '2026-01-07 09:00',
    status: 'Đã xác nhận',
    phone: '0906789012'
  },
  {
    id: 7,
    customerName: 'Đỗ Văn G',
    petName: 'Rocky',
    appointmentTime: '2026-01-07 10:00',
    status: 'Đã xác nhận',
    phone: '0907890123'
  },
  {
    id: 8,
    customerName: 'Mai Thị H',
    petName: 'Bella',
    appointmentTime: '2026-01-07 11:30',
    status: 'Chờ xác nhận',
    phone: '0908901234'
  },
  {
    id: 9,
    customerName: 'Ngô Văn I',
    petName: 'Tom',
    appointmentTime: '2026-01-07 13:00',
    status: 'Đã xác nhận',
    phone: '0909012345'
  },
  {
    id: 10,
    customerName: 'Bùi Thị K',
    petName: 'Luna',
    appointmentTime: '2026-01-07 14:30',
    status: 'Đã hủy',
    phone: '0900123456'
  },
  {
    id: 11,
    customerName: 'Dương Văn L',
    petName: 'Simba',
    appointmentTime: '2026-01-07 15:00',
    status: 'Đã xác nhận',
    phone: '0911234567'
  },
  {
    id: 12,
    customerName: 'Trịnh Thị M',
    petName: 'Mochi',
    appointmentTime: '2026-01-07 16:30',
    status: 'Chờ xác nhận',
    phone: '0912345678'
  },
  {
    id: 13,
    customerName: 'Lý Văn N',
    petName: 'Charlie',
    appointmentTime: '2026-01-08 09:00',
    status: 'Đã xác nhận',
    phone: '0913456789'
  },
  {
    id: 14,
    customerName: 'Hồ Thị O',
    petName: 'Daisy',
    appointmentTime: '2026-01-08 10:00',
    status: 'Đã xác nhận',
    phone: '0914567890'
  },
  {
    id: 15,
    customerName: 'Phan Văn P',
    petName: 'Oscar',
    appointmentTime: '2026-01-08 11:00',
    status: 'Chờ xác nhận',
    phone: '0915678901'
  },
  {
    id: 16,
    customerName: 'Võ Thị Q',
    petName: 'Leo',
    appointmentTime: '2026-01-08 13:30',
    status: 'Đã xác nhận',
    phone: '0916789012'
  },
  {
    id: 17,
    customerName: 'Tô Văn R',
    petName: 'Coco',
    appointmentTime: '2026-01-08 14:00',
    status: 'Đã xác nhận',
    phone: '0917890123'
  },
  {
    id: 18,
    customerName: 'Đinh Thị S',
    petName: 'Buddy',
    appointmentTime: '2026-01-08 15:30',
    status: 'Chờ xác nhận',
    phone: '0918901234'
  },
  {
    id: 19,
    customerName: 'Lương Văn T',
    petName: 'Nala',
    appointmentTime: '2026-01-08 16:00',
    status: 'Đã xác nhận',
    phone: '0919012345'
  },
  {
    id: 20,
    customerName: 'Đặng Thị U',
    petName: 'Tiger',
    appointmentTime: '2026-01-09 09:00',
    status: 'Đã xác nhận',
    phone: '0920123456'
  },
  {
    id: 21,
    customerName: 'Chu Văn V',
    petName: 'Cookie',
    appointmentTime: '2026-01-09 10:30',
    status: 'Chờ xác nhận',
    phone: '0921234567'
  },
  {
    id: 22,
    customerName: 'Thái Thị W',
    petName: 'Milo',
    appointmentTime: '2026-01-09 11:00',
    status: 'Đã xác nhận',
    phone: '0922345678'
  },
  {
    id: 23,
    customerName: 'Cao Văn X',
    petName: 'Pepper',
    appointmentTime: '2026-01-09 13:00',
    status: 'Đã xác nhận',
    phone: '0923456789'
  },
  {
    id: 24,
    customerName: 'Tạ Thị Y',
    petName: 'Ginger',
    appointmentTime: '2026-01-09 14:30',
    status: 'Chờ xác nhận',
    phone: '0924567890'
  },
  {
    id: 25,
    customerName: 'Ông Văn Z',
    petName: 'Shadow',
    appointmentTime: '2026-01-09 15:00',
    status: 'Đã xác nhận',
    phone: '0925678901'
  }
];

const ITEMS_PER_PAGE = 10;

const Appointments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customFromDate, setCustomFromDate] = useState<string>('');
  const [customToDate, setCustomToDate] = useState<string>('');

  // Filter appointments based on date
  const filteredAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return mockAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentTime);
      appointmentDate.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case 'today':
          return appointmentDate.getTime() === today.getTime();
        case 'tomorrow':
          return appointmentDate.getTime() === tomorrow.getTime();
        case 'week':
          return appointmentDate >= today && appointmentDate <= weekEnd;
        case 'custom':
          if (customFromDate && customToDate) {
            const fromDate = new Date(customFromDate);
            fromDate.setHours(0, 0, 0, 0);
            const toDate = new Date(customToDate);
            toDate.setHours(23, 59, 59, 999);
            return appointmentDate >= fromDate && appointmentDate <= toDate;
          }
          return true;
        default:
          return true;
      }
    });
  }, [dateFilter, customFromDate, customToDate]);

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAppointments.slice(startIndex, endIndex);
  }, [filteredAppointments, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateFilterChange = (filter: string) => {
    setDateFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã xác nhận':
        return 'bg-green-100 text-green-800';
      case 'Chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Appointments</h1>
          <p className='mt-1 text-sm text-gray-600'>
            List of medical appointments (
            {dateFilter === 'all' ? `${mockAppointments.length} total` : `${filteredAppointments.length} filtered`})
          </p>
        </div>
        <div className='flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2'>
          <CalendarIcon className='h-5 w-5 text-orange-600' />
          <span className='text-sm font-medium text-orange-600'>{new Date().toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className='rounded-lg border border-gray-200 bg-white p-4'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Filter className='h-5 w-5 text-gray-500' />
            <span className='text-sm font-medium text-gray-700'>Filter by Date:</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => handleDateFilterChange('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dateFilter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleDateFilterChange('today')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dateFilter === 'today'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleDateFilterChange('tomorrow')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dateFilter === 'tomorrow'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => handleDateFilterChange('week')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dateFilter === 'week'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => handleDateFilterChange('custom')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dateFilter === 'custom'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {dateFilter === 'custom' && (
          <div className='mt-4 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-4'>
            <div className='flex items-center gap-2'>
              <label htmlFor='fromDate' className='text-sm font-medium text-gray-700'>
                From:
              </label>
              <input
                type='date'
                id='fromDate'
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.target.value)}
                className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
              />
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor='toDate' className='text-sm font-medium text-gray-700'>
                To:
              </label>
              <input
                type='date'
                id='toDate'
                value={customToDate}
                onChange={(e) => setCustomToDate(e.target.value)}
                min={customFromDate}
                className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
              />
            </div>
            {customFromDate && customToDate && (
              <button
                onClick={() => {
                  setCustomFromDate('');
                  setCustomToDate('');
                }}
                className='rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50'
              >
                Clear Dates
              </button>
            )}
          </div>
        )}
      </div>

      {/* Appointments List */}
      <div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-b border-gray-200 bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Customer
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Pet
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Time
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {paginatedAppointments.map((appointment) => (
                <tr key={appointment.id} className='transition-colors hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                        <User className='h-5 w-5 text-orange-600' />
                      </div>
                      <div>
                        <div className='font-medium text-gray-900'>{appointment.customerName}</div>
                        <div className='flex items-center gap-1 text-sm text-gray-500'>
                          <Phone className='h-3 w-3' />
                          {appointment.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>{appointment.petName}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2 text-sm text-gray-900'>
                      <Clock className='h-4 w-4 text-gray-400' />
                      {new Date(appointment.appointmentTime).toLocaleString('vi-VN')}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <button className='rounded-lg border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50'>
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center border-t border-gray-200 py-4'>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className='py-12 text-center'>
            <CalendarIcon className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-4 text-sm font-medium text-gray-900'>No appointments</h3>
            <p className='mt-2 text-sm text-gray-500'>
              {dateFilter === 'all'
                ? 'There are no appointments scheduled.'
                : dateFilter === 'custom'
                  ? customFromDate && customToDate
                    ? 'There are no appointments in the selected date range.'
                    : 'Please select a date range.'
                  : `There are no appointments for ${dateFilter === 'today' ? 'today' : dateFilter === 'tomorrow' ? 'tomorrow' : 'this week'}.`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
