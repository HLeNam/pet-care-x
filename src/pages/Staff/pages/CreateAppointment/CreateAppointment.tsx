import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { toast } from 'react-toastify';
import { useBranchListInfinite } from '~/hooks/useBranchListInfinite';
import { useDoctorsAvailableInfinite } from '~/hooks/useDoctorsAvailableInfinite';
import { useCustomerByPhone } from '~/hooks/useCustomerByPhone';
import { usePetsByOwnerInfinite } from '~/hooks/usePetsByOwnerInfinite';
import { useCreateAppointment } from '~/hooks/useCreateAppointment';
import { DoctorSelect } from '~/components/DoctorSelect';
import { InfiniteSelect } from '~/components/InfiniteSelect';
import type { GetCustomerByPhoneResponse } from '~/types/customer.type';

const CreateAppointment = () => {
  // Fetch danh sách chi nhánh từ API với infinite scroll
  const {
    data: branchesData,
    isLoading: isLoadingBranches,
    isFetchingNextPage: isFetchingNextBranches,
    hasNextPage: hasNextBranches,
    fetchNextPage: fetchNextBranches
  } = useBranchListInfinite({ pageSize: 20 });

  // Flatten tất cả branches từ các pages
  const branches = useMemo(() => {
    if (!branchesData?.pages) return [];
    return branchesData.pages.flatMap((page) => page.items);
  }, [branchesData]);

  const totalBranches = branchesData?.pages[0]?.totalItems || 0;

  const [formData, setFormData] = useState({
    branchId: '',
    date: '',
    time: '',
    customerPhone: '',
    petId: '',
    doctorId: ''
  });
  const [customerInfo, setCustomerInfo] = useState<GetCustomerByPhoneResponse | null>(null);
  const [enableSearch, setEnableSearch] = useState(false);
  const [doctorSearchQuery, setDoctorSearchQuery] = useState('');
  const [branchSearchQuery, setBranchSearchQuery] = useState('');
  const [petSearchQuery, setPetSearchQuery] = useState('');

  // React Query hook để search khách hàng theo số điện thoại
  const {
    isLoading: isLoadingCustomer,
    isError: isCustomerError,
    refetch: searchCustomer
  } = useCustomerByPhone({
    phoneNumber: formData.customerPhone,
    enabled: enableSearch
  });

  // React Query hook để lấy danh sách thú cưng theo owner ID với infinite scroll
  const {
    data: petsData,
    isLoading: isLoadingPets,
    isFetchingNextPage: isFetchingNextPets,
    hasNextPage: hasNextPets,
    fetchNextPage: fetchNextPets
  } = usePetsByOwnerInfinite({
    idKhachHang: customerInfo?.idKhachHang || null,
    enabled: !!customerInfo,
    pageSize: 20
  });

  // Flatten tất cả pets từ các pages
  const availablePets = useMemo(() => {
    if (!petsData?.pages) return [];
    return petsData.pages.flatMap((page) => page.items);
  }, [petsData]);

  const totalPets = petsData?.pages[0]?.totalItems || 0;

  // Fetch danh sách bác sĩ rảnh từ API với infinite scroll
  const {
    data: doctorsData,
    isLoading: isLoadingDoctors,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage
  } = useDoctorsAvailableInfinite({
    branchId: formData.branchId ? Number(formData.branchId) : null,
    date: formData.date,
    time: formData.time,
    pageSize: 20
  });

  // Flatten tất cả doctors từ các pages
  const availableDoctors = useMemo(() => {
    if (!doctorsData?.pages) return [];
    return doctorsData.pages.flatMap((page) => page.items);
  }, [doctorsData]);

  // Tổng số doctors
  const totalDoctors = doctorsData?.pages[0]?.totalItems || 0;

  // Mutation hook để tạo lịch hẹn
  const createAppointmentMutation = useCreateAppointment();

  // Tìm kiếm khách hàng khi nhập số điện thoại
  const handlePhoneSearch = async () => {
    if (!formData.customerPhone) return;

    setCustomerInfo(null);
    setFormData((prev) => ({ ...prev, petId: '' }));
    setEnableSearch(true);

    // Trigger search
    const result = await searchCustomer();

    if (result.data?.data?.data) {
      setCustomerInfo(result.data.data.data);
      // usePetsByOwner sẽ tự động fetch pets khi customerInfo được set
    }

    setEnableSearch(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
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
      toast.error('Please fill in all required fields');
      return;
    }

    if (!customerInfo) {
      toast.error('Please search for customer first');
      return;
    }

    // Tìm thông tin chi nhánh, thú cưng và bác sĩ
    const selectedBranch = branches.find((b) => b.branch_id === Number(formData.branchId));
    const selectedPet = availablePets.find((p) => p.pet_id === Number(formData.petId));
    const selectedDoctor = availableDoctors.find((d) => d.employee_id === Number(formData.doctorId));

    if (!selectedBranch || !selectedPet || !selectedDoctor) {
      toast.error('Invalid information. Please try again');
      return;
    }

    // Parse time (format: "HH:mm")
    const [hour, minute] = formData.time.split(':').map(Number);

    try {
      // Gọi API tạo lịch hẹn
      await createAppointmentMutation.mutateAsync({
        idChiNhanh: selectedBranch.branch_id,
        tenChiNhanh: selectedBranch.name,
        idKhachHang: customerInfo.idKhachHang,
        tenKhachHang: customerInfo.hoTen,
        idThuCung: selectedPet.pet_id,
        tenThuCung: selectedPet.name,
        ngayHen: formData.date,
        gioBatDau: `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00`,
        idNhanVien: selectedDoctor.employee_id,
        tenBacSi: selectedDoctor.name
      });

      // Show success toast
      toast.success('Appointment created successfully!');

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
    } catch (error) {
      console.error('Error creating appointment:', error);
      toast.error('Failed to create appointment. Please try again.');
    }
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
    setDoctorSearchQuery('');
    setBranchSearchQuery('');
    setPetSearchQuery('');
  };

  return (
    <div className='mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Create Walk-in Appointment</h1>
        <p className='mt-1 text-sm text-gray-600'>Book an appointment for walk-in customers</p>
      </div>

      {/* Appointment Form */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <form onSubmit={handleSubmit} className='space-y-6'>
          {/* Chi nhánh */}
          <div>
            <label htmlFor='branch' className='mb-2 block text-sm font-medium text-gray-700'>
              Branch <span className='text-red-500'>*</span>
            </label>
            <InfiniteSelect
              value={formData.branchId}
              onChange={(value) => setFormData({ ...formData, branchId: value, doctorId: '' })}
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
              placeholder='Select branch'
              totalCount={totalBranches}
              searchQuery={branchSearchQuery}
              onSearchChange={setBranchSearchQuery}
              emptyMessage='No branches available'
              loadingMessage='Loading branches...'
              getSearchText={(item) => item.label}
            />
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
                className='w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
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
                className='w-full cursor-pointer rounded-lg border border-gray-300 px-4 py-2 focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
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
                className='flex cursor-pointer items-center gap-2 rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400'
              >
                <Search className='h-4 w-4' />
                Search
              </button>
            </div>
            {isLoadingCustomer && <p className='mt-2 text-sm text-gray-500'>Searching...</p>}
            {!isLoadingCustomer && customerInfo && (
              <div className='mt-2 space-y-1'>
                <p className='text-sm text-green-600'>Customer: {customerInfo.hoTen}</p>
                <p className='text-xs text-gray-500'>Code: {customerInfo.maKhachHang}</p>
              </div>
            )}
            {!isLoadingCustomer && isCustomerError && <p className='mt-2 text-sm text-red-600'>Customer not found</p>}
          </div>

          {/* Chọn thú cưng */}
          <div>
            <label htmlFor='pet' className='mb-2 block text-sm font-medium text-gray-700'>
              Select Pet <span className='text-red-500'>*</span>
            </label>
            <InfiniteSelect
              value={formData.petId}
              onChange={(value) => setFormData({ ...formData, petId: value })}
              items={availablePets.map((pet) => ({
                id: pet.pet_id,
                label: pet.name,
                subLabel: pet.pet_code
              }))}
              isLoading={isLoadingPets}
              isFetchingNextPage={isFetchingNextPets}
              hasNextPage={hasNextPets ?? false}
              onLoadMore={() => fetchNextPets()}
              disabled={!customerInfo || isLoadingPets}
              placeholder='Select pet'
              totalCount={totalPets}
              searchQuery={petSearchQuery}
              onSearchChange={setPetSearchQuery}
              emptyMessage='No pets available'
              loadingMessage='Loading pets...'
              getSearchText={(item) => item.label}
            />
            {isLoadingPets && <p className='mt-2 text-sm text-gray-500'>Loading pets...</p>}
            {!isLoadingPets && customerInfo && availablePets.length > 0 && (
              <p className='mt-2 text-sm text-green-600'>Customer has {totalPets} pet(s)</p>
            )}
            {!isLoadingPets && customerInfo && availablePets.length === 0 && (
              <p className='mt-2 text-sm text-red-600'>Customer has no pets yet</p>
            )}
          </div>

          {/* Chọn bác sĩ */}
          <div>
            <label htmlFor='doctor' className='mb-2 block text-sm font-medium text-gray-700'>
              Select Doctor <span className='text-red-500'>*</span>
            </label>
            <DoctorSelect
              value={formData.doctorId}
              onChange={(value) => setFormData({ ...formData, doctorId: value })}
              doctors={availableDoctors}
              isLoading={isLoadingDoctors}
              isFetchingNextPage={isFetchingNextPage}
              hasNextPage={hasNextPage ?? false}
              onLoadMore={() => fetchNextPage()}
              disabled={!formData.branchId || !formData.date || !formData.time}
              totalCount={totalDoctors}
              searchQuery={doctorSearchQuery}
              onSearchChange={setDoctorSearchQuery}
            />
            {isLoadingDoctors && <p className='mt-2 text-sm text-gray-500'>Loading doctors list...</p>}
            {!isLoadingDoctors && availableDoctors.length > 0 && (
              <p className='mt-2 text-sm text-green-600'>{totalDoctors} doctors available at this time</p>
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
              disabled={createAppointmentMutation.isPending}
              className='flex-1 cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
            >
              Cancel
            </button>
            <button
              type='submit'
              disabled={createAppointmentMutation.isPending}
              className='flex-1 cursor-pointer rounded-lg bg-orange-600 px-4 py-2 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50'
            >
              {createAppointmentMutation.isPending ? 'Creating...' : 'Confirm Appointment'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAppointment;
