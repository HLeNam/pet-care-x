import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Stethoscope } from 'lucide-react';
import type { Appointment, BookingForm } from '~/types/booking.type';
import type { Pet } from '~/types/pet.type';
import type { Employee } from '~/types/employee.type';
import type { Branch } from '~/types/branch.type';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appointment: Appointment) => void;
  prefilledData?: {
    branchId?: number;
    doctorId?: number;
    date?: string;
    time?: string;
  };
}

const BookingModal = ({ isOpen, onClose, onSuccess, prefilledData }: BookingModalProps) => {
  if (!isOpen) return null;

  // Mock data - Replace with actual API calls
  const [branches] = useState<Branch[]>([
    {
      branch_id: 1,
      branch_code: 'CN001',
      name: 'Chi nhánh Quận 1',
      address: '123 Nguyễn Huệ, Quận 1',
      phone: '0901234567',
      open_time: '08:00:00',
      close_time: '20:00:00'
    },
    {
      branch_id: 2,
      branch_code: 'CN002',
      name: 'Chi nhánh Quận 3',
      address: '456 Võ Văn Tần, Quận 3',
      phone: '0907654321',
      open_time: '08:00:00',
      close_time: '20:00:00'
    }
  ]);

  const [pets] = useState<Pet[]>([
    {
      pet_id: 1,
      pet_code: 'PET001',
      name: 'Milo',
      species: 'Chó',
      breed: 'Golden Retriever',
      owner_id: 1
    },
    {
      pet_id: 2,
      pet_code: 'PET002',
      name: 'Luna',
      species: 'Mèo',
      breed: 'Scottish Fold',
      owner_id: 1
    }
  ]);

  const [availableDoctors, setAvailableDoctors] = useState<Employee[]>([]);
  const [timeSlots, setTimeSlots] = useState<string[]>([]);

  const [formData, setFormData] = useState<Partial<BookingForm>>({
    branch_id: prefilledData?.branchId || 0,
    pet_id: 0,
    doctor_id: prefilledData?.doctorId || 0,
    booking_date: prefilledData?.date || '',
    booking_time: prefilledData?.time || ''
  });

  const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({});

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

  // Fetch available doctors when date, time, and branch are selected
  useEffect(() => {
    if (formData.branch_id && formData.booking_date && formData.booking_time) {
      // Mock available doctors
      const mockDoctors: Employee[] = [
        {
          employee_id: 1,
          employee_code: 'BS001',
          name: 'BS. Nguyễn Văn A',
          gender: 'Nam',
          position: 1,
          branch_id: formData.branch_id
        },
        {
          employee_id: 2,
          employee_code: 'BS002',
          name: 'BS. Trần Thị B',
          gender: 'Nữ',
          position: 1,
          branch_id: formData.branch_id
        }
      ];
      setAvailableDoctors(mockDoctors);
    } else {
      setAvailableDoctors([]);
    }
  }, [formData.branch_id, formData.booking_date, formData.booking_time]);

  const handleInputChange = (field: keyof BookingForm, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof BookingForm, string>> = {};

    if (!formData.branch_id) {
      newErrors.branch_id = 'Please select a branch';
    }
    if (!formData.pet_id) {
      newErrors.pet_id = 'Please select a pet';
    }
    if (!formData.booking_date) {
      newErrors.booking_date = 'Please select a date';
    }
    if (!formData.booking_time) {
      newErrors.booking_time = 'Please select a time';
    }
    if (!formData.doctor_id) {
      newErrors.doctor_id = 'Please select a doctor';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Create appointment
    const selectedBranch = branches.find((b) => b.branch_id === formData.branch_id);
    const selectedPet = pets.find((p) => p.pet_id === formData.pet_id);
    const selectedDoctor = availableDoctors.find((d) => d.employee_id === formData.doctor_id);

    const newAppointment: Appointment = {
      appointment_id: Date.now(), // Mock ID
      doctor_id: formData.doctor_id!,
      pet_id: formData.pet_id!,
      customer_id: 1, // Mock customer ID
      branch_id: formData.branch_id!,
      appointment_time: `${formData.booking_date}T${formData.booking_time}:00`,
      status: 'Processing',
      pet_name: selectedPet?.name,
      doctor_name: selectedDoctor?.name,
      branch_name: selectedBranch?.name
    };

    // Call API to save appointment

    onSuccess(newAppointment);
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
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none ${
                  errors.branch_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>Select Branch</option>
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
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none ${
                  errors.pet_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>Select Pet</option>
                {pets.map((pet) => (
                  <option key={pet.pet_id} value={pet.pet_id}>
                    {pet.name} - {pet.species} ({pet.breed})
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
                  <option value=''>Select time</option>
                  {timeSlots.map((time) => (
                    <option key={time} value={time}>
                      {time}
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
                disabled={availableDoctors.length === 0}
                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100 ${
                  errors.doctor_id ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value=''>
                  {availableDoctors.length === 0 ? 'Please select branch, date and time first' : 'Select Doctor'}
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

          {/* Actions */}
          <div className='mt-8 flex gap-3'>
            <button
              type='button'
              onClick={onClose}
              className='flex-1 rounded-lg border border-gray-300 px-6 py-3 font-semibold text-gray-700 transition-colors hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600'
            >
              Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export { BookingModal };
export default BookingModal;
