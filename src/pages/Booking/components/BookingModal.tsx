import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Stethoscope } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Appointment, BookingForm } from '~/types/booking.type';
import { BookingFormSchema } from '~/types/booking.type';
import { useBranchList } from '~/hooks/useBranchList';
import { useDoctorsAvailable } from '~/hooks/useDoctorsAvailable';
import { useCreateAppointment } from '~/hooks/useCreateAppointment';
import { useAppContext } from '~/contexts';
import type { Pet } from '~/types/pet.type';
import { usePetList } from '~/hooks/usePetManagement';

interface BookingModalProps {
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
  prefilledData?: {
    branchId?: number;
    doctorId?: number;
    date?: string;
    time?: string;
  };
}

const BookingModal = ({ onClose, onSuccess, prefilledData }: BookingModalProps) => {
  const { profile } = useAppContext();
  const { data: branches = [], isLoading: isLoadingBranches } = useBranchList();
  const { pets, isLoading: isLoadingPets } = usePetList({ pageNo: 1, pageSize: 100 });
  const createAppointmentMutation = useCreateAppointment();

  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<BookingForm>>({
    branch_id: prefilledData?.branchId || 0,
    pet_id: 0,
    doctor_id: prefilledData?.doctorId || 0,
    booking_date: prefilledData?.date || '',
    booking_time: prefilledData?.time || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({});

  // Fetch available doctors using the hook
  const { data: availableDoctors = [], isLoading: isLoadingDoctors } = useDoctorsAvailable({
    branchId: formData.branch_id || null,
    date: formData.booking_date || '',
    time: formData.booking_time || ''
  });

  // Update form when prefilled data changes
  useEffect(() => {
    if (prefilledData) {
      setFormData((prev) => ({
        ...prev,
        branch_id: prefilledData.branchId || prev.branch_id,
        doctor_id: prefilledData.doctorId || prev.doctor_id,
        booking_date: prefilledData.date || prev.booking_date,
        booking_time: prefilledData.time || prev.booking_time
      }));
    }
  }, [prefilledData]);

  // Generate time slots based on branch working hours
  useEffect(() => {
    if (formData.branch_id) {
      const branch = branches.find((b) => b.branch_id === formData.branch_id);
      if (branch) {
        const slots: string[] = [];
        const startHour = parseInt(branch.open_time.split(':')[0]);
        const endHour = parseInt(branch.close_time.split(':')[0]);
        for (let hour = startHour; hour < endHour; hour++) {
          slots.push(`${hour.toString().padStart(2, '0')}:00`);
          slots.push(`${hour.toString().padStart(2, '0')}:30`);
        }
        setTimeSlots(slots);
      }
    }
  }, [formData.branch_id, branches]);

  // No need for separate effect to fetch available doctors - handled by hook above

  // Show notification when no doctors are available
  useEffect(() => {
    if (formData.booking_date && formData.booking_time && formData.branch_id && !isLoadingDoctors) {
      if (availableDoctors.length === 0) {
        toast.warning('No doctors are available for the selected time. Please choose a different time slot.');
      }
    }
  }, [availableDoctors, isLoadingDoctors, formData.booking_date, formData.booking_time, formData.branch_id]);

  const handleInputChange = (field: keyof BookingForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const result = BookingFormSchema.safeParse({
      branch_id: formData.branch_id || 0,
      pet_id: formData.pet_id || 0,
      doctor_id: formData.doctor_id || 0,
      booking_date: formData.booking_date || '',
      booking_time: formData.booking_time || ''
    });

    if (!result.success) {
      const newErrors: Partial<Record<keyof BookingForm, string>> = {};
      result.error.errors.forEach((error) => {
        const field = error.path[0] as keyof BookingForm;
        newErrors[field] = error.message;
      });
      setErrors(newErrors);
      return false;
    }

    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Get related data
    const selectedBranch = branches.find((b) => b.branch_id === formData.branch_id);
    const selectedPet = pets.find((p: Pet) => p.pet_id === formData.pet_id);
    const selectedDoctor = availableDoctors.find((d) => d.employee_id === formData.doctor_id);

    if (!selectedBranch || !selectedPet || !selectedDoctor || !formData.booking_time) {
      return;
    }

    // Call API to create appointment
    try {
      await createAppointmentMutation.mutateAsync({
        idChiNhanh: formData.branch_id!,
        tenChiNhanh: selectedBranch.name,
        idKhachHang: profile!.idAccount,
        tenKhachHang: profile?.name || 'admin',
        idThuCung: formData.pet_id!,
        tenThuCung: selectedPet.name,
        ngayHen: formData.booking_date!,
        gioBatDau: formData.booking_time,
        idNhanVien: formData.doctor_id!,
        tenBacSi: selectedDoctor.name
      });

      // Create appointment object for UI update
      const newAppointment: Appointment = {
        appointment_id: Date.now(),
        doctor_id: formData.doctor_id!,
        pet_id: formData.pet_id!,
        customer_id: selectedPet.owner_id || 1,
        branch_id: formData.branch_id!,
        appointment_time: `${formData.booking_date}T${formData.booking_time}:00`,
        status: 'Processing',
        pet_name: selectedPet.name,
        doctor_name: selectedDoctor.name,
        branch_name: selectedBranch.name
      };

      // Show success toast
      toast.success('Appointment created successfully!');

      // Call onSuccess callback and close modal
      onSuccess(newAppointment);
      onClose();
    } catch (error: unknown) {
      console.error('Failed to create appointment:', error);

      // Show error toast with details
      const errorMessage =
        error?.response?.data?.message || error?.message || 'Failed to create appointment. Please try again.';
      toast.error(errorMessage);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
      <div className='relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-xl bg-white shadow-2xl'>
        {/* Header */}
        <div className='sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4'>
          <h2 className='text-2xl font-bold text-gray-900'>Đặt lịch khám</h2>
          <button
            onClick={onClose}
            className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
            aria-label='Đóng'
          >
            <X className='h-6 w-6' />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className='p-6'>
          <div className='space-y-6'>
            {/* Branch */}
            <div>
              <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                <MapPin className='h-4 w-4 text-orange-500' />
                Branch <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.branch_id || ''}
                onChange={(e) => handleInputChange('branch_id', Number(e.target.value))}
                disabled={isLoadingBranches}
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${
                  errors.branch_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>{isLoadingBranches ? 'Loading branches...' : 'Select Branch'}</option>
                {branches.map((branch) => (
                  <option key={branch.branch_id} value={branch.branch_id}>
                    {branch.name} - {branch.address}
                  </option>
                ))}
              </select>
              {errors.branch_id && <p className='mt-1 text-sm text-red-500'>{errors.branch_id}</p>}
            </div>

            {/* Pet */}
            <div>
              <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                <User className='h-4 w-4 text-orange-500' />
                Pet <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.pet_id || ''}
                onChange={(e) => handleInputChange('pet_id', Number(e.target.value))}
                disabled={isLoadingPets}
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${
                  errors.pet_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>{isLoadingPets ? 'Loading pets...' : 'Select Pet'}</option>
                {pets.map((pet: Pet) => (
                  <option key={pet.pet_id} value={pet.pet_id}>
                    {pet.name} - {pet.pet_code}
                  </option>
                ))}
              </select>
              {errors.pet_id && <p className='mt-1 text-sm text-red-500'>{errors.pet_id}</p>}
            </div>

            {/* Date and Time */}
            <div className='grid gap-4 sm:grid-cols-2'>
              {/* Date */}
              <div>
                <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                  <Calendar className='h-4 w-4 text-orange-500' />
                  Date <span className='text-red-500'>*</span>
                </label>
                <input
                  type='date'
                  min={today}
                  value={formData.booking_date || ''}
                  onChange={(e) => handleInputChange('booking_date', e.target.value)}
                  className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none ${
                    errors.booking_date ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.booking_date && <p className='mt-1 text-sm text-red-500'>{errors.booking_date}</p>}
              </div>

              {/* Time */}
              <div>
                <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                  <Clock className='h-4 w-4 text-orange-500' />
                  Time <span className='text-red-500'>*</span>
                </label>
                <select
                  value={formData.booking_time || ''}
                  onChange={(e) => handleInputChange('booking_time', e.target.value)}
                  disabled={!formData.branch_id}
                  className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${
                    errors.booking_time ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value={prefilledData?.time || 'Select time'}>{prefilledData?.time || 'Select time'}</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time + ':00'}
                    </option>
                  ))}
                </select>
                {errors.booking_time && <p className='mt-1 text-sm text-red-500'>{errors.booking_time}</p>}
              </div>
            </div>

            {/* Doctor */}
            <div>
              <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                <Stethoscope className='h-4 w-4 text-orange-500' />
                Doctor <span className='text-red-500'>*</span>
              </label>
              <select
                value={formData.doctor_id || ''}
                onChange={(e) => handleInputChange('doctor_id', Number(e.target.value))}
                disabled={isLoadingDoctors || availableDoctors.length === 0}
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${
                  errors.doctor_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>
                  {isLoadingDoctors
                    ? 'Loading doctors...'
                    : availableDoctors.length === 0
                      ? 'Please select branch, date and time first'
                      : 'Select Doctor'}
                </option>
                {availableDoctors.map((doctor) => (
                  <option key={doctor.employee_id} value={doctor.employee_id}>
                    {doctor.name}
                  </option>
                ))}
              </select>
              {errors.doctor_id && <p className='mt-1 text-sm text-red-500'>{errors.doctor_id}</p>}
              {availableDoctors.length > 0 && (
                <p className='mt-1 text-sm text-green-600'>
                  {availableDoctors.length} doctors are available for the selected time
                </p>
              )}
            </div>
          </div>

          {/* Error Message */}
          {createAppointmentMutation.isError && (
            <div className='mt-4 rounded-lg bg-red-50 p-4 text-sm text-red-700'>
              Failed to create appointment. Please try again.
            </div>
          )}

          {/* Actions */}
          <div className='mt-8 flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              disabled={createAppointmentMutation.isPending}
              className='flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={createAppointmentMutation.isPending}
              className='flex-1 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {createAppointmentMutation.isPending ? 'Creating...' : 'Book Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { BookingModal };
export default BookingModal;
