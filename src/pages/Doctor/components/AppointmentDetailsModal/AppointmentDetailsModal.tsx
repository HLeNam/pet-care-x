import { X, UserIcon, Phone, Mail, MapPin, PawPrint, Calendar as CalendarIcon, Clock } from 'lucide-react';

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

interface AppointmentDetailsModalProps {
  isOpen: boolean;
  appointment: Appointment | null;
  onClose: () => void;
}

const AppointmentDetailsModal = ({ isOpen, appointment, onClose }: AppointmentDetailsModalProps) => {
  if (!isOpen || !appointment) return null;

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
            className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
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
                Appointment ID: <span className='font-medium text-gray-900'>#{appointment.id}</span>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-sm font-semibold ${
                  appointment.status === 'Confirmed'
                    ? 'bg-green-100 text-green-800'
                    : appointment.status === 'Pending'
                      ? 'bg-yellow-100 text-yellow-800'
                      : appointment.status === 'Completed'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-red-100 text-red-800'
                }`}
              >
                {appointment.status}
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
                  <span className='flex-1 text-sm text-gray-900'>{appointment.customerName}</span>
                </div>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Phone:</span>
                  <span className='flex items-center text-sm text-gray-900'>
                    <Phone className='mr-1 h-4 w-4 text-gray-400' />
                    {appointment.phone}
                  </span>
                </div>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Email:</span>
                  <span className='flex items-center text-sm text-gray-900'>
                    <Mail className='mr-1 h-4 w-4 text-gray-400' />
                    {appointment.email}
                  </span>
                </div>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Address:</span>
                  <span className='flex items-center text-sm text-gray-900'>
                    <MapPin className='mr-1 h-4 w-4 text-gray-400' />
                    {appointment.address}
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
              <div className='space-y-2'>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Name:</span>
                  <span className='flex-1 text-sm text-gray-900'>{appointment.petName}</span>
                </div>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Type:</span>
                  <span className='flex-1 text-sm text-gray-900'>{appointment.petType}</span>
                </div>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Breed:</span>
                  <span className='flex-1 text-sm text-gray-900'>{appointment.petBreed}</span>
                </div>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Age:</span>
                  <span className='flex-1 text-sm text-gray-900'>{appointment.petAge}</span>
                </div>
              </div>
            </div>

            {/* Appointment Information */}
            <div className='rounded-lg border border-gray-200 bg-blue-50 p-4'>
              <h3 className='mb-3 flex items-center text-lg font-semibold text-gray-900'>
                <CalendarIcon className='mr-2 h-5 w-5 text-orange-500' />
                Appointment Information
              </h3>
              <div className='space-y-2'>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Date & Time:</span>
                  <span className='flex items-center text-sm text-gray-900'>
                    <Clock className='mr-1 h-4 w-4 text-gray-400' />
                    {appointment.appointmentTime}
                  </span>
                </div>
                <div className='flex items-start'>
                  <span className='w-24 text-sm font-medium text-gray-600'>Reason:</span>
                  <span className='flex-1 text-sm text-gray-900'>{appointment.reason}</span>
                </div>
                {appointment.notes && (
                  <div className='flex items-start'>
                    <span className='w-24 text-sm font-medium text-gray-600'>Notes:</span>
                    <span className='flex-1 text-sm text-gray-900'>{appointment.notes}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className='flex justify-end border-t border-gray-200 bg-gray-50 px-6 py-4'>
          <button
            onClick={onClose}
            className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default AppointmentDetailsModal;
