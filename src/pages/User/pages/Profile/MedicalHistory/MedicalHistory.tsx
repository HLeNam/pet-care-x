import { useState } from 'react';
import { toast } from 'react-toastify';
import { Loader2, Pill, ChevronDown, ChevronUp } from 'lucide-react';
import MedicalDetailModal from '~/pages/User/pages/Profile/MedicalHistory/components/MedicalDetailModal';
import type { MedicalRecord } from '~/types/medical.type';
import { useCustomerMedicalList } from '~/hooks/useMedicalRecord';
import { useAppContext } from '~/contexts';
import { usePrescriptionByMedicalRecord } from '~/hooks/usePrescriptions';

// Component to display prescription for a medical record
const MedicalRecordPrescriptionView = ({ recordId }: { recordId: number }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: prescriptionData, isLoading } = usePrescriptionByMedicalRecord(recordId, true);

  const prescription = prescriptionData?.data?.data;

  if (isLoading) {
    return (
      <div className='mt-2 flex items-center gap-2 text-sm text-gray-500'>
        <Loader2 className='h-4 w-4 animate-spin' />
        <span>Loading prescription...</span>
      </div>
    );
  }

  if (!prescription || !prescription.toaSanPhamList || prescription.toaSanPhamList.length === 0) {
    return null;
  }

  return (
    <div className='mt-3 border-t border-gray-200 pt-3'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex w-full cursor-pointer items-center justify-between text-sm font-semibold text-lime-600 transition-colors hover:text-lime-700'
      >
        <div className='flex items-center gap-2'>
          <Pill className='h-4 w-4' />
          <span>Prescription ({prescription.toaSanPhamList.length} medicines)</span>
        </div>
        {isExpanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
      </button>

      {isExpanded && (
        <div className='mt-2 space-y-2 rounded-lg bg-lime-50 p-3'>
          <p className='text-xs text-gray-600'>Code: {prescription.maToa}</p>
          {prescription.toaSanPhamList.map((medicine, index) => (
            <div key={medicine.idSanPham} className='rounded border border-lime-200 bg-white p-2 text-sm'>
              <div className='flex items-start justify-between'>
                <div className='flex gap-2'>
                  <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-lime-100 text-xs font-semibold text-lime-700'>
                    {index + 1}
                  </span>
                  <div>
                    <p className='font-medium text-gray-900'>{medicine.tenSanPham}</p>
                    <p className='text-xs text-gray-600'>
                      Qty: {medicine.soLuong} × {medicine.donGia.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
                <span className='font-semibold text-lime-600'>{medicine.thanhTien.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          ))}
          <div className='flex justify-between border-t border-lime-200 pt-2 text-sm font-semibold'>
            <span>Total:</span>
            <span className='text-lime-600'>
              {prescription.toaSanPhamList.reduce((sum, item) => sum + item.thanhTien, 0).toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

const MedicalHistory = () => {
  const { profile } = useAppContext();
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pageNo] = useState(1);
  const [pageSize] = useState(10);

  // Fetch medical records from API
  const { medicalRecords, isLoading, isError, error } = useCustomerMedicalList({
    userId: profile?.userId || 1,
    pageNo,
    pageSize
  });

  // Show error toast if API call fails
  if (isError) {
    toast.error((error as Error)?.message || 'Failed to load medical history');
  }

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

      {isLoading ? (
        <div className='flex items-center justify-center rounded-lg bg-white py-12 shadow-md'>
          <Loader2 className='h-8 w-8 animate-spin text-lime-500' />
          <span className='ml-2 text-sm text-gray-600'>Loading medical records...</span>
        </div>
      ) : (
        <div className='relative space-y-6'>
          {/* Vertical Line */}
          {medicalRecords.length > 0 && <div className='absolute top-0 left-4 h-full w-0.5 bg-gray-200' />}

          {medicalRecords.map((record) => (
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
                    <h3 className='text-lg font-semibold text-gray-800'>{record.petName}</h3>
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
                {/* <div className='rounded-lg bg-gray-50 p-4'>
                  <h4 className='mb-2 text-sm font-medium text-gray-700'>Treatment Methods:</h4>
                  <p className='text-sm text-gray-600'>{record.treatment}</p>
                </div> */}

                <div className='rounded-lg bg-gray-50 p-4'>
                  <p className='text-sm text-gray-600'>{record.prescriptions}</p>
                </div>

                {/* Prescription */}
                <MedicalRecordPrescriptionView recordId={record.id} />

                {/* Actions */}
                <div className='mt-4 flex gap-2'>
                  <button
                    className='cursor-pointer text-sm text-lime-600 hover:text-lime-700 hover:underline'
                    onClick={() => handleViewDetails(record)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Empty State */}
          {medicalRecords.length === 0 && (
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
        </div>
      )}

      <MedicalDetailModal isOpen={isModalOpen} onClose={handleCloseModal} record={selectedRecord} />
    </div>
  );
};

export default MedicalHistory;
