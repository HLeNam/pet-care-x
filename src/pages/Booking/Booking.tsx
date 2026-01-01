import { useState } from 'react';
import { Calendar, Clock, MapPin, User, Plus, PawPrint } from 'lucide-react';
import BookingModal from './components/BookingModal';
import type { Appointment } from '~/types/booking.type';

const Booking = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [appointments, setAppointments] = useState<Appointment[]>([
        // Mock data
        {
            idLichHen: 1,
            idNhanVien: 1,
            idThuCung: 1,
            idKhachHang: 1,
            idChiNhanh: 1,
            thoiGianHen: '2026-01-15T10:00:00',
            trangThai: 'Booked',
            tenThuCung: 'Milo',
            tenBacSi: 'BS. Nguyễn Văn A',
            tenChiNhanh: 'Chi nhánh Quận 1'
        }
    ]);

    const handleBookingSuccess = (newAppointment: Appointment) => {
        setAppointments([newAppointment, ...appointments]);
        setIsModalOpen(false);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Booked':
                return 'bg-green-100 text-green-800';
            case 'Processing':
                return 'bg-yellow-100 text-yellow-800';
            case 'Cancelled':
                return 'bg-red-100 text-red-800';
            case 'Completed':
                return 'bg-blue-100 text-blue-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const formatDateTime = (dateTimeStr: string) => {
        const date = new Date(dateTimeStr);
        const dateStr = date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
        const timeStr = date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit'
        });
        return { dateStr, timeStr };
    };

    return (
        <div className='min-h-screen bg-gray-50 py-8'>
            <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
                {/* Header */}
                <div className='mb-8 flex items-center justify-between'>
                    <div>
                        <h1 className='text-3xl font-bold text-gray-900'>Booking Appointment</h1>
                        <p className='mt-2 text-gray-600'>Manage appointment bookings for your pets</p>
                    </div>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className='flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-md transition-all hover:bg-orange-600 hover:shadow-lg'
                    >
                        <Plus className='h-5 w-5' />
                        Book New Appointment
                    </button>
                </div>

                {/* Appointments List */}
                <div className='space-y-4'>
                    {appointments.length === 0 ? (
                        <div className='rounded-lg bg-white p-12 text-center shadow'>
                            <div className='mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100'>
                                <Calendar className='h-8 w-8 text-gray-400' />
                            </div>
                            <h3 className='mb-2 text-lg font-semibold text-gray-900'>No Appointments</h3>
                            <p className='mb-6 text-gray-600'>You have no appointments yet. Please book an appointment for your pet</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className='inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white transition-all hover:bg-orange-600'
                            >
                                <Plus className='h-5 w-5' />
                                Book new appointment
                            </button>
                        </div>
                    ) : (
                        appointments.map((appointment) => {
                            const { dateStr, timeStr } = formatDateTime(appointment.thoiGianHen);
                            return (
                                <div
                                    key={appointment.idLichHen}
                                    className='rounded-lg bg-white p-6 shadow transition-shadow hover:shadow-md'
                                >
                                    <div className='flex items-start justify-between'>
                                        <div className='flex-1 space-y-3'>
                                            {/* Pet Name */}
                                            <div className='flex items-center gap-2'>
                                                <div className='rounded-full bg-orange-100 p-2'>
                                                    <PawPrint className='h-5 w-5 text-orange-600' />
                                                </div>
                                                <div>
                                                    <p className='text-sm text-gray-500'>Pet</p>
                                                    <p className='font-semibold text-gray-900'>{appointment.tenThuCung}</p>
                                                </div>
                                            </div>

                                            <div className='grid gap-4 sm:grid-cols-3'>
                                                {/* Date & Time */}
                                                <div className='flex items-center gap-2'>
                                                    <Calendar className='h-5 w-5 text-gray-400 ml-2 mr-1' />
                                                    <div>
                                                        <p className='text-sm text-gray-500'>Time</p>
                                                        <p className='font-medium text-gray-900'>{dateStr}</p>
                                                        <p className='flex items-center gap-1 text-sm text-gray-600'>
                                                            <Clock className='h-4 w-4' />
                                                            {timeStr}
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Doctor */}
                                                <div className='flex items-center gap-2'>
                                                    <User className='h-5 w-5 text-gray-400' />
                                                    <div>
                                                        <p className='text-sm text-gray-500'>Doctor</p>
                                                        <p className='font-medium text-gray-900'>{appointment.tenBacSi}</p>
                                                    </div>
                                                </div>

                                                {/* Branch */}
                                                <div className='flex items-center gap-2'>
                                                    <MapPin className='h-5 w-5 text-gray-400' />
                                                    <div>
                                                        <p className='text-sm text-gray-500'>Branch</p>
                                                        <p className='font-medium text-gray-900'>{appointment.tenChiNhanh}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Status Badge */}
                                        <span
                                            className={`ml-4 rounded-full px-3 py-1 text-sm font-medium ${getStatusColor(appointment.trangThai)}`}
                                        >
                                            {appointment.trangThai}
                                        </span>
                                    </div>
                                </div>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Booking Modal */}
            {isModalOpen && (
                <BookingModal onClose={() => setIsModalOpen(false)} onSuccess={handleBookingSuccess} />
            )}
        </div>
    );
};

export default Booking;
