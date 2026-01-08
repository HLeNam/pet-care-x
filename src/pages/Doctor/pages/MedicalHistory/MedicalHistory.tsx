import { History as HistoryIcon, FileText, User, Calendar } from 'lucide-react';

// Temporary mock data
const mockMedicalHistory = [
  {
    id: 1,
    date: '2025-12-20',
    petName: 'Milu',
    ownerName: 'Nguyễn Văn A',
    symptoms: 'Nôn mửa, tiêu chảy',
    diagnosis: 'Viêm dạ dày',
    nextVisit: '2026-01-05'
  },
  {
    id: 2,
    date: '2025-12-18',
    petName: 'Lucky',
    ownerName: 'Trần Thị B',
    symptoms: 'Ho, sổ mũi',
    diagnosis: 'Cảm lạnh',
    nextVisit: '2025-12-28'
  },
  {
    id: 3,
    date: '2025-12-15',
    petName: 'Bông',
    ownerName: 'Lê Văn C',
    symptoms: 'Ngứa, rụng lông',
    diagnosis: 'Viêm da dị ứng',
    nextVisit: '2026-01-10'
  }
];

const MedicalHistory = () => {
  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Medical History</h1>
        <p className='mt-1 text-sm text-gray-600'>List of medical records performed by you</p>
      </div>

      {/* Statistics Cards */}
      <div className='grid gap-4 sm:grid-cols-3'>
        <div className='rounded-lg border border-gray-200 bg-white p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-orange-50'>
              <FileText className='h-6 w-6 text-orange-600' />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>{mockMedicalHistory.length}</p>
              <p className='text-sm text-gray-600'>Total Cases</p>
            </div>
          </div>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-green-50'>
              <Calendar className='h-6 w-6 text-green-600' />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>2</p>
              <p className='text-sm text-gray-600'>Today</p>
            </div>
          </div>
        </div>
        <div className='rounded-lg border border-gray-200 bg-white p-4'>
          <div className='flex items-center gap-3'>
            <div className='flex h-12 w-12 items-center justify-center rounded-lg bg-blue-50'>
              <HistoryIcon className='h-6 w-6 text-blue-600' />
            </div>
            <div>
              <p className='text-2xl font-bold text-gray-900'>1</p>
              <p className='text-sm text-gray-600'>This Week</p>
            </div>
          </div>
        </div>
      </div>

      {/* Medical Records List */}
      <div className='rounded-lg border border-gray-200 bg-white'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-b border-gray-200 bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Visit Date
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Pet
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Owner
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Diagnosis
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Next Visit
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {mockMedicalHistory.map((record) => (
                <tr key={record.id} className='transition-colors hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2 text-sm font-medium text-gray-900'>
                      <Calendar className='h-4 w-4 text-gray-400' />
                      {new Date(record.date).toLocaleDateString('vi-VN')}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>{record.petName}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2'>
                      <User className='h-4 w-4 text-gray-400' />
                      <span className='text-sm text-gray-900'>{record.ownerName}</span>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-900'>{record.diagnosis}</div>
                    <div className='mt-1 text-xs text-gray-500'>{record.symptoms}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-900'>
                      {new Date(record.nextVisit).toLocaleDateString('vi-VN')}
                    </div>
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
        {mockMedicalHistory.length === 0 && (
          <div className='py-12 text-center'>
            <HistoryIcon className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-4 text-sm font-medium text-gray-900'>No medical history</h3>
            <p className='mt-2 text-sm text-gray-500'>No medical records have been created by you.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MedicalHistory;
