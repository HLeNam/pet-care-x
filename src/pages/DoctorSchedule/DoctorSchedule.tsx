import { useState, useEffect } from 'react';
import { Calendar, Clock, User, MapPin, Search, ChevronRight } from 'lucide-react';
import BookingModal from '../Booking/components/BookingModal';

interface Branch {
  id: number;
  name: string;
  address: string;
  openTime: string;
  closeTime: string;
}

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: number;
}

interface TimeSlot {
  time: string;
  status: 'available' | 'booked' | 'break';
  appointmentInfo?: string;
}

interface DaySchedule {
  date: Date;
  dayName: string;
  slots: TimeSlot[];
}

const DoctorSchedule = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const [schedule, setSchedule] = useState<DaySchedule[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [quickBookingData, setQuickBookingData] = useState<{
    branchId: number;
    doctorId: number;
    date?: string;
    time?: string;
  } | null>(null);

  // Fetch branches on mount
  useEffect(() => {
    fetchBranches();
  }, []);

  // Fetch doctors when branch changes
  useEffect(() => {
    if (selectedBranch) {
      fetchDoctors(selectedBranch);
      setSelectedDoctor(null);
      setSchedule([]);
    }
  }, [selectedBranch]);

  // Fetch schedule when doctor changes
  useEffect(() => {
    if (selectedDoctor && selectedBranch) {
      fetchDoctorSchedule(selectedDoctor, selectedBranch);
    }
  }, [selectedDoctor, selectedBranch]);

  const fetchBranches = async () => {
    try {
      // Mock data - replace with actual API call
      const mockBranches: Branch[] = [
        {
          id: 1,
          name: 'PetCareX - District 1',
          address: '123 Nguyen Hue, District 1',
          openTime: '08:00',
          closeTime: '18:00'
        },
        {
          id: 2,
          name: 'PetCareX - District 3',
          address: '456 Le Van Sy, District 3',
          openTime: '08:00',
          closeTime: '18:00'
        },
        {
          id: 3,
          name: 'PetCareX - Thu Duc',
          address: '789 Vo Van Ngan, Thu Duc',
          openTime: '07:30',
          closeTime: '19:00'
        }
      ];
      setBranches(mockBranches);
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchDoctors = async (_branchId: number) => {
    try {
      setIsLoading(true);
      // Mock data - replace with actual API call
      const mockDoctors: Doctor[] = [
        { id: 1, name: 'Dr. Nguyen Van A', specialization: 'General Veterinarian', experience: 5 },
        { id: 2, name: 'Dr. Tran Thi B', specialization: 'Surgery Specialist', experience: 8 },
        { id: 3, name: 'Dr. Le Van C', specialization: 'Dental Care', experience: 3 }
      ];
      setDoctors(mockDoctors);
    } catch (error) {
      console.error('Error fetching doctors:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchDoctorSchedule = async (_doctorId: number, branchId: number) => {
    try {
      setIsLoading(true);
      const branch = branches.find((b) => b.id === branchId);
      if (!branch) return;

      // Generate 7 days schedule
      const scheduleData: DaySchedule[] = [];
      for (let i = 0; i < 7; i++) {
        const date = new Date();
        date.setDate(date.getDate() + i);

        const slots = generateTimeSlots(branch.openTime, branch.closeTime, i);
        scheduleData.push({
          date,
          dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
          slots
        });
      }

      setSchedule(scheduleData);
    } catch (error) {
      console.error('Error fetching schedule:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateTimeSlots = (openTime: string, closeTime: string, dayOffset: number): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    const [openHour] = openTime.split(':').map(Number);
    const [closeHour] = closeTime.split(':').map(Number);

    // Mock: Generate random status for demo
    for (let hour = openHour; hour < closeHour; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        
        // Random status for demonstration
        const random = Math.random();
        let status: TimeSlot['status'];
        let appointmentInfo: string | undefined;

        if (hour === 12) {
          status = 'break';
        } else if (random < 0.3 && dayOffset < 3) {
          status = 'booked';
          appointmentInfo = `Patient: Dog - Max`;
        } else {
          status = 'available';
        }

        slots.push({ time, status, appointmentInfo });
      }
    }

    return slots;
  };

  const getStatusColor = (status: TimeSlot['status']) => {
    switch (status) {
      case 'available':
        return 'bg-green-50 text-green-700 border-green-200';
      case 'booked':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'break':
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const getStatusLabel = (status: TimeSlot['status']) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'booked':
        return 'Booked';
      case 'break':
        return 'Break Time';
    }
  };

  const handleQuickBooking = (date: Date, time: string) => {
    if (!selectedBranch || !selectedDoctor) return;

    setQuickBookingData({
      branchId: selectedBranch,
      doctorId: selectedDoctor,
      date: date.toISOString().split('T')[0],
      time
    });
    setShowBookingModal(true);
  };

  const handleBookingSuccess = () => {
    setShowBookingModal(false);
    // Refresh schedule
    if (selectedDoctor && selectedBranch) {
      fetchDoctorSchedule(selectedDoctor, selectedBranch);
    }
  };

  const selectedBranchData = branches.find((b) => b.id === selectedBranch);
  const selectedDoctorData = doctors.find((d) => d.id === selectedDoctor);

  return (
    <div className='min-h-screen bg-gray-50 py-8'>
      <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900'>Doctor Schedule</h1>
          <p className='mt-2 text-gray-600'>View doctor availability and book appointments</p>
        </div>

        {/* Filters */}
        <div className='mb-8 grid gap-6 lg:grid-cols-2'>
          {/* Branch Selection */}
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <label className='mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700'>
              <MapPin className='h-5 w-5 text-orange-500' />
              Select Branch
            </label>
            <select
              value={selectedBranch || ''}
              onChange={(e) => setSelectedBranch(Number(e.target.value))}
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20'
            >
              <option value=''>Choose a branch...</option>
              {branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {selectedBranchData && (
              <div className='mt-3 text-sm text-gray-600'>
                <p>📍 {selectedBranchData.address}</p>
                <p>
                  🕒 {selectedBranchData.openTime} - {selectedBranchData.closeTime}
                </p>
              </div>
            )}
          </div>

          {/* Doctor Selection */}
          <div className='rounded-lg bg-white p-6 shadow-sm'>
            <label className='mb-3 flex items-center gap-2 text-sm font-semibold text-gray-700'>
              <User className='h-5 w-5 text-orange-500' />
              Select Doctor
            </label>
            <select
              value={selectedDoctor || ''}
              onChange={(e) => setSelectedDoctor(Number(e.target.value))}
              disabled={!selectedBranch}
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:cursor-not-allowed disabled:bg-gray-100'
            >
              <option value=''>Choose a doctor...</option>
              {doctors.map((doctor) => (
                <option key={doctor.id} value={doctor.id}>
                  {doctor.name} - {doctor.specialization}
                </option>
              ))}
            </select>
            {selectedDoctorData && (
              <div className='mt-3 text-sm text-gray-600'>
                <p>🎓 {selectedDoctorData.specialization}</p>
                <p>💼 {selectedDoctorData.experience} years of experience</p>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className='flex items-center justify-center py-12'>
            <div className='h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent'></div>
          </div>
        )}

        {/* Empty State */}
        {!selectedBranch && !isLoading && (
          <div className='rounded-lg bg-white p-12 text-center shadow-sm'>
            <Search className='mx-auto h-16 w-16 text-gray-400' />
            <h3 className='mt-4 text-lg font-semibold text-gray-900'>Select a Branch to Start</h3>
            <p className='mt-2 text-gray-600'>Choose a branch and doctor to view their schedule</p>
          </div>
        )}

        {selectedBranch && !selectedDoctor && !isLoading && (
          <div className='rounded-lg bg-white p-12 text-center shadow-sm'>
            <User className='mx-auto h-16 w-16 text-gray-400' />
            <h3 className='mt-4 text-lg font-semibold text-gray-900'>Select a Doctor</h3>
            <p className='mt-2 text-gray-600'>Choose a doctor to view their availability</p>
          </div>
        )}

        {/* Schedule Display */}
        {schedule.length > 0 && !isLoading && (
          <div className='space-y-6'>
            <div className='flex items-center justify-between rounded-lg bg-white p-4 shadow-sm'>
              <div className='flex items-center gap-2'>
                <Calendar className='h-5 w-5 text-orange-500' />
                <span className='font-semibold text-gray-900'>7-Day Schedule</span>
              </div>
              <div className='flex gap-4 text-sm'>
                <span className='flex items-center gap-2'>
                  <span className='h-3 w-3 rounded-full bg-green-500'></span> Available
                </span>
                <span className='flex items-center gap-2'>
                  <span className='h-3 w-3 rounded-full bg-red-500'></span> Booked
                </span>
                <span className='flex items-center gap-2'>
                  <span className='h-3 w-3 rounded-full bg-gray-500'></span> Break
                </span>
              </div>
            </div>

            {schedule.map((day, dayIndex) => (
              <div key={dayIndex} className='rounded-lg bg-white p-6 shadow-sm'>
                <div className='mb-4 flex items-center justify-between border-b pb-3'>
                  <div>
                    <h3 className='text-lg font-semibold text-gray-900'>{day.dayName}</h3>
                    <p className='text-sm text-gray-600'>
                      {day.date.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </p>
                  </div>
                  <div className='text-right text-sm'>
                    <p className='text-gray-600'>
                      Available: {day.slots.filter((s) => s.status === 'available').length} slots
                    </p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
                  {day.slots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className={`group relative rounded-lg border-2 p-3 transition-all ${getStatusColor(slot.status)} ${
                        slot.status === 'available'
                          ? 'cursor-pointer hover:border-orange-500 hover:shadow-md'
                          : 'cursor-not-allowed'
                      }`}
                      onClick={() => {
                        if (slot.status === 'available') {
                          handleQuickBooking(day.date, slot.time);
                        }
                      }}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Clock className='h-4 w-4' />
                          <span className='font-semibold'>{slot.time}</span>
                        </div>
                        {slot.status === 'available' && (
                          <ChevronRight className='h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100' />
                        )}
                      </div>
                      <div className='mt-1 text-xs font-medium'>{getStatusLabel(slot.status)}</div>
                      {slot.appointmentInfo && (
                        <div className='mt-1 truncate text-xs'>{slot.appointmentInfo}</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Booking Modal */}
      {showBookingModal && quickBookingData && (
        <BookingModal
          isOpen={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
          prefilledData={quickBookingData}
        />
      )}
    </div>
  );
};

export default DoctorSchedule;
