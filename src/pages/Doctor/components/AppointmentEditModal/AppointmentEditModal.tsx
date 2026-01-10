import { X, Calendar as CalendarIcon } from 'lucide-react';
import type { DoctorAppointmentItemResponse } from '~/types/employee.type';

interface AppointmentEditModalProps {
  isOpen: boolean;
  appointment: DoctorAppointmentItemResponse | null;
  onClose: () => void;
  onSave: () => void;
  onChange: (field: string, value: string) => void;
}

const AppointmentEditModal = ({ isOpen, appointment, onClose, onSave, onChange }: AppointmentEditModalProps) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4' onClick={onClose}>
      <div
        className='flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className='flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4'>
          <h2 className='text-2xl font-bold text-gray-900'>Edit Appointment</h2>
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
            {/* Appointment Information - Read Only */}
            <div className='rounded-lg border border-gray-200 bg-gray-50 p-4'>
              <h3 className='mb-3 text-lg font-semibold text-gray-900'>Appointment Information</h3>
              <div className='space-y-3'>
                <div className='grid grid-cols-2 gap-4'>
                  <div>
                    <span className='text-sm font-medium text-gray-600'>Customer:</span>
                    <p className='mt-1 text-sm text-gray-900'>{appointment.tenKhachHang || 'N/A'}</p>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-600'>Pet:</span>
                    <p className='mt-1 text-sm text-gray-900'>{appointment.tenThuCung || 'N/A'}</p>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-600'>Date:</span>
                    <p className='mt-1 text-sm text-gray-900'>{appointment.ngayHen}</p>
                  </div>
                  <div>
                    <span className='text-sm font-medium text-gray-600'>Time:</span>
                    <p className='mt-1 text-sm text-gray-900'>
                      {appointment.gioBatDau} - {appointment.gioKetThuc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Editable Status */}
            <div className='rounded-lg border border-gray-200 bg-blue-50 p-4'>
              <h3 className='mb-3 flex items-center text-lg font-semibold text-gray-900'>
                <CalendarIcon className='mr-2 h-5 w-5 text-orange-500' />
                Update Status
              </h3>
              <div>
                <label className='mb-1 block text-sm font-medium text-gray-700'>Status</label>
                <select
                  value={appointment.trangThai}
                  onChange={(e) => onChange('trangThai', e.target.value)}
                  className='w-full cursor-pointer rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none'
                >
                  <option value='Chờ xác nhận'>Chờ xác nhận</option>
                  <option value='Đã xác nhận'>Đã xác nhận</option>
                  <option value='Đã Đặt'>Đã Đặt</option>
                  <option value='Đã Hoàn Thành'>Đã Hoàn Thành</option>
                  <option value='Đã hủy'>Đã hủy</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className='flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4'>
          <button
            onClick={onClose}
            className='cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className='cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600'
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentEditModal;
