import { X, Calendar as CalendarIcon } from 'lucide-react';

interface Appointment {
  id: number;
  customerName: string;
  petName: string;
  petType: string;
  petBreed: string;
  petAge: number;
  appointmentTime: string;
  status: string;
  phone: string;
  email: string;
  address: string;
  reason: string;
  notes: string;
}

interface AppointmentEditModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
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
            className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        {/* Modal Body */}
        <div className='flex-1 overflow-y-auto'>
          <div className='space-y-6 p-6'>
            {/* Appointment Information */}
            <div className='rounded-lg border border-gray-200 bg-blue-50 p-4'>
              <h3 className='mb-3 flex items-center text-lg font-semibold text-gray-900'>
                <CalendarIcon className='mr-2 h-5 w-5 text-orange-500' />
                Appointment Information
              </h3>
              <div className='grid grid-cols-2 gap-4'>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Date & Time</label>
                  <input
                    type='datetime-local'
                    value={appointment.appointmentTime.replace(' ', 'T')}
                    onChange={(e) => onChange('appointmentTime', e.target.value.replace('T', ' '))}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none'
                  />
                </div>
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Status</label>
                  <select
                    value={appointment.status}
                    onChange={(e) => onChange('status', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none'
                  >
                    <option value='Chờ xác nhận'>Chờ xác nhận</option>
                    <option value='Đã xác nhận'>Đã xác nhận</option>
                    <option value='Đã hủy'>Đã hủy</option>
                    <option value='Đã hoàn thành'>Đã hoàn thành</option>
                  </select>
                </div>
                <div className='col-span-2'>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Reason</label>
                  <input
                    type='text'
                    value={appointment.reason}
                    onChange={(e) => onChange('reason', e.target.value)}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none'
                  />
                </div>
                <div className='col-span-2'>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Notes</label>
                  <textarea
                    value={appointment.notes}
                    onChange={(e) => onChange('notes', e.target.value)}
                    rows={3}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className='flex justify-end gap-3 border-t border-gray-200 bg-gray-50 px-6 py-4'>
          <button
            onClick={onClose}
            className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
          >
            Cancel
          </button>
          <button
            onClick={onSave}
            className='rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600'
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentEditModal;
