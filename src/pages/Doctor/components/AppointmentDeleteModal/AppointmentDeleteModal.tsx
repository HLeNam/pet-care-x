import { X, Trash2 } from 'lucide-react';
import type { DoctorAppointmentItemResponse } from '~/types/employee.type';

interface AppointmentDeleteModalProps {
  isOpen: boolean;
  appointment: DoctorAppointmentItemResponse | null;
  onClose: () => void;
  onConfirm: () => void;
}

const AppointmentDeleteModal = ({ isOpen, appointment, onClose, onConfirm }: AppointmentDeleteModalProps) => {
  if (!isOpen || !appointment) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4' onClick={onClose}>
      <div
        className='w-full max-w-md overflow-hidden rounded-xl bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className='flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4'>
          <h2 className='text-xl font-bold text-gray-900'>Confirm Delete</h2>
          <button
            onClick={onClose}
            className='cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
          >
            <X className='h-5 w-5' />
          </button>
        </div>

        {/* Modal Body */}
        <div className='p-6'>
          <div className='mb-4 flex items-center justify-center'>
            <div className='rounded-full bg-red-100 p-3'>
              <Trash2 className='h-8 w-8 text-red-600' />
            </div>
          </div>
          <p className='mb-2 text-center text-base font-medium text-gray-900'>
            Are you sure you want to delete this appointment?
          </p>
          <p className='text-center text-sm text-gray-600'>
            Appointment for <span className='font-semibold'>{appointment.tenThuCung || 'N/A'}</span> (
            {appointment.tenKhachHang || 'N/A'}) on{' '}
            <span className='font-semibold'>
              {appointment.ngayHen} {appointment.gioBatDau}
            </span>
          </p>
          <p className='mt-3 text-center text-sm text-red-600'>This action cannot be undone.</p>
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
            onClick={onConfirm}
            className='cursor-pointer rounded-lg bg-red-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-600'
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDeleteModal;
