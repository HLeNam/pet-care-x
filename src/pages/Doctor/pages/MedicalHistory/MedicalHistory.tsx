import { History as HistoryIcon, Calendar, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import MedicalDetailModal from '~/pages/User/pages/Profile/MedicalHistory/components/MedicalDetailModal';
import type { MedicalRecord } from '~/types/medical.type';
import { useDoctorMedicalList } from '~/hooks/useMedicalRecord';
import { useAppContext } from '~/contexts';

const MedicalHistory = () => {
  const { profile } = useAppContext();
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [pageNo, setPageNo] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // Fetch medical records from API - hook handles all parsing
  const { medicalRecords, pagination, isLoading, isError, error } = useDoctorMedicalList({
    userId: profile?.userId || 1,
    pageNo,
    pageSize
  });

  // Show error toast if API call fails
  if (isError) {
    toast.error((error as Error)?.message || 'Failed to load medical history');
  }

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
        {isLoading ? (
          <div className='flex items-center justify-center py-12'>
            <Loader2 className='h-8 w-8 animate-spin text-orange-500' />
            <span className='ml-2 text-sm text-gray-600'>Loading medical records...</span>
          </div>
        ) : (
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
                {medicalRecords.map((record) => (
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

            {/* Empty State */}
            {medicalRecords.length === 0 && (
              <div className='py-12 text-center'>
                <HistoryIcon className='mx-auto h-12 w-12 text-gray-400' />
                <h3 className='mt-4 text-sm font-medium text-gray-900'>No medical history</h3>
                <p className='mt-2 text-sm text-gray-500'>No medical records have been created by you.</p>
              </div>
            )}
          </div>
        )}

        {/* Pagination */}
        {!isLoading && medicalRecords.length > 0 && (
          <div className='flex items-center justify-between border-t border-gray-200 bg-white px-6 py-4'>
            <div className='flex items-center gap-2 text-sm text-gray-700'>
              <span>
                Showing {(pagination.pageNo - 1) * pagination.pageSize + 1} to{' '}
                {Math.min(pagination.pageNo * pagination.pageSize, pagination.totalElements)} of{' '}
                {pagination.totalElements} results
              </span>
            </div>

            <div className='flex items-center gap-2'>
              {/* Previous Button */}
              <button
                onClick={() => setPageNo((prev) => Math.max(1, prev - 1))}
                disabled={pagination.pageNo === 1}
                className='flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white'
              >
                <ChevronLeft className='h-4 w-4' />
                Previous
              </button>

              {/* Page Numbers */}
              <div className='flex items-center gap-1'>
                {Array.from({ length: pagination.totalPage }, (_, i) => i + 1)
                  .filter((page) => {
                    // Show first page, last page, current page, and pages around current
                    return (
                      page === 1 ||
                      page === pagination.totalPage ||
                      (page >= pagination.pageNo - 1 && page <= pagination.pageNo + 1)
                    );
                  })
                  .map((page, index, array) => (
                    <div key={page} className='flex items-center'>
                      {/* Show ellipsis if there's a gap */}
                      {index > 0 && array[index - 1] !== page - 1 && <span className='px-2 text-gray-500'>...</span>}
                      <button
                        onClick={() => setPageNo(page)}
                        className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                          page === pagination.pageNo
                            ? 'bg-orange-500 text-white hover:bg-orange-600'
                            : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        {page}
                      </button>
                    </div>
                  ))}
              </div>

              {/* Next Button */}
              <button
                onClick={() => setPageNo((prev) => Math.min(pagination.totalPage, prev + 1))}
                disabled={pagination.pageNo === pagination.totalPage}
                className='flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white'
              >
                Next
                <ChevronRight className='h-4 w-4' />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Medical Detail Modal */}
      <MedicalDetailModal isOpen={isDetailModalOpen} onClose={handleCloseDetailModal} record={selectedRecord} />
    </div>
  );
};

export default MedicalHistory;
