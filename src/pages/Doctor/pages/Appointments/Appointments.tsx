import { Calendar as CalendarIcon, Clock, User, Phone } from 'lucide-react';

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
  }
];

const Appointments = () => {
  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Appointments</h1>
          <p className='mt-1 text-sm text-gray-600'>List of medical appointments</p>
        </div>
        <div className='flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2'>
          <CalendarIcon className='h-5 w-5 text-orange-600' />
          <span className='text-sm font-medium text-orange-600'>{new Date().toLocaleDateString('vi-VN')}</span>
        </div>
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
              {mockAppointments.map((appointment) => (
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
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                        appointment.status === 'Đã xác nhận'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}
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

        {/* Empty State */}
        {mockAppointments.length === 0 && (
          <div className='py-12 text-center'>
            <CalendarIcon className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-4 text-sm font-medium text-gray-900'>No appointments</h3>
            <p className='mt-2 text-sm text-gray-500'>There are no appointments scheduled for today.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Appointments;
