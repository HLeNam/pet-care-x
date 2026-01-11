import { X, UserIcon, Calendar as CalendarIcon, Clock, Building2, PawPrint } from 'lucide-react';
import type { DoctorAppointmentItemResponse } from '~/types/employee.type';
import { usePetDetails } from '~/hooks/usePetDetails';

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  appointment: DoctorAppointmentItemResponse | null;
  onClose: () => void;
}

const AppointmentDetailsModal = ({ isOpen, appointment, onClose }: AppointmentDetailsModalProps) => {
  const { data: petDetailsData, isLoading: isPetLoading } = usePetDetails({
    idThuCung: appointment?.idThuCung ?? null,
    enabled: isOpen && !!appointment?.idThuCung
  });

  const petDetails = petDetailsData?.data?.data;

  if (!isOpen || !appointment) return null;

  const translateStatusToEnglish = (status: string): string => {
    const statusMap: Record<string, string> = {
      'đã xác nhận': 'Confirmed',
      'đã hoàn thành': 'Completed',
      'chờ xác nhận': 'Pending',
      'đã đặt': 'Booked',
      'đã hủy': 'Cancelled'
    };
    return statusMap[status] || status;
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'đã xác nhận':
      case 'đã hoàn thành':
        return 'bg-green-100 text-green-800';
      case 'chờ xác nhận':
      case 'đã đặt':
        return 'bg-yellow-100 text-yellow-800';
      case 'đã hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4' onClick={onClose}>
      <div
        className='flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className='flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4'>
          <h2 className='text-2xl font-bold text-gray-900'>Appointment Details</h2>
          <button
            onClick={onClose}
            className='cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        {/* Modal Body */}
        <div className='flex-1 overflow-y-auto'>
          <div className='space-y-6 p-6'>
            {/* Status Badge */}
            <div className='flex items-center justify-between'>
              <div className='text-sm text-gray-500'>
                Appointment ID: <span className='font-medium text-gray-900'>#{appointment.idLichHen}</span>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(appointment.trangThai)}`}>
                {translateStatusToEnglish(appointment.trangThai.toLowerCase())}
              </span>
            </div>

            {/* Customer Information */}
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <h3 className='mb-3 flex items-center text-lg font-semibold text-gray-900'>
                <UserIcon className='mr-2 h-5 w-5 text-orange-500' />
                Customer Information
              </h3>
              <div className='space-y-2'>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Name:</span>
                  <span className='flex-1 text-sm text-gray-900'>{appointment.tenKhachHang || 'N/A'}</span>
                </div>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Branch:</span>
                  <span className='flex items-center text-sm text-gray-900'>
                    <Building2 className='mr-1 h-4 w-4 text-gray-400' />
                    {appointment.tenChiNhanh || 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Pet Information */}
            <div className='rounded-lg border border-gray-200 bg-orange-50 p-4'>
              <h3 className='mb-3 flex items-center text-lg font-semibold text-gray-900'>
                <PawPrint className='mr-2 h-5 w-5 text-orange-500' />
                Pet Information
              </h3>
              {isPetLoading ? (
                <div className='text-sm text-gray-500'>Loading pet details...</div>
              ) : (
                <div className='space-y-2'>
                  <div className='flex items-start'>
                    <span className='w-32 text-sm font-medium text-gray-600'>Name:</span>
                    <span className='flex-1 text-sm text-gray-900'>{appointment.tenThuCung || 'N/A'}</span>
                  </div>
                  {petDetails && (
                    <>
                      <div className='flex items-start'>
                        <span className='w-32 text-sm font-medium text-gray-600'>Code:</span>
                        <span className='flex-1 text-sm text-gray-900'>{petDetails.maThuCung || 'N/A'}</span>
                      </div>
                      <div className='flex items-start'>
                        <span className='w-32 text-sm font-medium text-gray-600'>Species:</span>
                        <span className='flex-1 text-sm text-gray-900'>{petDetails.loai || 'N/A'}</span>
                      </div>
                      <div className='flex items-start'>
                        <span className='w-32 text-sm font-medium text-gray-600'>Breed:</span>
                        <span className='flex-1 text-sm text-gray-900'>{petDetails.giong || 'N/A'}</span>
                      </div>
                      <div className='flex items-start'>
                        <span className='w-32 text-sm font-medium text-gray-600'>Gender:</span>
                        <span className='flex-1 text-sm text-gray-900'>{petDetails.gioiTinh || 'N/A'}</span>
                      </div>
                      <div className='flex items-start'>
                        <span className='w-32 text-sm font-medium text-gray-600'>Birth Date:</span>
                        <span className='flex-1 text-sm text-gray-900'>{petDetails.ngaySinh || 'N/A'}</span>
                      </div>
                      <div className='flex items-start'>
                        <span className='w-32 text-sm font-medium text-gray-600'>Health Status:</span>
                        <span className='flex-1 text-sm text-gray-900'>{petDetails.tinhTrangSucKhoe || 'N/A'}</span>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Appointment Information */}
            <div className='rounded-lg border border-gray-200 bg-blue-50 p-4'>
              <h3 className='mb-3 flex items-center text-lg font-semibold text-gray-900'>
                <CalendarIcon className='mr-2 h-5 w-5 text-orange-500' />
                Appointment Information
              </h3>
              <div className='space-y-2'>
                <div className='flex items-start'>
                  <span className='w-32 text-sm font-medium text-gray-600'>Date:</span>
                  <span className='flex items-center text-sm text-gray-900'>
                    <CalendarIcon className='mr-1 h-4 w-4 text-gray-400' />
                    {appointment.ngayHen}
                  </span>
                </div>
                <div className='flex items-start'>
                  <span className='w-32 text-sm font-medium text-gray-600'>Start Time:</span>
                  <span className='flex items-center text-sm text-gray-900'>
                    <Clock className='mr-1 h-4 w-4 text-gray-400' />
                    {appointment.gioBatDau}
                  </span>
                </div>
                <div className='flex items-start'>
                  <span className='w-32 text-sm font-medium text-gray-600'>End Time:</span>
                  <span className='flex items-center text-sm text-gray-900'>
                    <Clock className='mr-1 h-4 w-4 text-gray-400' />
                    {appointment.gioKetThuc}
                  </span>
                </div>
                <div className='flex items-start'>
                  <span className='w-32 text-sm font-medium text-gray-600'>Doctor:</span>
                  <span className='flex-1 text-sm text-gray-900'>{appointment.tenBacSi}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className='flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4'>
          <button
            onClick={onClose}
            className='cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
