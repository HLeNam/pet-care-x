import { X, FileText, Calendar as CalendarIcon, Stethoscope, Pill } from 'lucide-react';
import { useState } from 'react';
import type { MedicalRecordFormData } from '~/types/medical.type';

interface MedicalRecordModalProps {
    isOpen: boolean;
    petName?: string;
    onClose: () => void;
    onSave: (data: MedicalRecordFormData) => void;
}

const MedicalRecordModal = ({ isOpen, petName, onClose, onSave }: MedicalRecordModalProps) => {
    const [formData, setFormData] = useState<MedicalRecordFormData>({
        symptoms: '',
        diagnosis: '',
        treatment: '',
        prescriptions: '',
        nextAppointment: '',
        notes: ''
    });

    const handleChange = (field: keyof MedicalRecordFormData, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleSubmit = () => {
        // Validate required fields
        if (!formData.symptoms || !formData.diagnosis) {
            alert('Vui lòng nhập triệu chứng và chẩn đoán');
            return;
        }
        onSave(formData);
        // Reset form
        setFormData({
            symptoms: '',
            diagnosis: '',
            treatment: '',
            prescriptions: '',
            nextAppointment: '',
            notes: ''
        });
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
                        <h2 className='text-2xl font-bold text-gray-900'>Tạo Bệnh Án Mới</h2>
                        {petName && <p className='mt-1 text-sm text-gray-600'>Thú cưng: {petName}</p>}
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
                                Thông Tin Khám Bệnh
                            </h3>
                            <div className='space-y-4'>
                                {/* Symptoms */}
                                <div>
                                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                                        Triệu Chứng <span className='text-red-500'>*</span>
                                    </label>
                                    <textarea
                                        value={formData.symptoms}
                                        onChange={(e) => handleChange('symptoms', e.target.value)}
                                        rows={3}
                                        placeholder='Mô tả các triệu chứng mà thú cưng đang gặp phải...'
                                        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
                                    />
                                </div>

                                {/* Diagnosis */}
                                <div>
                                    <label className='mb-1 block text-sm font-medium text-gray-700'>
                                        Chẩn Đoán <span className='text-red-500'>*</span>
                                    </label>
                                    <textarea
                                        value={formData.diagnosis}
                                        onChange={(e) => handleChange('diagnosis', e.target.value)}
                                        rows={3}
                                        placeholder='Kết quả chẩn đoán bệnh...'
                                        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
                                    />
                                </div>

                                {/* Treatment */}
                                <div>
                                    <label className='mb-1 block text-sm font-medium text-gray-700'>Phương Pháp Điều Trị</label>
                                    <textarea
                                        value={formData.treatment}
                                        onChange={(e) => handleChange('treatment', e.target.value)}
                                        rows={3}
                                        placeholder='Các phương pháp điều trị được áp dụng...'
                                        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Prescription Information */}
                        <div className='rounded-lg border border-gray-200 bg-blue-50 p-4'>
                            <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
                                <Pill className='mr-2 h-5 w-5 text-blue-500' />
                                Đơn Thuốc
                            </h3>
                            <div className='space-y-4'>
                                {/* Prescriptions */}
                                <div>
                                    <label className='mb-1 block text-sm font-medium text-gray-700'>Danh Sách Thuốc</label>
                                    <textarea
                                        value={formData.prescriptions}
                                        onChange={(e) => handleChange('prescriptions', e.target.value)}
                                        rows={4}
                                        placeholder='Liệt kê các loại thuốc, liều lượng và cách dùng...'
                                        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Follow-up Information */}
                        <div className='rounded-lg border border-gray-200 bg-green-50 p-4'>
                            <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
                                <CalendarIcon className='mr-2 h-5 w-5 text-green-500' />
                                Tái Khám & Ghi Chú
                            </h3>
                            <div className='space-y-4'>
                                {/* Next Appointment */}
                                <div>
                                    <label className='mb-1 block text-sm font-medium text-gray-700'>Ngày Tái Khám</label>
                                    <input
                                        type='date'
                                        value={formData.nextAppointment}
                                        onChange={(e) => handleChange('nextAppointment', e.target.value)}
                                        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
                                    />
                                </div>

                                {/* Notes */}
                                <div>
                                    <label className='mb-1 block text-sm font-medium text-gray-700'>Ghi Chú Thêm</label>
                                    <textarea
                                        value={formData.notes}
                                        onChange={(e) => handleChange('notes', e.target.value)}
                                        rows={3}
                                        placeholder='Các ghi chú bổ sung cho bệnh án...'
                                        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
                                    />
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
                            className='rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
                        >
                            Hủy
                        </button>
                        <button
                            onClick={handleSubmit}
                            className='flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600'
                        >
                            <FileText className='h-4 w-4' />
                            Lưu Bệnh Án
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default MedicalRecordModal;
