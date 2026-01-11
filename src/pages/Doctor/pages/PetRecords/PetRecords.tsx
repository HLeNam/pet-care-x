import {
  Search,
  FileText,
  User,
  Phone,
  Calendar,
  Tag,
  CalendarDays,
  HeartPulse,
  PawPrint,
  PlusCircle,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useCustomerByPhone } from '~/hooks/useCustomerByPhone';
import { usePetsByOwner } from '~/hooks/usePetsByOwner';
import { usePetDetails } from '~/hooks/usePetDetails';
import { usePetMedicalRecords } from '~/hooks/usePetMedicalRecords';
import type { GetPetMedicalRecordItemResponse, PetOwner } from '~/types/pet.type';
import NewMedicalRecordModal from '../../components/MedicalRecordModal/NewMedicalRecordModal';
import MedicalRecordPrescription from './components/MedicalRecordPrescription';

const PetRecords = () => {
  const [phoneInput, setPhoneInput] = useState('');
  const [selectedOwnerId, setSelectedOwnerId] = useState<number | null>(null);
  const [selectedPetId, setSelectedPetId] = useState<number | null>(null);
  const [ownerData, setOwnerData] = useState<PetOwner | null>(null);
  const [enableSearch, setEnableSearch] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [medicalPageNo, setMedicalPageNo] = useState(1);
  const [medicalPageSize] = useState(5);

  // Search customer by phone
  const { isLoading: isSearching, refetch: searchCustomer } = useCustomerByPhone({
    phoneNumber: phoneInput,
    enabled: enableSearch
  });

  // Get pets by owner
  const { data: petsData, isLoading: isLoadingPets } = usePetsByOwner({
    idKhachHang: selectedOwnerId,
    enabled: !!selectedOwnerId
  });

  const filteredPets = petsData || [];

  // Get selected pet details
  const { data: petDetailsData, isLoading: isLoadingPetDetails } = usePetDetails({
    idThuCung: selectedPetId,
    enabled: !!selectedPetId
  });

  const selectedPet = petDetailsData?.data?.data || null;

  // Get medical records for selected pet
  const { data: medicalRecordsData, isLoading: isLoadingRecords } = usePetMedicalRecords({
    idThuCung: selectedPetId,
    pageNo: medicalPageNo,
    pageSize: medicalPageSize,
    enabled: !!selectedPetId
  });

  const medicalRecords = medicalRecordsData?.items || [];
  const medicalPagination = {
    pageNo: medicalRecordsData?.pageNo || 1,
    pageSize: medicalRecordsData?.pageSize || medicalPageSize,
    totalPage: medicalRecordsData?.totalPage || 0,
    totalElements: medicalRecordsData?.totalElements || 0
  };

  const handleSearch = async () => {
    if (!phoneInput.trim()) {
      toast.error('Please enter a phone number');
      return;
    }

    setOwnerData(null);
    setSelectedOwnerId(null);
    setSelectedPetId(null);
    setEnableSearch(true);

    // Trigger search
    const result = await searchCustomer();

    if (result.data?.data?.data) {
      const customerData = result.data.data.data;
      setOwnerData({
        name: customerData.hoTen,
        phone: customerData.soDienThoai
      });
      setSelectedOwnerId(customerData.idKhachHang);
    } else if (result.isError) {
      toast.error('No owner found with this phone number');
    }

    setEnableSearch(false);
  };

  const handleReset = () => {
    setPhoneInput('');
    setOwnerData(null);
    setSelectedOwnerId(null);
    setSelectedPetId(null);
  };

  const handlePetChange = (petId: number | null) => {
    setSelectedPetId(petId);
    setMedicalPageNo(1); // Reset to first page when changing pet
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Pet Records</h1>
        <p className='mt-1 text-sm text-gray-600'>Search and manage pet medical records</p>
      </div>

      {/* Search Section */}
      <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
        <div className='space-y-4'>
          {/* Phone Number Search */}
          <div>
            <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
              <Phone className='h-4 w-4' />
              Search Owner by Phone Number
            </label>
            <div className='flex gap-2'>
              <input
                type='tel'
                value={phoneInput}
                onChange={(e) => setPhoneInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder='Enter phone number (e.g., 0901234567)'
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
              />
              <button
                onClick={handleSearch}
                disabled={isSearching || !phoneInput.trim()}
                className='flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-300'
              >
                <Search className='h-4 w-4' />
                {isSearching ? 'Searching...' : 'Search'}
              </button>
              {selectedOwnerId && (
                <button
                  onClick={handleReset}
                  className='rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50'
                >
                  Reset
                </button>
              )}
            </div>
          </div>

          {/* Owner Info & Pet Selection */}
          {selectedOwnerId && ownerData && (
            <div className='rounded-lg border border-orange-200 bg-orange-50 p-4'>
              <div className='mb-3 flex items-center gap-2'>
                <User className='h-5 w-5 text-orange-600' />
                <h3 className='font-semibold text-gray-900'>Owner Found</h3>
              </div>
              <div className='mb-4 grid gap-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-gray-700'>Name:</span>
                  <span className='text-gray-900'>{ownerData.name}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='h-4 w-4 text-gray-500' />
                  <span className='font-medium text-gray-700'>Phone:</span>
                  <span className='text-gray-900'>{ownerData.phone}</span>
                </div>
              </div>

              <div>
                <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                  <Tag className='h-4 w-4' />
                  Select Pet
                </label>
                <select
                  value={selectedPetId || ''}
                  onChange={(e) => handlePetChange(Number(e.target.value) || null)}
                  disabled={isLoadingPets}
                  className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
                >
                  <option value=''>{isLoadingPets ? 'Loading pets...' : '-- Select Pet --'}</option>
                  {filteredPets.map((pet) => (
                    <option key={pet.pet_id} value={pet.pet_id}>
                      {pet.name} - {pet.pet_code}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pet Details & Medical Records */}
      {selectedPetId && (
        <div className='space-y-6'>
          {/* Pet Information Card */}
          {isLoadingPetDetails ? (
            <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
              <div className='animate-pulse space-y-4'>
                <div className='h-6 w-1/4 rounded bg-gray-200'></div>
                <div className='h-4 w-3/4 rounded bg-gray-200'></div>
                <div className='h-4 w-1/2 rounded bg-gray-200'></div>
              </div>
            </div>
          ) : selectedPet ? (
            <div>
              <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <div className='mb-4 flex items-center justify-between'>
                  <h2 className='text-lg font-semibold text-gray-900'>Pet Information</h2>
                  <span className='rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700'>
                    {selectedPet.maThuCung}
                  </span>
                </div>

                <div className='grid gap-4 md:grid-cols-3'>
                  {/* Pet Basic Info */}
                  <div className='space-y-3'>
                    <div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Tag className='h-4 w-4' />
                        <span className='font-medium'>Name:</span>
                      </div>
                      <p className='ml-6 font-semibold text-gray-900'>{selectedPet.ten}</p>
                    </div>

                    <div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <PawPrint className='h-4 w-4' />
                        <span className='font-medium'>Species:</span>
                      </div>
                      <p className='ml-6 font-semibold text-gray-900'>{selectedPet.loai || 'N/A'}</p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <Tag className='h-4 w-4' />
                        <span className='font-medium'>Breed:</span>
                      </div>
                      <p className='ml-6 font-semibold text-gray-900'>{selectedPet.giong || 'N/A'}</p>
                    </div>

                    <div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <CalendarDays className='h-4 w-4' />
                        <span className='font-medium'>Birth Date:</span>
                      </div>
                      <p className='ml-6 font-semibold text-gray-900'>
                        {selectedPet.ngaySinh ? new Date(selectedPet.ngaySinh).toLocaleDateString('en-US') : 'N/A'}
                      </p>
                    </div>
                  </div>

                  <div className='space-y-3'>
                    <div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <User className='h-4 w-4' />
                        <span className='font-medium'>Gender:</span>
                      </div>
                      <p className='ml-6 font-semibold text-gray-900'>{selectedPet.gioiTinh || 'N/A'}</p>
                    </div>

                    <div>
                      <div className='flex items-center gap-2 text-sm text-gray-600'>
                        <HeartPulse className='h-4 w-4' />
                        <span className='font-medium'>Health Status:</span>
                      </div>
                      <p className='ml-6 font-semibold text-gray-900'>{selectedPet.tinhTrangSucKhoe || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                {/* Owner Info */}
                {ownerData && (
                  <div className='mt-4 border-t border-gray-200 pt-4'>
                    <div className='flex items-center gap-2 text-sm text-gray-600'>
                      <User className='h-4 w-4' />
                      <span className='font-medium'>Owner:</span>
                    </div>
                    <div className='mt-1 ml-6 flex items-center gap-4'>
                      <span className='font-semibold text-gray-900'>{ownerData.name}</span>
                      <span className='flex items-center gap-1 text-gray-600'>
                        <Phone className='h-3.5 w-3.5' />
                        {ownerData.phone}
                      </span>
                    </div>
                  </div>
                )}
              </div>

              {/* Medical Records */}
              <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
                <div className='mb-4 flex items-center justify-between'>
                  <h2 className='text-lg font-semibold text-gray-900'>Medical History</h2>
                  <button
                    onClick={handleOpenModal}
                    className='flex cursor-pointer items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600'
                  >
                    <PlusCircle className='h-4 w-4' />
                    Create New Medical Record
                  </button>
                </div>

                {isLoadingRecords ? (
                  <div className='space-y-3'>
                    {[1, 2, 3].map((i) => (
                      <div key={i} className='animate-pulse rounded-lg border border-gray-200 bg-gray-50 p-4'>
                        <div className='mb-2 h-4 w-3/4 rounded bg-gray-200'></div>
                        <div className='h-4 w-1/2 rounded bg-gray-200'></div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className='space-y-3'>
                    {medicalRecords.length > 0 ? (
                      medicalRecords.map((record: GetPetMedicalRecordItemResponse) => (
                        <div
                          key={record.idHoSo}
                          className='rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100'
                        >
                          <div className='flex items-start justify-between'>
                            <div className='flex gap-3'>
                              <div className='flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-orange-100'>
                                <FileText className='h-5 w-5 text-orange-600' />
                              </div>
                              <div className='flex-1'>
                                <div className='mb-2 flex items-center gap-2'>
                                  <Calendar className='h-4 w-4 text-gray-500' />
                                  <p className='text-sm font-semibold text-gray-900'>
                                    Visit date: {new Date(record.thoiGianKham).toLocaleDateString('en-US')} -{' '}
                                    {record.tenBacSi}
                                  </p>
                                </div>
                                <div className='space-y-1 text-sm text-gray-600'>
                                  <p>
                                    <span className='font-semibold'>Symptoms:</span> {record.trieuChung || 'N/A'}
                                  </p>
                                  <p>
                                    <span className='font-semibold'>Diagnosis:</span> {record.chuanDoan || 'N/A'}
                                  </p>
                                  {record.ngayTaiKham && (
                                    <p className='flex items-center gap-1'>
                                      <span className='font-semibold'>Follow-up:</span>{' '}
                                      {new Date(record.ngayTaiKham).toLocaleDateString('en-US')}
                                    </p>
                                  )}
                                </div>
                                {/* Prescription */}
                                <MedicalRecordPrescription idHoSo={record.idHoSo} />
                              </div>
                            </div>
                            {/* TODO: Update MedicalDetailModal to handle API data structure */}
                            {/* <button
                        onClick={() => handleOpenViewDetailsModal(record)}
                        className='cursor-pointer text-sm font-medium text-orange-600 hover:text-orange-700'
                      >
                        Details
                      </button> */}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className='rounded-lg bg-gray-50 py-12 text-center'>
                        <FileText className='mx-auto h-12 w-12 text-gray-400' />
                        <p className='mt-2 text-sm text-gray-600'>No medical history available</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Pagination */}
                {!isLoadingRecords && medicalRecords.length > 0 && medicalPagination.totalPage > 1 && (
                  <div className='mt-6 flex items-center justify-between border-t border-gray-200 bg-white pt-4'>
                    <div className='flex items-center gap-2 text-sm text-gray-700'>
                      <span>
                        Showing {(medicalPagination.pageNo - 1) * medicalPagination.pageSize + 1} to{' '}
                        {Math.min(
                          medicalPagination.pageNo * medicalPagination.pageSize,
                          medicalPagination.totalElements
                        )}{' '}
                        of {medicalPagination.totalElements} records
                      </span>
                    </div>

                    <div className='flex items-center gap-2'>
                      {/* Previous Button */}
                      <button
                        onClick={() => setMedicalPageNo((prev) => Math.max(1, prev - 1))}
                        disabled={medicalPagination.pageNo === 1}
                        className='flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white'
                      >
                        <ChevronLeft className='h-4 w-4' />
                        Previous
                      </button>

                      {/* Page Numbers */}
                      <div className='flex items-center gap-1'>
                        {Array.from({ length: medicalPagination.totalPage }, (_, i) => i + 1)
                          .filter((page) => {
                            return (
                              page === 1 ||
                              page === medicalPagination.totalPage ||
                              (page >= medicalPagination.pageNo - 1 && page <= medicalPagination.pageNo + 1)
                            );
                          })
                          .map((page, index, array) => (
                            <div key={page} className='flex items-center'>
                              {index > 0 && array[index - 1] !== page - 1 && (
                                <span className='px-2 text-gray-500'>...</span>
                              )}
                              <button
                                onClick={() => setMedicalPageNo(page)}
                                className={`min-w-[40px] rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                                  page === medicalPagination.pageNo
                                    ? 'bg-orange-500 text-white hover:bg-orange-600'
                                    : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                                }`}
                              >
                                {page}
                              </button>
                            </div>
                          ))}
                      </div>

                      {/* Next Button */}
                      <button
                        onClick={() => setMedicalPageNo((prev) => Math.min(medicalPagination.totalPage, prev + 1))}
                        disabled={medicalPagination.pageNo === medicalPagination.totalPage}
                        className='flex items-center gap-1 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-white'
                      >
                        Next
                        <ChevronRight className='h-4 w-4' />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* Empty State */}
      {!selectedPetId && (
        <div className='rounded-lg border border-gray-200 bg-white py-16 text-center shadow-sm'>
          <Search className='mx-auto h-16 w-16 text-gray-400' />
          <h3 className='mt-4 text-lg font-medium text-gray-900'>No pet selected</h3>
          <p className='mt-2 text-sm text-gray-500'>
            {selectedOwnerId
              ? 'Please select a pet to view medical records'
              : 'Search for an owner by phone number to get started'}
          </p>
        </div>
      )}

      {/* Medical Record Modal */}
      <NewMedicalRecordModal
        isOpen={isModalOpen}
        petId={selectedPetId || undefined}
        petName={selectedPet?.ten}
        onClose={handleCloseModal}
      />
    </div>
  );
};

export default PetRecords;
