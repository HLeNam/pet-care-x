import { History as HistoryIcon, Calendar } from 'lucide-react';
import { useState } from 'react';
import MedicalDetailModal from '~/pages/User/pages/Profile/MedicalHistory/components/MedicalDetailModal';
import type { MedicalRecord } from '~/types/medical.type';

// Temporary mock data
const mockMedicalHistory: MedicalRecord[] = [
  {
    id: 1,
    date: '2025-12-20',
    petName: 'Milu',
    doctor: 'BS. Nguyễn Văn A',
    symptoms: 'Nôn mửa, tiêu chảy',
    diagnosis: 'Viêm dạ dày',
    treatment: 'Thuốc kháng sinh, chế độ ăn nhẹ',
    cost: 250000,
    prescriptions: ['Amoxicillin 500mg - 2 viên/ngày', 'Smecta - 3 gói/ngày', 'Thức ăn nhuyễn trong 3 ngày'],
    nextAppointment: '2026-01-05',
    notes: 'Theo dõi tình trạng tiêu hóa, nếu không cải thiện sau 3 ngày cần tái khám sớm'
  },
  {
    id: 2,
    date: '2025-12-18',
    petName: 'Lucky',
    doctor: 'BS. Nguyễn Văn A',
    symptoms: 'Ho, sổ mũi',
    diagnosis: 'Cảm lạnh',
    treatment: 'Thuốc ho, giữ ấm',
    cost: 150000,
    prescriptions: ['Cough syrup - 5ml/lần, 3 lần/ngày', 'Vitamin C - 1 viên/ngày'],
    nextAppointment: '2025-12-28',
    notes: 'Giữ ấm, tránh gió lạnh'
  },
  {
    id: 3,
    date: '2025-12-15',
    petName: 'Bông',
    doctor: 'BS. Nguyễn Văn A',
    symptoms: 'Ngứa, rụng lông',
    diagnosis: 'Viêm da dị ứng',
    treatment: 'Thuốc bôi, thay đổi thức ăn',
    cost: 300000,
    prescriptions: [
      'Betamethasone cream - Bôi 2 lần/ngày',
      'Cetirizine 10mg - 1 viên/ngày',
      'Thức ăn chuyên dụng cho da nhạy cảm'
    ],
    nextAppointment: '2026-01-10',
    notes: 'Kiểm tra phản ứng với thức ăn mới, tránh tiếp xúc với chất gây dị ứng'
  }
];

const MedicalHistory = () => {
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  const handleOpenDetailModal = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => setSelectedRecord(null), 300);
  };

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Medical History</h1>
        <p className='mt-1 text-sm text-gray-600'>List of medical records performed by you</p>
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
                    <div className='text-sm text-gray-900'>{record.diagnosis}</div>
                    <div className='mt-1 text-xs text-gray-500'>{record.symptoms}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm text-gray-900'>{record.nextAppointment}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <button
                      onClick={() => handleOpenDetailModal(record)}
                      className='cursor-pointer rounded-lg border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50'
                    >
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

      {/* Medical Detail Modal */}
      <MedicalDetailModal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} record={selectedRecord} />
    </div>
  );
};

export default MedicalHistory;
