import { X, FileText, Calendar as CalendarIcon, Stethoscope } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { MedicalRecordFormData } from '~/types/medical.type';
import { useCreateMedicalRecord } from '~/hooks/useCreateMedicalRecord';
import { useAppContext } from '~/contexts';

interface NewMedicalRecordModalProps {
  isOpen: boolean;
  petId?: number;
  petName?: string;
  onClose: () => void;
}

const NewMedicalRecordModal = ({ isOpen, petId, petName, onClose }: NewMedicalRecordModalProps) => {
  const { profile } = useAppContext();
  const createMedicalRecordMutation = useCreateMedicalRecord();

  const [formData, setFormData] = useState<MedicalRecordFormData>({
    symptoms: '',
    diagnosis: '',
    nextAppointment: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (field: keyof MedicalRecordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!petId) {
      toast.error('Pet ID is missing');
      return;
    }

    if (!profile?.userId) {
      toast.error('Doctor information is missing');
      return;
    }

    // Validate using Zod schema
    const result = MedicalRecordFormData.safeParse(formData);

    if (!result.success) {
      const newErrors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) {
          newErrors[err.path[0] as string] = err.message;
        }
      });
      setErrors(newErrors);
      return;
    }

    try {
      // Call API to create medical record
      await createMedicalRecordMutation.mutateAsync({
        thoiGianKham: new Date().toISOString(),
        idThuCung: petId,
        trieuChung: result.data.symptoms,
        chuanDoan: result.data.diagnosis,
        ngayTaiKham: result.data.nextAppointment || new Date().toISOString().split('T')[0],
        idBacSi: profile.userId
      });

      toast.success('Medical record created successfully!');

      // Reset form and errors
      setFormData({
        symptoms: '',
        diagnosis: '',
        nextAppointment: ''
      });
      setErrors({});
      onClose();
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { message?: string } }; message?: string })?.response?.data?.message ||
        (error as { message?: string })?.message ||
        'Failed to create medical record';
      toast.error(errorMessage);
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/20 p-4' onClick={onClose}>
      <div
        className='flex max-h-[90vh] w-full max-w-3xl flex-col overflow-hidden rounded-xl bg-white shadow-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className='flex items-center justify-between border-b border-gray-200 bg-white px-6 py-4'>
          <div>
            <h2 className='text-2xl font-bold text-gray-900'>Create New Medical Record</h2>
            {petName && <p className='mt-1 text-sm text-gray-600'>Pet: {petName}</p>}
          </div>
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
            {/* Examination Information */}
            <div className='rounded-lg border border-gray-200 bg-orange-50 p-4'>
              <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
                <Stethoscope className='mr-2 h-5 w-5 text-orange-500' />
                Examination Information
              </h3>
              <div className='space-y-4'>
                {/* Symptoms */}
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Symptoms <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    value={formData.symptoms}
                    onChange={(e) => handleChange('symptoms', e.target.value)}
                    rows={4}
                    placeholder='Describe the symptoms the pet is experiencing...'
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                      errors.symptoms
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                    }`}
                  />
                  {errors.symptoms && <p className='mt-1 text-sm text-red-500'>{errors.symptoms}</p>}
                </div>

                {/* Diagnosis */}
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>
                    Diagnosis <span className='text-red-500'>*</span>
                  </label>
                  <textarea
                    value={formData.diagnosis}
                    onChange={(e) => handleChange('diagnosis', e.target.value)}
                    rows={4}
                    placeholder='Diagnosis results...'
                    className={`w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none ${
                      errors.diagnosis
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-300 focus:border-orange-500 focus:ring-orange-500/20'
                    }`}
                  />
                  {errors.diagnosis && <p className='mt-1 text-sm text-red-500'>{errors.diagnosis}</p>}
                </div>
              </div>
            </div>

            {/* Follow-up Information */}
            <div className='rounded-lg border border-gray-200 bg-green-50 p-4'>
              <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
                <CalendarIcon className='mr-2 h-5 w-5 text-green-500' />
                Follow-up Appointment
              </h3>
              <div className='space-y-4'>
                {/* Next Appointment */}
                <div>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Next Appointment Date</label>
                  <input
                    type='date'
                    value={formData.nextAppointment}
                    onChange={(e) => handleChange('nextAppointment', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
                  />
                  <p className='mt-1 text-xs text-gray-500'>Leave empty if no follow-up is needed</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className='border-t border-gray-200 bg-gray-50 px-6 py-4'>
          <div className='flex justify-end gap-3'>
            <button
              onClick={onClose}
              disabled={createMedicalRecordMutation.isPending}
              className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={createMedicalRecordMutation.isPending}
              className='flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-400'
            >
              <FileText className='h-4 w-4' />
              {createMedicalRecordMutation.isPending ? 'Saving...' : 'Save Medical Record'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewMedicalRecordModal;
