import { AlertCircle, Calendar, Clock, DollarSign, Stethoscope, User, X, Pill, Loader2 } from 'lucide-react';
import type { MedicalRecord } from '~/types/medical.type';
import { usePrescriptionByMedicalRecord } from '~/hooks/usePrescriptions';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  record: MedicalRecord | null;
}

const MedicalDetailModal: React.FC<ModalProps> = ({ isOpen, onClose, record }) => {
  // Fetch prescription for this medical record
  const { data: prescriptionData, isLoading: isPrescriptionLoading } = usePrescriptionByMedicalRecord(
    record?.id || null,
    isOpen && !!record
  );

  const prescription = prescriptionData?.data?.data?.items?.[0];

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
                <p className='text-xl font-bold text-lime-600'>{(record?.cost ?? 0).toLocaleString('vi-VN')}đ</p>
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

          {/* Prescriptions from API */}
          {isPrescriptionLoading ? (
            <div className='rounded-lg bg-blue-50 p-4'>
              <div className='flex items-center justify-center gap-2'>
                <Loader2 className='h-5 w-5 animate-spin text-blue-600' />
                <span className='text-sm text-gray-600'>Loading prescription...</span>
              </div>
            </div>
          ) : prescription && prescription.toaSanPhamList && prescription.toaSanPhamList.length > 0 ? (
            <div className='rounded-lg bg-blue-50 p-4'>
              <div className='mb-4 flex items-center gap-2'>
                <Pill className='h-5 w-5 text-blue-600' />
                <h3 className='font-semibold text-gray-800'>Prescription</h3>
                <span className='ml-auto text-xs text-gray-600'>Code: {prescription.maToa}</span>
              </div>
              <div className='space-y-2'>
                {prescription.toaSanPhamList.map((medicine, index) => (
                  <div key={medicine.idSanPham} className='rounded-lg border border-blue-200 bg-white p-3'>
                    <div className='flex items-start justify-between'>
                      <div className='flex gap-3'>
                        <span className='flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700'>
                          {index + 1}
                        </span>
                        <div>
                          <p className='font-medium text-gray-900'>{medicine.tenSanPham}</p>
                          <p className='mt-1 text-sm text-gray-600'>
                            Quantity: {medicine.soLuong} • Unit price: {medicine.donGia.toLocaleString('vi-VN')}đ
                          </p>
                        </div>
                      </div>
                      <div className='text-right'>
                        <p className='font-semibold text-blue-600'>{medicine.thanhTien.toLocaleString('vi-VN')}đ</p>
                      </div>
                    </div>
                  </div>
                ))}
                <div className='mt-3 flex justify-between border-t border-blue-200 pt-3'>
                  <span className='font-semibold text-gray-800'>Total Amount:</span>
                  <span className='text-lg font-bold text-blue-600'>
                    {prescription.toaSanPhamList.reduce((sum, item) => sum + item.thanhTien, 0).toLocaleString('vi-VN')}
                    đ
                  </span>
                </div>
              </div>
            </div>
          ) : null}

          {/* Old Prescriptions fallback */}
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
