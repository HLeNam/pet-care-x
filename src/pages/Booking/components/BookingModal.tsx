import { useState, useEffect } from 'react';
import { X, Calendar, Clock, MapPin, User, Stethoscope } from 'lucide-react';
import type { Appointment, Branch, BookingForm } from '~/types/booking.type';
import type { Pet } from '~/types/pet.type';
import type { Doctor } from '~/types/doctor.type';

interface BookingModalProps {
    onClose: () => void;
    onSuccess: (appointment: Appointment) => void;
}

const BookingModal = ({ onClose, onSuccess }: BookingModalProps) => {
    // Mock data - Replace with actual API calls
    const [branches] = useState<Branch[]>([
        {
            idChiNhanh: 1,
            maChiNhanh: 'CN001',
            tenChiNhanh: 'Chi nhánh Quận 1',
            diaChi: '123 Nguyễn Huệ, Quận 1',
            soDienThoai: '0901234567',
            gioMoCua: '08:00:00',
            gioDongCua: '20:00:00'
        },
        {
            idChiNhanh: 2,
            maChiNhanh: 'CN002',
            tenChiNhanh: 'Chi nhánh Quận 3',
            diaChi: '456 Võ Văn Tần, Quận 3',
            soDienThoai: '0907654321',
            gioMoCua: '08:00:00',
            gioDongCua: '20:00:00'
        }
    ]);

    const [pets] = useState<Pet[]>([
        {
            idThuCung: 1,
            maThuCung: 'PET001',
            ten: 'Milo',
            loai: 'Chó',
            giong: 'Golden Retriever',
            chu: 1
        },
        {
            idThuCung: 2,
            maThuCung: 'PET002',
            ten: 'Luna',
            loai: 'Mèo',
            giong: 'Scottish Fold',
            chu: 1
        }
    ]);

    const [availableDoctors, setAvailableDoctors] = useState<Doctor[]>([]);
    const [timeSlots, setTimeSlots] = useState<string[]>([]);

    const [formData, setFormData] = useState<Partial<BookingForm>>({
        idChiNhanh: 0,
        idThuCung: 0,
        idNhanVien: 0,
        ngayKham: '',
        gioKham: ''
    });

    const [errors, setErrors] = useState<Partial<Record<keyof BookingForm, string>>>({});

    // Generate time slots based on branch working hours
    useEffect(() => {
        if (formData.idChiNhanh) {
            const branch = branches.find((b) => b.idChiNhanh === formData.idChiNhanh);
            if (branch) {
                const slots: string[] = [];
                const startHour = parseInt(branch.gioMoCua.split(':')[0]);
                const endHour = parseInt(branch.gioDongCua.split(':')[0]);

                for (let hour = startHour; hour < endHour; hour++) {
                    slots.push(`${hour.toString().padStart(2, '0')}:00`);
                    slots.push(`${hour.toString().padStart(2, '0')}:30`);
                }
                setTimeSlots(slots);
            }
        }
    }, [formData.idChiNhanh, branches]);

    // Fetch available doctors when date, time, and branch are selected
    useEffect(() => {
        if (formData.idChiNhanh && formData.ngayKham && formData.gioKham) {
            // Mock available doctors
            const mockDoctors: Doctor[] = [
                {
                    idNhanVien: 1,
                    maNhanVien: 'BS001',
                    hoTen: 'BS. Nguyễn Văn A',
                    gioiTinh: 'Nam',
                    chucVu: 1,
                    chiNhanh: formData.idChiNhanh
                },
                {
                    idNhanVien: 2,
                    maNhanVien: 'BS002',
                    hoTen: 'BS. Trần Thị B',
                    gioiTinh: 'Nữ',
                    chucVu: 1,
                    chiNhanh: formData.idChiNhanh
                }
            ];
            setAvailableDoctors(mockDoctors);
        } else {
            setAvailableDoctors([]);
        }
    }, [formData.idChiNhanh, formData.ngayKham, formData.gioKham]);

    const handleInputChange = (field: keyof BookingForm, value: string | number) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error for this field
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    const validateForm = (): boolean => {
        const newErrors: Partial<Record<keyof BookingForm, string>> = {};

        if (!formData.idChiNhanh) {
            newErrors.idChiNhanh = 'Please select a branch';
        }
        if (!formData.idThuCung) {
            newErrors.idThuCung = 'Please select a pet';
        }
        if (!formData.ngayKham) {
            newErrors.ngayKham = 'Please select a date';
        }
        if (!formData.gioKham) {
            newErrors.gioKham = 'Please select a time';
        }
        if (!formData.idNhanVien) {
            newErrors.idNhanVien = 'Please select a doctor';
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
        const selectedBranch = branches.find((b) => b.idChiNhanh === formData.idChiNhanh);
        const selectedPet = pets.find((p) => p.idThuCung === formData.idThuCung);
        const selectedDoctor = availableDoctors.find((d) => d.idNhanVien === formData.idNhanVien);

        const newAppointment: Appointment = {
            idLichHen: Date.now(), // Mock ID
            idNhanVien: formData.idNhanVien!,
            idThuCung: formData.idThuCung!,
            idKhachHang: 1, // Mock customer ID
            idChiNhanh: formData.idChiNhanh!,
            thoiGianHen: `${formData.ngayKham}T${formData.gioKham}:00`,
            trangThai: 'Chờ xác nhận',
            tenThuCung: selectedPet?.ten,
            tenBacSi: selectedDoctor?.hoTen,
            tenChiNhanh: selectedBranch?.tenChiNhanh
        };

        // Call API to save appointment

        onSuccess(newAppointment);
    };

    const today = new Date().toISOString().split('T')[0];

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-xl bg-white shadow-2xl'>
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
                                value={formData.idChiNhanh || ''}
                                onChange={(e) => handleInputChange('idChiNhanh', Number(e.target.value))}
                                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${errors.idChiNhanh ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value=''>Select Branch</option>
                                {branches.map((branch) => (
                                    <option key={branch.idChiNhanh} value={branch.idChiNhanh}>
                                        {branch.tenChiNhanh} - {branch.diaChi}
                                    </option>
                                ))}
                            </select>
                            {errors.idChiNhanh && <p className='mt-1 text-sm text-red-500'>{errors.idChiNhanh}</p>}
                        </div>

                        {/* Pet */}
                        <div>
                            <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                                <User className='h-4 w-4 text-orange-500' />
                                Pet <span className='text-red-500'>*</span>
                            </label>
                            <select
                                value={formData.idThuCung || ''}
                                onChange={(e) => handleInputChange('idThuCung', Number(e.target.value))}
                                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${errors.idThuCung ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value=''>Select Pet</option>
                                {pets.map((pet) => (
                                    <option key={pet.idThuCung} value={pet.idThuCung}>
                                        {pet.ten} - {pet.loai} ({pet.giong})
                                    </option>
                                ))}
                            </select>
                            {errors.idThuCung && <p className='mt-1 text-sm text-red-500'>{errors.idThuCung}</p>}
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
                                    value={formData.ngayKham || ''}
                                    onChange={(e) => handleInputChange('ngayKham', e.target.value)}
                                    className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 ${errors.ngayKham ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                />
                                {errors.ngayKham && <p className='mt-1 text-sm text-red-500'>{errors.ngayKham}</p>}
                            </div>

                            {/* Time */}
                            <div>
                                <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                                    <Clock className='h-4 w-4 text-orange-500' />
                                    Time <span className='text-red-500'>*</span>
                                </label>
                                <select
                                    value={formData.gioKham || ''}
                                    onChange={(e) => handleInputChange('gioKham', e.target.value)}
                                    disabled={!formData.idChiNhanh}
                                    className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.gioKham ? 'border-red-500' : 'border-gray-300'
                                        }`}
                                >
                                    <option value=''>Select time</option>
                                    {timeSlots.map((time) => (
                                        <option key={time} value={time}>
                                            {time}
                                        </option>
                                    ))}
                                </select>
                                {errors.gioKham && <p className='mt-1 text-sm text-red-500'>{errors.gioKham}</p>}
                            </div>
                        </div>

                        {/* Doctor */}
                        <div>
                            <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                                <Stethoscope className='h-4 w-4 text-orange-500' />
                                Doctor <span className='text-red-500'>*</span>
                            </label>
                            <select
                                value={formData.idNhanVien || ''}
                                onChange={(e) => handleInputChange('idNhanVien', Number(e.target.value))}
                                disabled={availableDoctors.length === 0}
                                className={`w-full rounded-lg border px-4 py-3 transition-colors focus:border-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 disabled:bg-gray-100 disabled:cursor-not-allowed ${errors.idNhanVien ? 'border-red-500' : 'border-gray-300'
                                    }`}
                            >
                                <option value=''>
                                    {availableDoctors.length === 0
                                        ? 'Please select branch, date and time first'
                                        : 'Select Doctor'}
                                </option>
                                {availableDoctors.map((doctor) => (
                                    <option key={doctor.idNhanVien} value={doctor.idNhanVien}>
                                        {doctor.hoTen}
                                    </option>
                                ))}
                            </select>
                            {errors.idNhanVien && <p className='mt-1 text-sm text-red-500'>{errors.idNhanVien}</p>}
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

export default BookingModal;
