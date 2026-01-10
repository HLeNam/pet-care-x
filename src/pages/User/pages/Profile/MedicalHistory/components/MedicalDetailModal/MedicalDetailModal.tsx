import { AlertCircle, Calendar, Clock, DollarSign, Stethoscope, User, X } from 'lucide-react';
import type { MedicalRecord } from '~/types/medical.type';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord | null;
}

const MedicalDetailModal: React.FC<ModalProps> = ({ isOpen, onClose, record }) => {
  if (!isOpen || !record) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center p-4'>
      {/* Backdrop */}
      <div className='absolute inset-0 bg-black/50 transition-opacity' onClick={onClose} />

      {/* Modal Content */}
      <div className='hide-scrollbar relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white shadow-2xl'>
        {/* Header */}
        <div className='sticky top-0 rounded-t-2xl bg-linear-to-r from-lime-500 to-lime-600 p-6 text-white'>
          <button
            onClick={onClose}
            className='hover:bg-opacity-20 absolute top-4 right-4 rounded-full p-2 transition hover:cursor-pointer hover:bg-gray-200'
          >
            <X size={24} />
          </button>
          <h2 className='text-2xl font-bold'>Details</h2>
          <p className='mt-1 text-lime-100'>{record.petName}</p>
        </div>

        {/* Body */}
        <div className='space-y-6 p-6'>
          {/* Basic Info Grid */}
          <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
            <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-4'>
              <Calendar className='mt-1 text-lime-600' size={20} />
              <div>
                <p className='mb-1 text-xs text-gray-500'>Date</p>
                <p className='font-semibold text-gray-800'>
                  {new Date(record.date).toLocaleDateString('vi-VN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              </div>
            </div>

            <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-4'>
              <User className='mt-1 text-lime-600' size={20} />
              <div>
                <p className='mb-1 text-xs text-gray-500'>Doctor</p>
                <p className='font-semibold text-gray-800'>{record.doctor}</p>
              </div>
            </div>

            <div className='flex items-start gap-3 rounded-lg bg-gray-50 p-4'>
              <Stethoscope className='mt-1 text-lime-600' size={20} />
              <div>
                <p className='mb-1 text-xs text-gray-500'>Diagnosis</p>
                <p className='font-semibold text-gray-800'>{record.diagnosis}</p>
              </div>
            </div>

            <div className='flex items-start gap-3 rounded-lg border border-lime-200 bg-lime-50 p-4'>
              <DollarSign className='mt-1 text-lime-600' size={20} />
              <div>
                <p className='mb-1 text-xs text-gray-500'>Cost</p>
                <p className='text-xl font-bold text-lime-600'>{record.cost.toLocaleString('vi-VN')}đ</p>
              </div>
            </div>
          </div>

          {/* Symptoms */}
          {record.symptoms && (
            <div className='rounded-r-lg border-l-4 border-orange-400 bg-orange-50 p-4'>
              <div className='mb-2 flex items-start gap-2'>
                <AlertCircle className='mt-1 text-orange-600' size={18} />
                <h3 className='font-semibold text-gray-800'>Symptoms</h3>
              </div>
              <p className='ml-6 text-gray-700'>{record.symptoms}</p>
            </div>
          )}

          {/* Treatment */}
          {/* <div className='rounded-lg bg-blue-50 p-4'>
            <div className='mb-2 flex items-start gap-2'>
              <FileText className='mt-1 text-blue-600' size={18} />
              <h3 className='font-semibold text-gray-800'>Treatment Method</h3>
            </div>
            <p className='ml-6 text-gray-700'>{record.treatment}</p>
          </div> */}

          {/* Prescriptions */}
          {record.prescriptions && record.prescriptions.length > 0 && (
            <div>
              <h3 className='mb-3 font-semibold text-gray-800'>Prescriptions</h3>
              <ul className='space-y-2'>
                {record.prescriptions.map((prescription, index) => (
                  <li key={index} className='flex items-start gap-2 rounded-lg bg-gray-50 p-3'>
                    <span className='flex h-6 w-6 items-center justify-center rounded-full bg-lime-100 text-xs font-semibold text-lime-700'>
                      {index + 1}
                    </span>
                    <span className='flex-1 text-gray-700'>{prescription}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Next Appointment */}
          {record.nextAppointment && (
            <div className='rounded-lg border border-purple-200 bg-linear-to-r from-purple-50 to-pink-50 p-4'>
              <div className='flex items-start gap-2'>
                <Clock className='mt-1 text-purple-600' size={18} />
                <div>
                  <h3 className='mb-1 font-semibold text-gray-800'>Next Appointment</h3>
                  <p className='text-gray-700'>{record.nextAppointment}</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MedicalDetailModal;
