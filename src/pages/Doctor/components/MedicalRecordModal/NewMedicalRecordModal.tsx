import { X, FileText, Calendar as CalendarIcon, Stethoscope, Pill, Plus, Trash2, Search } from 'lucide-react';
import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { MedicalRecordFormData, type PrescriptionItem } from '~/types/medical.type';
import { useCreateMedicalRecord } from '~/hooks/useCreateMedicalRecord';
import { useAppContext } from '~/contexts';
import { useSearchMedicines } from '~/hooks/useProduct';

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

  // Prescription states
  const [prescriptions, setPrescriptions] = useState<PrescriptionItem[]>([]);
  const [searchKeyword, setSearchKeyword] = useState('');
  const [selectedMedicine, setSelectedMedicine] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Search medicines
  const { medicines, isLoading: isSearching } = useSearchMedicines({
    keyword: searchKeyword,
    pageNo: 0,
    pageSize: 10,
    enabled: searchKeyword.length > 0
  });

  // Hide search results when clicking outside
  useEffect(() => {
    const handleClickOutside = () => setShowSearchResults(false);
    if (showSearchResults) {
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [showSearchResults]);

  const handleChange = (field: keyof MedicalRecordFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  const handleSearchChange = (value: string) => {
    setSearchKeyword(value);
    setShowSearchResults(value.length > 0);
  };

  const handleSelectMedicine = (medicine: (typeof medicines)[number]) => {
    setSelectedMedicine(medicine.tenSanPham);
    setSearchKeyword(medicine.tenSanPham);
    setShowSearchResults(false);
  };

  const handleAddPrescription = () => {
    const medicine = medicines.find((m) => m.tenSanPham === selectedMedicine);
    if (!medicine) {
      toast.error('Please select a medicine from the search results');
      return;
    }

    if (quantity < 1) {
      toast.error('Quantity must be at least 1');
      return;
    }

    // Check if medicine already exists in prescriptions
    const existingIndex = prescriptions.findIndex((p) => p.idSanPham === medicine.idSanPham);
    if (existingIndex !== -1) {
      // Update quantity
      const updated = [...prescriptions];
      updated[existingIndex].soLuong += quantity;
      setPrescriptions(updated);
      //   toast.success('Updated medicine quantity');
    } else {
      // Add new
      setPrescriptions([
        ...prescriptions,
        {
          idSanPham: medicine.idSanPham,
          maSanPham: medicine.maSanPham,
          tenSanPham: medicine.tenSanPham,
          giaBan: medicine.giaBan,
          soLuong: quantity
        }
      ]);
      //   toast.success('Added medicine to prescription');
    }

    // Reset
    setSearchKeyword('');
    setSelectedMedicine('');
    setQuantity(1);
  };

  const handleRemovePrescription = (idSanPham: number) => {
    setPrescriptions(prescriptions.filter((p) => p.idSanPham !== idSanPham));
    // toast.success('Removed medicine from prescription');
  };

  const handleUpdateQuantity = (idSanPham: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    setPrescriptions(prescriptions.map((p) => (p.idSanPham === idSanPham ? { ...p, soLuong: newQuantity } : p)));
  };

  const handleSubmit = async () => {
    // Validate required fields
    if (!petId) {
      toast.error('Pet ID is missing');
      return;
    }

    if (!profile?.idAccount) {
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
        idBacSi: profile.idAccount
      });

      toast.success('Medical record created successfully!');

      // Log prescriptions for future API integration
      if (prescriptions.length > 0) {
        console.log('Prescriptions to be saved:', prescriptions);
        // TODO: Call API to save prescriptions when endpoint is available
      }

      // Reset form and errors
      setFormData({
        symptoms: '',
        diagnosis: '',
        nextAppointment: ''
      });
      setErrors({});
      setPrescriptions([]);
      setSearchKeyword('');
      setSelectedMedicine('');
      setQuantity(1);
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

            {/* Prescription Section */}
            <div className='rounded-lg border border-gray-200 bg-blue-50 p-4'>
              <h3 className='mb-4 flex items-center text-lg font-semibold text-gray-900'>
                <Pill className='mr-2 h-5 w-5 text-blue-500' />
                Prescription
              </h3>
              <div className='space-y-4'>
                {/* Medicine Search */}
                <div className='relative'>
                  <label className='mb-1 block text-sm font-medium text-gray-700'>Search Medicine</label>
                  <div className='relative'>
                    <input
                      type='text'
                      value={searchKeyword}
                      onChange={(e) => handleSearchChange(e.target.value)}
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowSearchResults(searchKeyword.length > 0);
                      }}
                      placeholder='Type medicine name...'
                      className='w-full rounded-lg border border-gray-300 px-3 py-2 pr-10 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
                    />
                    <Search className='absolute top-1/2 right-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                  </div>

                  {/* Search Results Dropdown */}
                  {showSearchResults && searchKeyword.length > 0 && (
                    <div
                      className='absolute z-10 mt-1 max-h-60 w-full overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-lg'
                      onClick={(e) => e.stopPropagation()}
                    >
                      {isSearching ? (
                        <div className='p-4 text-center text-sm text-gray-500'>Searching...</div>
                      ) : medicines.length > 0 ? (
                        medicines.map((medicine) => (
                          <button
                            key={medicine.idSanPham}
                            onClick={() => handleSelectMedicine(medicine)}
                            className='w-full cursor-pointer border-b border-gray-100 px-4 py-3 text-left transition-colors last:border-b-0 hover:bg-blue-50'
                          >
                            <div className='font-medium text-gray-900'>{medicine.tenSanPham}</div>
                            <div className='mt-1 flex items-center justify-between text-xs text-gray-600'>
                              <span>Code: {medicine.maSanPham}</span>
                              <span className='font-semibold text-blue-600'>
                                {parseFloat(medicine.giaBan).toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </button>
                        ))
                      ) : (
                        <div className='p-4 text-center text-sm text-gray-500'>No medicines found</div>
                      )}
                    </div>
                  )}
                </div>

                {/* Quantity Input */}
                {selectedMedicine && (
                  <div className='flex gap-3'>
                    <div className='flex-1'>
                      <label className='mb-1 block text-sm font-medium text-gray-700'>Quantity</label>
                      <input
                        type='number'
                        min='1'
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        className='w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 focus:outline-none'
                      />
                    </div>
                    <div className='flex items-end'>
                      <button
                        onClick={handleAddPrescription}
                        className='flex cursor-pointer items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-blue-600'
                      >
                        <Plus className='h-4 w-4' />
                        Add
                      </button>
                    </div>
                  </div>
                )}

                {/* Selected Prescriptions List */}
                {prescriptions.length > 0 && (
                  <div className='mt-4 rounded-lg border border-blue-200 bg-white p-3'>
                    <h4 className='mb-2 text-sm font-semibold text-gray-700'>Selected Medicines</h4>
                    <div className='space-y-2'>
                      {prescriptions.map((prescription) => (
                        <div
                          key={prescription.idSanPham}
                          className='flex items-center justify-between rounded-lg border border-gray-200 bg-gray-50 p-3'
                        >
                          <div className='flex-1'>
                            <div className='font-medium text-gray-900'>{prescription.tenSanPham}</div>
                            <div className='mt-1 text-xs text-gray-600'>
                              {parseFloat(prescription.giaBan).toLocaleString('vi-VN')}đ × {prescription.soLuong} ={' '}
                              <span className='font-semibold text-blue-600'>
                                {(parseFloat(prescription.giaBan) * prescription.soLuong).toLocaleString('vi-VN')}đ
                              </span>
                            </div>
                          </div>
                          <div className='flex items-center gap-2'>
                            <input
                              type='number'
                              min='1'
                              value={prescription.soLuong}
                              onChange={(e) =>
                                handleUpdateQuantity(prescription.idSanPham, parseInt(e.target.value) || 1)
                              }
                              className='w-16 rounded border border-gray-300 px-2 py-1 text-center text-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500/20 focus:outline-none'
                            />
                            <button
                              onClick={() => handleRemovePrescription(prescription.idSanPham)}
                              className='cursor-pointer rounded p-1.5 text-red-600 transition-colors hover:bg-red-50'
                            >
                              <Trash2 className='h-4 w-4' />
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className='mt-3 flex justify-between border-t border-gray-200 pt-2 text-sm font-semibold'>
                        <span>Total:</span>
                        <span className='text-blue-600'>
                          {prescriptions
                            .reduce((sum, p) => sum + parseFloat(p.giaBan) * p.soLuong, 0)
                            .toLocaleString('vi-VN')}
                          đ
                        </span>
                      </div>
                    </div>
                  </div>
                )}
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
