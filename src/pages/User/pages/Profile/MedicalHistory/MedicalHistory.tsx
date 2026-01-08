import { useState } from "react";
import MedicalDetailModal from "~/pages/User/pages/Profile/MedicalHistory/components/MedicalDetailModal";
import type { MedicalRecord } from "~/types/medical.type";

const MedicalHistory = () => {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Mock data with extended fields
  const records: MedicalRecord[] = [
    {
      id: 1,
      petName: 'Milo',
      date: '2025-12-20',
      doctor: 'BS. Nguyễn Văn A',
      diagnosis: 'Viêm tai ngoài',
      treatment: 'Sử dụng thuốc nhỏ tai, vệ sinh tai định kỳ 2 lần/ngày',
      cost: 250000,
      symptoms: 'Ngứa tai liên tục, rung đầu, có mùi hôi ở vùng tai, tiết dịch màu vàng nâu',
      prescriptions: [
        'Thuốc nhỏ tai Otomax - 3 giọt/lần, 2 lần/ngày trong 7 ngày',
        'Viên kháng sinh Cephalexin 500mg - 1 viên/ngày sau ăn trong 5 ngày',
        'Dung dịch rửa tai Epi-Otic - Rửa tai 1 lần/ngày trước khi nhỏ thuốc'
      ],
      nextAppointment: 'Tái khám sau 7 ngày (27/12/2025) để kiểm tra tình trạng viêm nhiễm',
      notes: 'Tránh để nước vào tai trong quá trình điều trị. Nếu thấy triệu chứng nặng hơn, liên hệ ngay với phòng khám.'
    },
    {
      id: 2,
      petName: 'Milo',
      date: '2025-11-15',
      doctor: 'BS. Trần Thị B',
      diagnosis: 'Tiêm phòng định kỳ',
      treatment: 'Tiêm vaccine 6 bệnh (Distemper, Parvo, Hepatitis, Parainfluenza, Corona, Leptospirosis)',
      cost: 150000,
      symptoms: 'Không có triệu chứng - Khám sức khỏe định kỳ',
      prescriptions: [
        'Không có đơn thuốc',
        'Theo dõi trong 24h sau tiêm, có thể có sốt nhẹ, mệt mỏi'
      ],
      nextAppointment: 'Tiêm mũi tăng cường sau 3 tuần (06/12/2025)',
      notes: 'Thú cưng khỏe mạnh, phản ứng tốt với vaccine. Tiếp tục chế độ dinh dưỡng hiện tại.'
    },
    {
      id: 3,
      petName: 'Milo',
      date: '2025-10-10',
      doctor: 'BS. Lê Văn C',
      diagnosis: 'Rối loạn tiêu hóa',
      treatment: 'Điều chỉnh chế độ ăn, bổ sung men vi sinh',
      cost: 180000,
      symptoms: 'Tiêu chảy nhẹ, ăn kém, nôn 2-3 lần trong ngày',
      prescriptions: [
        'Men vi sinh Bio-Three - 1 gói/lần, 2 lần/ngày sau ăn',
        'Smecta - 1/2 gói/lần, 3 lần/ngày',
        'Thức ăn dạng nhuyễn trong 3 ngày đầu'
      ],
      nextAppointment: 'Theo dõi tại nhà, nếu không cải thiện sau 3 ngày thì tái khám',
      notes: 'Nghi ngờ do ăn phải thức ăn không phù hợp. Khuyến cáo chỉ cho ăn thức ăn chuyên dụng.'
    }
  ];


  const handleViewDetails = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTimeout(() => setSelectedRecord(null), 300);
  };

  return (
    <div className='mx-auto max-w-6xl'>
      <h2 className='mb-6 text-xl font-semibold text-gray-800'>Medical History</h2>

      <div className='relative space-y-6'>
        {/* Vertical Line */}
        <div className='absolute top-0 left-4 h-full w-0.5 bg-gray-200' />

        {records.map((record) => (
          <div key={record.id} className='relative pl-12'>
            {/* Timeline Dot */}
            <div className='absolute top-1 left-0 flex h-8 w-8 items-center justify-center rounded-full bg-lime-100'>
              <svg className='h-4 w-4 text-lime-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>

            {/* Record Card */}
            <div className='rounded-lg bg-white p-6 shadow-md'>
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    {record.petName} - {record.diagnosis}
                  </h3>
                  <p className='mt-1 text-sm text-gray-600'>
                    <span className='font-medium'>Doctor:</span> {record.doctor}
                  </p>
                </div>
                <div className='text-right'>
                  <span className='text-sm text-gray-500'>{new Date(record.date).toLocaleDateString('vi-VN')}</span>
                  <p className='mt-1 text-lg font-semibold text-lime-600'>{record.cost.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>

              {/* Treatment Details */}
              <div className='rounded-lg bg-gray-50 p-4'>
                <h4 className='mb-2 text-sm font-medium text-gray-700'>Treatment Methods:</h4>
                <p className='text-sm text-gray-600'>{record.treatment}</p>
              </div>

              {/* Actions */}
              <div className='mt-4 flex gap-2'>
                <button
                  className='text-sm text-lime-600 hover:text-lime-700 hover:underline cursor-pointer'
                  onClick={() => handleViewDetails(record)}>
                  View Details
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {records.length === 0 && (
        <div className='rounded-lg bg-white p-12 text-center shadow-md'>
          <svg className='mx-auto h-16 w-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          <p className='mt-4 text-gray-600'>No medical records yet</p>
        </div>
      )}

      <MedicalDetailModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        record={selectedRecord}
      />
    </div>
  );
};

export default MedicalHistory;
