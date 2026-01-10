import { AlertCircle, Calendar, Clock, DollarSign, FileText, Stethoscope, User, X } from "lucide-react";
import type { MedicalRecord } from "~/types/medical.type";

interface ModalProps {
    isOpen: boolean;
    onClose: () => void;
    record: MedicalRecord | null;
}

const MedicalDetailModal: React.FC<ModalProps> = ({ isOpen, onClose, record }) => {
    if (!isOpen || !record) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto hide-scrollbar bg-white rounded-2xl shadow-2xl">
                {/* Header */}
                <div className="sticky top-0 bg-linear-to-r from-lime-500 to-lime-600 text-white p-6 rounded-t-2xl">
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 p-2 hover:bg-gray-200 hover:bg-opacity-20 hover:cursor-pointer rounded-full transition"
                    >
                        <X size={24} />
                    </button>
                    <h2 className="text-2xl font-bold">Details</h2>
                    <p className="text-lime-100 mt-1">{record.petName}</p>
                </div>

                {/* Body */}
                <div className="p-6 space-y-6">
                    {/* Basic Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <Calendar className="text-lime-600 mt-1" size={20} />
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Date</p>
                                <p className="font-semibold text-gray-800">
                                    {new Date(record.date).toLocaleDateString('vi-VN', {
                                        weekday: 'long',
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric'
                                    })}
                                </p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <User className="text-lime-600 mt-1" size={20} />
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Doctor</p>
                                <p className="font-semibold text-gray-800">{record.doctor}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-lg">
                            <Stethoscope className="text-lime-600 mt-1" size={20} />
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Diagnosis</p>
                                <p className="font-semibold text-gray-800">{record.diagnosis}</p>
                            </div>
                        </div>

                        <div className="flex items-start gap-3 p-4 bg-lime-50 rounded-lg border border-lime-200">
                            <DollarSign className="text-lime-600 mt-1" size={20} />
                            <div>
                                <p className="text-xs text-gray-500 mb-1">Cost</p>
                                <p className="text-xl font-bold text-lime-600">
                                    {record.cost.toLocaleString('vi-VN')}đ
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Symptoms */}
                    {record.symptoms && (
                        <div className="border-l-4 border-orange-400 bg-orange-50 p-4 rounded-r-lg">
                            <div className="flex items-start gap-2 mb-2">
                                <AlertCircle className="text-orange-600 mt-1" size={18} />
                                <h3 className="font-semibold text-gray-800">Symptoms</h3>
                            </div>
                            <p className="text-gray-700 ml-6">{record.symptoms}</p>
                        </div>
                    )}

                    {/* Treatment */}
                    <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="flex items-start gap-2 mb-2">
                            <FileText className="text-blue-600 mt-1" size={18} />
                            <h3 className="font-semibold text-gray-800">Treatment Method</h3>
                        </div>
                        <p className="text-gray-700 ml-6">{record.treatment}</p>
                    </div>

                    {/* Prescriptions */}
                    {record.prescriptions && record.prescriptions.length > 0 && (
                        <div>
                            <h3 className="font-semibold text-gray-800 mb-3">Prescriptions</h3>
                            <ul className="space-y-2">
                                {record.prescriptions.map((prescription, index) => (
                                    <li key={index} className="flex items-start gap-2 p-3 bg-gray-50 rounded-lg">
                                        <span className="flex items-center justify-center w-6 h-6 bg-lime-100 text-lime-700 rounded-full text-xs font-semibold">
                                            {index + 1}
                                        </span>
                                        <span className="text-gray-700 flex-1">{prescription}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* Next Appointment */}
                    {record.nextAppointment && (
                        <div className="bg-linear-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
                            <div className="flex items-start gap-2">
                                <Clock className="text-purple-600 mt-1" size={18} />
                                <div>
                                    <h3 className="font-semibold text-gray-800 mb-1">Next Appointment</h3>
                                    <p className="text-gray-700">{record.nextAppointment}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Notes */}
                    {record.notes && (
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-gray-800 mb-2">Notes</h3>
                            <p className="text-gray-600 text-sm">{record.notes}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MedicalDetailModal;