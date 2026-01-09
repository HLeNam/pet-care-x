import { useState, useEffect } from 'react';
import { CheckCircle, Search } from 'lucide-react';
import type { Branch } from '~/types/branch.type';
import type { Pet } from '~/types/pet.type';
import type { Employee } from '~/types/employee.type';

// Mock data
const mockBranches: Branch[] = [
  {
    branch_id: 1,
    branch_code: 'BR001',
    name: 'Chi nhánh Quận 1',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    phone: '028 1234 5678',
    open_time: '08:00',
    close_time: '20:00'
  },
  {
    branch_id: 2,
    branch_code: 'BR002',
    name: 'Chi nhánh Quận 7',
    address: '456 Nguyễn Thị Thập, Quận 7, TP.HCM',
    phone: '028 9876 5432',
    open_time: '08:00',
    close_time: '20:00'
  },
  {
    branch_id: 3,
    branch_code: 'BR003',
    name: 'Chi nhánh Thủ Đức',
    address: '789 Võ Văn Ngân, TP. Thủ Đức, TP.HCM',
    phone: '028 5555 6666',
    open_time: '08:00',
    close_time: '20:00'
  }
];

const mockCustomers = [
  { phone: '0901234567', name: 'Nguyễn Văn A', customer_id: 1 },
  { phone: '0912345678', name: 'Trần Thị B', customer_id: 2 },
  { phone: '0923456789', name: 'Lê Văn C', customer_id: 3 }
];

const mockPetsByCustomer: Record<number, Pet[]> = {
  1: [
    {
      pet_id: 1,
      pet_code: 'PET001',
      name: 'Milo',
      species: 'Chó',
      breed: 'Golden Retriever',
      gender: 'Male',
      birth_date: '2020-05-15',
      health_status: 'Khỏe mạnh',
      owner_id: 1
    },
    {
      pet_id: 2,
      pet_code: 'PET002',
      name: 'Luna',
      species: 'Mèo',
      breed: 'British Shorthair',
      gender: 'Female',
      birth_date: '2021-08-20',
      health_status: 'Khỏe mạnh',
      owner_id: 1
    }
  ],
  2: [
    {
      pet_id: 3,
      pet_code: 'PET003',
      name: 'Max',
      species: 'Chó',
      breed: 'Poodle',
      gender: 'Male',
      birth_date: '2019-12-10',
      health_status: 'Khỏe mạnh',
      owner_id: 2
    }
  ],
  3: [
    {
      pet_id: 4,
      pet_code: 'PET004',
      name: 'Bella',
      species: 'Mèo',
      breed: 'Persian',
      gender: 'Female',
      birth_date: '2022-03-05',
      health_status: 'Khỏe mạnh',
      owner_id: 3
    }
  ]
};

const mockDoctors: Employee[] = [
  { employee_id: 1, employee_code: 'DOC001', name: 'BS. Nguyễn Văn A', gender: 'Nam', position: 1, branch_id: 1 },
  { employee_id: 2, employee_code: 'DOC002', name: 'BS. Trần Thị B', gender: 'Nữ', position: 1, branch_id: 1 },
  { employee_id: 3, employee_code: 'DOC003', name: 'BS. Lê Văn C', gender: 'Nam', position: 1, branch_id: 2 },
  { employee_id: 4, employee_code: 'DOC004', name: 'BS. Phạm Thị D', gender: 'Nữ', position: 1, branch_id: 2 },
  { employee_id: 5, employee_code: 'DOC005', name: 'BS. Hoàng Văn E', gender: 'Nam', position: 1, branch_id: 3 }
];

