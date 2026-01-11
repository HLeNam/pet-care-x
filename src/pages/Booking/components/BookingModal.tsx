import { useState, useEffect, useMemo } from 'react';
import { X, Calendar, Clock, MapPin, User, Stethoscope } from 'lucide-react';
import { toast } from 'react-toastify';
import type { Appointment, BookingForm } from '~/types/booking.type';
import { BookingFormSchema } from '~/types/booking.type';
import { useBranchListInfinite } from '~/hooks/useBranchListInfinite';
import { useDoctorsAvailableInfinite } from '~/hooks/useDoctorsAvailableInfinite';
import { useCreateAppointment } from '~/hooks/useCreateAppointment';
import { useAppContext } from '~/contexts';
import type { Pet } from '~/types/pet.type';
import { usePetListInfinite } from '~/hooks/usePetListInfinite';
import { InfiniteSelect } from '~/components/InfiniteSelect';
import { DoctorSelect } from '~/components/DoctorSelect';

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
  const createAppointmentMutation = useCreateAppointment();

  // State declarations - must be before hooks that use them
  const [timeSlots, setTimeSlots] = useState<string[]>([]);
  const [formData, setFormData] = useState<Partial<BookingForm>>({
    branch_id: prefilledData?.branchId || 0,
    pet_id: 0,
    doctor_id: prefilledData?.doctorId || 0,
    booking_date: prefilledData?.date || '',
    booking_time: prefilledData?.time || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({});
  const [branchSearchQuery, setBranchSearchQuery] = useState('');
  const [petSearchQuery, setPetSearchQuery] = useState('');
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');

  // Infinite hooks
  const {
    data: branchesData,
    isLoading: isLoadingBranches,
    isFetchingNextPage: isFetchingNextBranches,
    hasNextPage: hasNextBranches,
    fetchNextPage: fetchNextBranches
  } = useBranchListInfinite({ pageSize: 20 });

  const {
    data: petsData,
    isLoading: isLoadingPets,
    isFetchingNextPage: isFetchingNextPets,
    hasNextPage: hasNextPets,
    fetchNextPage: fetchNextPets
  } = usePetListInfinite({ pageSize: 20 });

  const {
    data: doctorsData,
    isLoading: isLoadingDoctors,
    isFetchingNextPage: isFetchingNextDoctors,
    hasNextPage: hasNextDoctors,
    fetchNextPage: fetchNextDoctors
  } = useDoctorsAvailableInfinite({
    branchId: formData.branch_id || null,
    date: formData.booking_date || '',
    time: formData.booking_time || '',
    pageSize: 20
  });

  // Flatten data from pages
  const branches = useMemo(() => {
    if (!branchesData?.pages) return [];
    return branchesData.pages.flatMap((page) => page.items);
  }, [branchesData]);

  const pets = useMemo(() => {
    if (!petsData?.pages) return [];
    return petsData.pages.flatMap((page) => page.items);
  }, [petsData]);

  const availableDoctors = useMemo(() => {
    if (!doctorsData?.pages) return [];
    return doctorsData.pages.flatMap((page) => page.items);
  }, [doctorsData]);

  const totalBranches = branchesData?.pages[0]?.totalItems || 0;
  const totalPets = petsData?.pages[0]?.totalItems || 0;
  const totalDoctors = doctorsData?.pages[0]?.totalItems || 0;

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
        idKhachHang: profile!.userId,
        tenKhachHang: profile?.name || 'admin',
        idThuCung: formData.pet_id!,
        tenThuCung: selectedPet.name,
        ngayHen: formData.booking_date!,
        gioBatDau: formData.booking_time + ':00',
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
              <InfiniteSelect
                value={formData.branch_id ? String(formData.branch_id) : ''}
                onChange={(value) => handleInputChange('branch_id', Number(value))}
                items={branches.map((branch) => ({
                  id: branch.branch_id,
                  label: branch.name,
                  subLabel: branch.branch_code
                }))}
                isLoading={isLoadingBranches}
                isFetchingNextPage={isFetchingNextBranches}
                hasNextPage={hasNextBranches ?? false}
                onLoadMore={() => fetchNextBranches()}
                disabled={isLoadingBranches}
                placeholder='Select Branch'
                totalCount={totalBranches}
                searchQuery={branchSearchQuery}
                onSearchChange={setBranchSearchQuery}
                emptyMessage='No branches available'
                loadingMessage='Loading branches...'
                getSearchText={(item) => item.label}
              />
              {errors.branch_id && <p className='mt-1 text-sm text-red-500'>{errors.branch_id}</p>}
            </div>

            {/* Pet */}
            <div>
              <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                <User className='h-4 w-4 text-orange-500' />
                Pet <span className='text-red-500'>*</span>
              </label>
              <InfiniteSelect
                value={formData.pet_id ? String(formData.pet_id) : ''}
                onChange={(value) => handleInputChange('pet_id', Number(value))}
                items={pets.map((pet) => ({
                  id: pet.pet_id,
                  label: pet.name,
                  subLabel: pet.pet_code
                }))}
                isLoading={isLoadingPets}
                isFetchingNextPage={isFetchingNextPets}
                hasNextPage={hasNextPets ?? false}
                onLoadMore={() => fetchNextPets()}
                disabled={isLoadingPets}
                placeholder='Select Pet'
                totalCount={totalPets}
                searchQuery={petSearchQuery}
                onSearchChange={setPetSearchQuery}
                emptyMessage='No pets available'
                loadingMessage='Loading pets...'
                getSearchText={(item) => item.label}
              />
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
              <DoctorSelect
                value={formData.doctor_id ? String(formData.doctor_id) : ''}
                onChange={(value) => handleInputChange('doctor_id', Number(value))}
                doctors={availableDoctors}
                isLoading={isLoadingDoctors}
                isFetchingNextPage={isFetchingNextDoctors}
                hasNextPage={hasNextDoctors ?? false}
                onLoadMore={() => fetchNextDoctors()}
                disabled={!formData.branch_id || !formData.booking_date || !formData.booking_time}
                totalCount={totalDoctors}
                searchQuery={doctorSearchQuery}
                onSearchChange={setDoctorSearchQuery}
              />
              {errors.doctor_id && <p className='mt-1 text-sm text-red-500'>{errors.doctor_id}</p>}
              {!isLoadingDoctors && availableDoctors.length > 0 && (
                <p className='mt-1 text-sm text-green-600'>
                  {totalDoctors} doctors are available for the selected time
                </p>
              )}
              {!isLoadingDoctors &&
                formData.branch_id &&
                formData.booking_date &&
                formData.booking_time &&
                availableDoctors.length === 0 && (
                  <p className='mt-1 text-sm text-red-600'>No doctors available at this time</p>
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
