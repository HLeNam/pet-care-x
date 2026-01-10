import { useState, useEffect, useMemo } from 'react';
import { Calendar, Clock, User, MapPin, Search, ChevronRight } from 'lucide-react';
import BookingModal from '../Booking/components/BookingModal';
import { useBranchList } from '~/hooks/useBranchList';
import { useDoctorsByBranch } from '~/hooks/useDoctorsByBranch';
import { useDoctorSchedule } from '~/hooks/useDoctorSchedule';

interface TimeSlot {
  startTime: string;
  available: boolean;
}

interface DaySchedule {
  date: Date;
  dayName: string;
  slots: TimeSlot[];
}

const DoctorSchedule = () => {
  const { data: branches = [], isLoading: isLoadingBranches } = useBranchList();
  const [selectedBranch, setSelectedBranch] = useState<number | null>(null);
  const { data: doctors = [], isLoading: isLoadingDoctors } = useDoctorsByBranch(selectedBranch);
  const [selectedDoctor, setSelectedDoctor] = useState<number | null>(null);
  const { data: scheduleData = [], isLoading: isLoadingSchedule } = useDoctorSchedule({
    doctorId: selectedDoctor,
    branchId: selectedBranch
  });
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [quickBookingData, setQuickBookingData] = useState<{
    branchId: number;
    doctorId: number;
    date?: string;
    time?: string;
  } | null>(null);

  // Reset selected doctor when branch changes
  useEffect(() => {
    setSelectedDoctor(null);
  }, [selectedBranch]);

  // Transform schedule data when it changes
  const schedule: DaySchedule[] = useMemo(() => {
    if (!scheduleData || scheduleData.length === 0) return [];

    const transformedSchedule: DaySchedule[] = [];

    scheduleData.forEach((item) => {
      const date = new Date(item.date);

      transformedSchedule.push({
        date,
        dayName: date.toLocaleDateString('en-US', { weekday: 'long' }),
        slots: item.timeSlots.map((slot) => ({
          startTime: slot.gioBatDau,
          available: slot.available
        }))
      });
    });

    return transformedSchedule.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [scheduleData]);

  const getStatusColor = (status: TimeSlot['available']) =>
    status ? 'bg-green-50 text-green-700 border-green-200' : 'bg-red-50 text-red-700 border-red-200';

  const getStatusLabel = (status: TimeSlot['available']) => (status ? 'Available' : 'Booked');

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
    // Schedule will auto-refresh via react-query
  };

  const selectedBranchData = branches.find((b) => b.branch_id === selectedBranch);
  const selectedDoctorData = doctors.find((d) => d.employee_id === selectedDoctor);

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
              disabled={isLoadingBranches}
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
            >
              <option value=''>{isLoadingBranches ? 'Loading branches...' : 'Choose a branch...'}</option>
              {branches.map((branch) => (
                <option key={branch.branch_id} value={branch.branch_id}>
                  {branch.name}
                </option>
              ))}
            </select>
            {selectedBranchData && (
              <div className='mt-3 text-sm text-gray-600'>
                {selectedBranchData.address && <p>📍 {selectedBranchData.address}</p>}
                <p>
                  {selectedBranchData.open_time} - {selectedBranchData.close_time}
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
              disabled={!selectedBranch || isLoadingDoctors}
              className='w-full rounded-lg border border-gray-300 px-4 py-3 focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
            >
              <option value=''>
                {isLoadingDoctors
                  ? 'Loading doctors...'
                  : !selectedBranch
                    ? 'Select a branch first'
                    : 'Choose a doctor...'}
              </option>
              {doctors.map((doctor) => (
                <option key={doctor.employee_id} value={doctor.employee_id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            {selectedDoctorData && (
              <div className='mt-3 text-sm text-gray-600'>
                <p>{selectedDoctorData.name}</p>
                <p>Position: Doctor</p>
              </div>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoadingSchedule && (
          <div className='flex items-center justify-center py-12'>
            <div className='h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent'></div>
          </div>
        )}

        {/* Empty State */}
        {!selectedBranch && !isLoadingSchedule && (
          <div className='rounded-lg bg-white p-12 text-center shadow-sm'>
            <Search className='mx-auto h-16 w-16 text-gray-400' />
            <h3 className='mt-4 text-lg font-semibold text-gray-900'>Select a Branch to Start</h3>
            <p className='mt-2 text-gray-600'>Choose a branch and doctor to view their schedule</p>
          </div>
        )}

        {selectedBranch && !selectedDoctor && !isLoadingSchedule && (
          <div className='rounded-lg bg-white p-12 text-center shadow-sm'>
            <User className='mx-auto h-16 w-16 text-gray-400' />
            <h3 className='mt-4 text-lg font-semibold text-gray-900'>Select a Doctor</h3>
            <p className='mt-2 text-gray-600'>Choose a doctor to view their availability</p>
          </div>
        )}

        {/* Schedule Display */}
        {schedule.length > 0 && !isLoadingSchedule && (
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
                    <p className='text-gray-600'>Available: {day.slots.filter((s) => s.available).length} slots</p>
                  </div>
                </div>

                <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6'>
                  {day.slots.map((slot, slotIndex) => (
                    <div
                      key={slotIndex}
                      className={`group relative rounded-lg border-2 p-3 transition-all ${getStatusColor(slot.available)} ${slot.available ? 'cursor-pointer hover:border-orange-500 hover:shadow-md' : 'cursor-not-allowed'
                        }`}
                      onClick={() => {
                        if (slot.available) {
                          handleQuickBooking(day.date, slot.startTime);
                        }
                      }}
                    >
                      <div className='flex items-center justify-between'>
                        <div className='flex items-center gap-2'>
                          <Clock className='h-4 w-4' />
                          <span className='font-semibold'>{slot.startTime}</span>
                        </div>
                        {slot.available && (
                          <ChevronRight className='h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100' />
                        )}
                      </div>
                      <div className='mt-1 text-xs font-medium'>{getStatusLabel(slot.available)}</div>
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
          onClose={() => setShowBookingModal(false)}
          onSuccess={handleBookingSuccess}
          prefilledData={quickBookingData}
        />
      )}
    </div>
  );
};

export default DoctorSchedule;