const CreateAppointment = () => {
  const [branches] = useState<Branch[]>(mockBranches);
  const [formData, setFormData] = useState({
    branchId: '',
    date: '',
    time: '',
    customerPhone: '',
    petId: '',
    doctorId: ''
  });
  const [customerInfo, setCustomerInfo] = useState<{ name: string; customer_id: number } | null>(null);
  const [availablePets, setAvailablePets] = useState<Pet[]>([]);
  const [availableDoctors, setAvailableDoctors] = useState<Employee[]>([]);
  const [isLoadingDoctors, setIsLoadingDoctors] = useState(false);
  const [isLoadingCustomer, setIsLoadingCustomer] = useState(false);
  const [customerSearched, setCustomerSearched] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  // Tìm kiếm khách hàng khi nhập số điện thoại (giả lập API call)
  const handlePhoneSearch = () => {
    if (!formData.customerPhone) return;

    // Giả lập gọi API
    setIsLoadingCustomer(true);
    setCustomerInfo(null);
    setAvailablePets([]);
    setCustomerSearched(false);

    // Simulate API delay
    setTimeout(() => {
      const customer = mockCustomers.find((c) => c.phone === formData.customerPhone);
      if (customer) {
        setCustomerInfo({ name: customer.name, customer_id: customer.customer_id });
        setAvailablePets(mockPetsByCustomer[customer.customer_id] || []);
        setFormData((prev) => ({ ...prev, petId: '' }));
      } else {
        setCustomerInfo(null);
        setAvailablePets([]);
        setFormData((prev) => ({ ...prev, petId: '' }));
      }
      setIsLoadingCustomer(false);
      setCustomerSearched(true);
    }, 500); // 500ms delay để giả lập API call
  };

  // Lọc bác sĩ theo chi nhánh, ngày và giờ (giả lập API call)
  useEffect(() => {
    if (formData.branchId && formData.date && formData.time) {
      // Giả lập gọi API
      setIsLoadingDoctors(true);
      setAvailableDoctors([]);

      // Simulate API delay
      const timer = setTimeout(() => {
        const doctors = mockDoctors.filter((doc) => doc.branch_id === Number(formData.branchId));
        setAvailableDoctors(doctors);
        setIsLoadingDoctors(false);
      }, 600); // 600ms delay để giả lập API call

      return () => clearTimeout(timer);
    } else {
      setAvailableDoctors([]);
      setIsLoadingDoctors(false);
    }
  }, [formData.branchId, formData.date, formData.time]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validate form
    if (
      !formData.branchId ||
      !formData.date ||
      !formData.time ||
      !formData.customerPhone ||
      !formData.petId ||
      !formData.doctorId
    ) {
      alert('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (!customerInfo) {
      alert('Vui lòng tìm kiếm khách hàng trước');
      return;
    }

    // Show success message
    setShowSuccessMessage(true);
    setTimeout(() => {
      setShowSuccessMessage(false);
      // Reset form
      setFormData({
        branchId: '',
        date: '',
        time: '',
        customerPhone: '',
        petId: '',
        doctorId: ''
      });
      setCustomerInfo(null);
      setAvailablePets([]);
      setAvailableDoctors([]);
    }, 2000);
  };

  const handleReset = () => {
    setFormData({
      branchId: '',
      date: '',
      time: '',
      customerPhone: '',
      petId: '',
      doctorId: ''
    });
    setCustomerInfo(null);
    setAvailablePets([]);
    setAvailableDoctors([]);
  };

  return (
    <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Create Walk-in Appointment</h1>
        <p className='mt-1 text-sm text-gray-600'>Book an appointment for walk-in customers</p>
      </div>

      {/* Success Message */}
      {showSuccessMessage && (
        <div className='mb-6 rounded-lg border border-green-200 bg-green-50 p-4'>
          <div className='flex items-center gap-2 text-green-800'>
            <CheckCircle className='h-5 w-5' />
            <p className='font-medium'>Appointment created successfully!</p>
          </div>
        </div>
      )}

      {/* Appointment Form */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Chi nhánh */}
          <div>
            <label htmlFor='branch' className='mb-2 block text-sm font-medium text-gray-700'>
              Branch <span className='text-red-500'>*</span>
            </label>
            <select
              id='branch'
              value={formData.branchId}
              onChange={(e) => setFormData({ ...formData, branchId: e.target.value, doctorId: '' })}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
            >
              <option value=''>Select branch</option>
              {branches.map((branch) => (
                <option key={branch.branch_id} value={branch.branch_id}>
                  {branch.name}
                </option>
              ))}
            </select>
          </div>

          {/* Ngày khám và Giờ khám */}
          <div className='grid gap-6 sm:grid-cols-2'>
            <div>
              <label htmlFor='date' className='mb-2 block text-sm font-medium text-gray-700'>
                Appointment Date <span className='text-red-500'>*</span>
              </label>
              <input
                type='date'
                id='date'
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value, doctorId: '' })}
                min={new Date().toISOString().split('T')[0]}
                className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
              />
            </div>

            <div>
              <label htmlFor='time' className='mb-2 block text-sm font-medium text-gray-700'>
                Appointment Time <span className='text-red-500'>*</span>
              </label>
              <input
                type='time'
                id='time'
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value, doctorId: '' })}
                className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
              />
            </div>
          </div>

          {/* Số điện thoại khách hàng */}
          <div>
            <label htmlFor='customer-phone' className='mb-2 block text-sm font-medium text-gray-700'>
              Customer Phone Number <span className='text-red-500'>*</span>
            </label>
            <div className='flex gap-2'>
              <input
                type='tel'
                id='customer-phone'
                value={formData.customerPhone}
                onChange={(e) => setFormData({ ...formData, customerPhone: e.target.value })}
                placeholder='Enter phone number...'
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
              />
              <button
                type='button'
                onClick={handlePhoneSearch}
                disabled={isLoadingCustomer || !formData.customerPhone}
                className='flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400'
              >
                <Search className='h-4 w-4' />
                Search
              </button>
            </div>
            {isLoadingCustomer && <p className='mt-2 text-sm text-gray-500'>Searching...</p>}
            {!isLoadingCustomer && customerInfo && (
              <p className='mt-2 text-sm text-green-600'>Customer: {customerInfo.name}</p>
            )}
            {!isLoadingCustomer && customerSearched && !customerInfo && (
              <p className='mt-2 text-sm text-red-600'>Customer not found</p>
            )}
            {!isLoadingCustomer && !customerSearched && formData.customerPhone && (
              <p className='mt-2 text-sm text-gray-500'>Click "Search" to find customer</p>
            )}
          </div>

          {/* Chọn thú cưng */}
          <div>
            <label htmlFor='pet' className='mb-2 block text-sm font-medium text-gray-700'>
              Select Pet <span className='text-red-500'>*</span>
            </label>
            <select
              id='pet'
              value={formData.petId}
              onChange={(e) => setFormData({ ...formData, petId: e.target.value })}
              disabled={!customerInfo}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
            >
              <option value=''>Select pet</option>
              {availablePets.map((pet) => (
                <option key={pet.pet_id} value={pet.pet_id}>
                  {pet.name} - {pet.species} ({pet.breed})
                </option>
              ))}
            </select>
            {customerInfo && availablePets.length > 0 && (
              <p className='mt-2 text-sm text-green-600'>Customer has {availablePets.length} pets</p>
            )}
            {customerInfo && availablePets.length === 0 && (
              <p className='mt-2 text-sm text-red-600'>Customer has no pets yet</p>
            )}
          </div>

          {/* Chọn bác sĩ */}
          <div>
            <label htmlFor='doctor' className='mb-2 block text-sm font-medium text-gray-700'>
              Select Doctor <span className='text-red-500'>*</span>
            </label>
            <select
              id='doctor'
              value={formData.doctorId}
              onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              disabled={isLoadingDoctors || availableDoctors.length === 0}
              className='w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
            >
              <option value=''>Select doctor</option>
              {availableDoctors.map((doctor) => (
                <option key={doctor.employee_id} value={doctor.employee_id}>
                  {doctor.name}
                </option>
              ))}
            </select>
            {isLoadingDoctors && <p className='mt-2 text-sm text-gray-500'>Loading doctors list...</p>}
            {!isLoadingDoctors && availableDoctors.length > 0 && (
              <p className='mt-2 text-sm text-green-600'>{availableDoctors.length} doctors available at this time</p>
            )}
            {!isLoadingDoctors &&
              formData.branchId &&
              formData.date &&
              formData.time &&
              availableDoctors.length === 0 && (
                <p className='mt-2 text-sm text-red-600'>No doctors available at this time</p>
              )}
          </div>

          {/* Action Buttons */}
          <div className='flex gap-3 pt-4'>
            <button
              type='button'
              onClick={handleReset}
              className='flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              className='flex-1 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700'
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;
