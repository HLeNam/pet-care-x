import { useState, useEffect, useMemo } from 'react';
import { Search, FileText, User, Phone, Calendar, X, Package } from 'lucide-react';
import { useCustomerByPhone } from '~/hooks/useCustomerByPhone';
import { usePetsByOwnerInfinite } from '~/hooks/usePetsByOwnerInfinite';
import { usePetDetails } from '~/hooks/usePetDetails';
import { usePetMedicalRecords } from '~/hooks/usePetMedicalRecords';
import { usePrescriptionsByMedicalRecordId } from '~/hooks/usePrescriptions';
import useQueryParams from '~/hooks/useQueryParams';
import { Pagination } from '~/pages/User/components/Pagination';
import { InfiniteSelect } from '~/components/InfiniteSelect';
import type { GetCustomerByPhoneResponse } from '~/types/customer.type';

// Helper function to format doctor name
const formatDoctorName = (tenBacSi: string | null): string => {
  if (!tenBacSi) {
    return 'No information';
  }
  return tenBacSi;
};

const PetLookup = () => {
  const [ownerPhone, setOwnerPhone] = useState('');
  const [customerInfo, setCustomerInfo] = useState<GetCustomerByPhoneResponse | null>(null);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [enableSearch, setEnableSearch] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);
  const [petSearchQuery, setPetSearchQuery] = useState('');
  const [prescriptionPage, setPrescriptionPage] = useState(1);

  // Query params for pagination
  const { getParam, updateParams } = useQueryParams();
  const currentPage = Number(getParam('page', '1'));
  const pageSize = 5; // Records per page
  const prescriptionPageSize = 5; // Prescriptions per page

  // React Query hook to search customer by phone
  const {
    isLoading: isLoadingOwner,
    isError: isCustomerError,
    refetch: searchCustomer
  } = useCustomerByPhone({
    phoneNumber: ownerPhone,
    enabled: enableSearch
  });

  // React Query hook to get pets by owner ID with infinite scroll
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

  // Flatten all pets from pages
  const filteredPets = useMemo(() => {
    if (!petsData?.pages) return [];
    return petsData.pages.flatMap((page) => page.items);
  }, [petsData]);

  const totalPets = petsData?.pages[0]?.totalItems || 0;

  // React Query hook to get pet details
  const { data: petDetailsData, isLoading: isLoadingPetDetails } = usePetDetails({
    idThuCung: selectedPet,
    enabled: !!selectedPet
  });

  // React Query hook to get pet medical records with pagination
  const { data: medicalRecordsData, isLoading: isLoadingMedicalRecords } = usePetMedicalRecords({
    idThuCung: selectedPet,
    pageNo: currentPage,
    pageSize: pageSize,
    enabled: !!selectedPet
  });

  const petMedicalRecords = medicalRecordsData?.items || [];
  const totalPages = medicalRecordsData?.totalPage || 0;
  const totalElements = medicalRecordsData?.totalElements || 0;

  // React Query hook to get prescriptions for selected medical record
  const { data: prescriptionsData, isLoading: isLoadingPrescriptions } = usePrescriptionsByMedicalRecordId(
    {
      idHoSo: selectedRecord,
      pageNo: prescriptionPage - 1, // API uses 0-indexed pagination
      pageSize: prescriptionPageSize,
      sortBy: 'thoiGianKham',
      sortDir: 'desc'
    },
    !!selectedRecord
  );

  const prescriptions = prescriptionsData?.data?.data?.items || [];
  const prescriptionsTotalPages = prescriptionsData?.data?.data?.totalPage || 0;
  const prescriptionsTotalElements = prescriptionsData?.data?.data?.totalElements || 0;

  const selectedPetData = filteredPets.find((p) => p.pet_id === selectedPet);
  const petDetails = petDetailsData?.data?.data;
  const selectedRecordData = petMedicalRecords.find((r) => r.idHoSo === selectedRecord);

  // Reset page to 1 when pet changes
  useEffect(() => {
    if (selectedPet) {
      updateParams({ page: null }); // Remove page param for page 1
    }
  }, [selectedPet, updateParams]);

  // Reset prescription page when modal is closed
  useEffect(() => {
    if (!selectedRecord) {
      setPrescriptionPage(1);
    }
  }, [selectedRecord]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page === 1) {
      updateParams({ page: null }); // Remove page param for page 1
    } else {
      updateParams({ page: String(page) });
    }
  };

  const handlePhoneSearch = async () => {
    if (!ownerPhone.trim()) return;

    setCustomerInfo(null);
    setSelectedPet(null);
    setEnableSearch(true);

    // Trigger search
    const result = await searchCustomer();

    if (result.data?.data?.data) {
      setCustomerInfo(result.data.data.data);
      // usePetsByOwner will automatically fetch pets when customerInfo is set
    }

    setEnableSearch(false);
  };

  return (
    <div className='mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>Pet Lookup</h1>
        <p className='mt-1 text-sm text-gray-600'>Search and view detailed pet information</p>
      </div>

      {/* Search Section */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='grid gap-4 md:grid-cols-2'>
          {/* Owner Selection */}
          <div>
            <label htmlFor='owner-phone' className='mb-2 block text-sm font-medium text-gray-700'>
              Owner Phone Number <span className='text-red-500'>*</span>
            </label>
            <div className='flex gap-2'>
              <input
                type='tel'
                id='owner-phone'
                value={ownerPhone}
                onChange={(e) => setOwnerPhone(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handlePhoneSearch();
                  }
                }}
                placeholder='Enter phone number...'
                className='flex-1 rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none'
              />
              <button
                type='button'
                onClick={handlePhoneSearch}
                disabled={isLoadingOwner || !ownerPhone.trim()}
                className='flex cursor-pointer items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400'
              >
                <Search className='h-4 w-4' />
                Search
              </button>
            </div>
            {isLoadingOwner && <p className='mt-2 text-sm text-gray-500'>Searching...</p>}
            {!isLoadingOwner && customerInfo && (
              <div className='mt-2 space-y-1'>
                <p className='text-sm text-green-600'>Owner: {customerInfo.hoTen}</p>
                <p className='text-xs text-gray-500'>
                  Code: {customerInfo.maKhachHang} | Phone: {customerInfo.soDienThoai}
                </p>
              </div>
            )}
            {!isLoadingOwner && isCustomerError && ownerPhone.trim() && (
              <p className='mt-2 text-sm text-red-600'>Owner not found</p>
            )}
          </div>

          {/* Pet Selection */}
          <div>
            <label htmlFor='pet' className='mb-2 block text-sm font-medium text-gray-700'>
              Select Pet <span className='text-red-500'>*</span>
            </label>
            <InfiniteSelect
              value={selectedPet ? String(selectedPet) : ''}
              onChange={(value) => setSelectedPet(Number(value) || null)}
              items={filteredPets.map((pet) => ({
                id: pet.pet_id,
                label: pet.name,
                subLabel: pet.pet_code
              }))}
              isLoading={isLoadingPets}
              isFetchingNextPage={isFetchingNextPets}
              hasNextPage={hasNextPets ?? false}
              onLoadMore={() => fetchNextPets()}
              disabled={!customerInfo || isLoadingOwner || isLoadingPets}
              placeholder='-- Select Pet --'
              totalCount={totalPets}
              searchQuery={petSearchQuery}
              onSearchChange={setPetSearchQuery}
              emptyMessage='No pets found for this owner'
              loadingMessage='Loading pets...'
              getSearchText={(item) => item.label}
            />
            {isLoadingPets && <p className='mt-2 text-sm text-gray-500'>Loading pets...</p>}
            {!isLoadingPets && customerInfo && filteredPets.length > 0 && (
              <p className='mt-2 text-sm text-green-600'>{totalPets} pet(s) available</p>
            )}
            {!isLoadingPets && customerInfo && filteredPets.length === 0 && (
              <p className='mt-2 text-sm text-red-600'>No pets found for this owner</p>
            )}
          </div>
        </div>
      </div>

      {/* Pet Details & Medical Records */}
      {selectedPet && selectedPetData && (
        <div className='mt-6 space-y-6'>
          {/* Pet Information Card */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='mb-4 text-lg font-semibold text-gray-900'>Pet Information</h2>
            {isLoadingPetDetails ? (
              <div className='py-8 text-center'>
                <p className='text-sm text-gray-500'>Loading pet details...</p>
              </div>
            ) : petDetails ? (
              <>
                <div className='grid gap-4 md:grid-cols-3'>
                  <div>
                    <span className='text-sm text-gray-600'>Name:</span>
                    <p className='font-medium text-gray-900'>{petDetails.ten}</p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Pet Code:</span>
                    <p className='font-medium text-gray-900'>{petDetails.maThuCung}</p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Species:</span>
                    <p className='font-medium text-gray-900'>{petDetails.loai || 'N/A'}</p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Breed:</span>
                    <p className='font-medium text-gray-900'>{petDetails.giong || 'N/A'}</p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Gender:</span>
                    <p className='font-medium text-gray-900'>{petDetails.gioiTinh}</p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Birth Date:</span>
                    <p className='font-medium text-gray-900'>
                      {petDetails.ngaySinh ? new Date(petDetails.ngaySinh).toLocaleDateString('en-US') : 'N/A'}
                    </p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Health Status:</span>
                    <p className='font-medium text-gray-900'>{petDetails.tinhTrangSucKhoe || 'N/A'}</p>
                  </div>
                </div>
                {customerInfo && (
                  <div className='mt-4 border-t border-gray-200 pt-4'>
                    <span className='mb-2 block text-sm text-gray-600'>Owner:</span>
                    <div className='flex flex-wrap items-center gap-4'>
                      <div className='flex items-center gap-2'>
                        <User className='h-4 w-4 text-gray-400' />
                        <span className='font-medium text-gray-900'>{customerInfo.hoTen}</span>
                      </div>
                      <div className='flex items-center gap-2'>
                        <Phone className='h-4 w-4 text-gray-400' />
                        <span className='text-gray-600'>{customerInfo.soDienThoai}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className='py-8 text-center'>
                <p className='text-sm text-red-600'>Failed to load pet details</p>
              </div>
            )}
          </div>

          {/* Medical Records */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>Medical History</h2>
              <span className='text-sm text-gray-500'>
                {isLoadingMedicalRecords
                  ? 'Loading...'
                  : totalElements > 0
                    ? `Showing ${petMedicalRecords.length} of ${totalElements} records`
                    : '0 records'}
              </span>
            </div>

            {isLoadingMedicalRecords ? (
              <div className='py-8 text-center'>
                <p className='text-sm text-gray-500'>Loading medical records...</p>
              </div>
            ) : petMedicalRecords.length === 0 ? (
              <div className='py-8 text-center'>
                <FileText className='mx-auto h-12 w-12 text-gray-400' />
                <h3 className='mt-4 text-sm font-medium text-gray-900'>No Medical History</h3>
                <p className='mt-2 text-sm text-gray-500'>This pet has no medical records yet</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {petMedicalRecords.map((record) => (
                  <div
                    key={record.idHoSo}
                    className='rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100'
                  >
                    <div className='flex items-start justify-between'>
                      <div className='flex gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                          <FileText className='h-5 w-5 text-orange-600' />
                        </div>
                        <div className='flex-1'>
                          <div className='mb-2 flex items-center gap-2 text-sm'>
                            <Calendar className='h-4 w-4 text-gray-400' />
                            <span className='font-medium text-gray-900'>
                              {new Date(record.thoiGianKham).toLocaleString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </span>
                            <span className='text-gray-400'>•</span>
                            <span className='text-gray-600'>{formatDoctorName(record.tenBacSi)}</span>
                          </div>
                          <p className='mt-1 text-sm text-gray-600'>
                            <span className='font-medium'>Symptoms:</span> {record.trieuChung}
                          </p>
                          <p className='mt-1 text-sm text-gray-600'>
                            <span className='font-medium'>Diagnosis:</span> {record.chuanDoan}
                          </p>
                          {record.ngayTaiKham && (
                            <p className='mt-1 text-sm text-gray-600'>
                              <span className='font-medium'>Next Visit:</span>{' '}
                              {new Date(record.ngayTaiKham).toLocaleDateString('en-US')}
                            </p>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedRecord(record.idHoSo)}
                        className='cursor-pointer text-sm font-medium text-orange-600 hover:text-orange-700'
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Pagination */}
            {!isLoadingMedicalRecords && totalPages > 1 && (
              <div className='mt-6 flex justify-center'>
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
              </div>
            )}
          </div>
        </div>
      )}

      {/* Medical Record Detail Modal */}
      {selectedRecord && selectedRecordData && selectedPetData && customerInfo && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white'>
            {/* Modal Header - Fixed */}
            <div className='flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white p-6'>
              <h2 className='text-xl font-bold text-gray-900'>Medical Record Details</h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className='cursor-pointer rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
              >
                <X className='h-5 w-5' />
              </button>
            </div>

            {/* Modal Content - Scrollable */}
            <div className='flex-1 overflow-y-auto p-6'>
              {/* Basic Information */}
              <div className='mb-6 rounded-lg border border-gray-200 bg-gray-50 p-4'>
                <h3 className='mb-3 font-semibold text-gray-900'>Basic Information</h3>
                <div className='grid gap-4 sm:grid-cols-2'>
                  <div>
                    <span className='text-sm text-gray-600'>Pet Owner:</span>
                    <p className='font-medium text-gray-900'>{customerInfo.hoTen}</p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Pet Name:</span>
                    <p className='font-medium text-gray-900'>{petDetails?.ten || selectedPetData.name}</p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Examination Time:</span>
                    <p className='font-medium text-gray-900'>
                      {new Date(selectedRecordData.thoiGianKham).toLocaleString('en-US', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Doctor:</span>
                    <p className='font-medium text-gray-900'>{formatDoctorName(selectedRecordData.tenBacSi)}</p>
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className='mb-6 space-y-4'>
                <div>
                  <h3 className='mb-2 font-semibold text-gray-900'>Symptoms</h3>
                  <p className='rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700'>
                    {selectedRecordData.trieuChung}
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 font-semibold text-gray-900'>Diagnosis</h3>
                  <p className='rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700'>
                    {selectedRecordData.chuanDoan}
                  </p>
                </div>
                {selectedRecordData.ngayTaiKham && (
                  <div>
                    <h3 className='mb-2 font-semibold text-gray-900'>Next Visit Date</h3>
                    <p className='rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700'>
                      {new Date(selectedRecordData.ngayTaiKham).toLocaleDateString('en-US')}
                    </p>
                  </div>
                )}
              </div>

              {/* Prescriptions */}
              <div className='mb-6'>
                <h3 className='mb-3 font-semibold text-gray-900'>Prescriptions</h3>
                {isLoadingPrescriptions ? (
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-8 text-center'>
                    <p className='text-sm text-gray-500'>Loading prescriptions...</p>
                  </div>
                ) : prescriptions.length === 0 ? (
                  <div className='rounded-lg border border-gray-200 bg-gray-50 p-8 text-center'>
                    <Package className='mx-auto h-10 w-10 text-gray-400' />
                    <p className='mt-2 text-sm text-gray-500'>No prescriptions for this medical record</p>
                  </div>
                ) : (
                  <div className='space-y-4'>
                    {prescriptions.map((prescription) => (
                      <div key={prescription.idToa} className='rounded-lg border border-gray-200 bg-white p-4'>
                        <div className='mb-3 flex items-center justify-between border-b border-gray-200 pb-3'>
                          <div>
                            <p className='font-semibold text-gray-900'>{prescription.maToa}</p>
                            <p className='text-sm text-gray-600'>
                              {new Date(prescription.thoiGianKham).toLocaleString('en-US', {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit',
                                hour: '2-digit',
                                minute: '2-digit'
                              })}
                            </p>
                          </div>
                          <div className='flex items-center gap-2'>
                            <Package className='h-5 w-5 text-orange-600' />
                            <span className='text-sm font-medium text-gray-600'>
                              {prescription.toaSanPhamList.length} item
                              {prescription.toaSanPhamList.length !== 1 ? 's' : ''}
                            </span>
                          </div>
                        </div>
                        <div className='space-y-2'>
                          {prescription.toaSanPhamList.length > 0 ? (
                            <>
                              {/* Table Header */}
                              <div className='grid grid-cols-12 gap-2 border-b border-gray-200 pb-2 text-xs font-semibold text-gray-700'>
                                <div className='col-span-5'>Product Name</div>
                                <div className='col-span-2 text-center'>Quantity</div>
                                <div className='col-span-2 text-right'>Unit Price</div>
                                <div className='col-span-3 text-right'>Total</div>
                              </div>
                              {/* Table Rows */}
                              {prescription.toaSanPhamList.map((item) => (
                                <div key={item.idSanPham} className='grid grid-cols-12 gap-2 py-2 text-sm'>
                                  <div className='col-span-5 text-gray-900'>{item.tenSanPham}</div>
                                  <div className='col-span-2 text-center text-gray-600'>{item.soLuong}</div>
                                  <div className='col-span-2 text-right text-gray-600'>
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                    }).format(item.donGia)}
                                  </div>
                                  <div className='col-span-3 text-right font-medium text-gray-900'>
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                    }).format(item.thanhTien)}
                                  </div>
                                </div>
                              ))}
                              {/* Total */}
                              <div className='mt-2 border-t border-gray-200 pt-2'>
                                <div className='flex justify-between'>
                                  <span className='font-semibold text-gray-900'>Total Amount:</span>
                                  <span className='font-bold text-orange-600'>
                                    {new Intl.NumberFormat('vi-VN', {
                                      style: 'currency',
                                      currency: 'VND'
                                    }).format(
                                      prescription.toaSanPhamList.reduce((sum, item) => sum + item.thanhTien, 0)
                                    )}
                                  </span>
                                </div>
                              </div>
                            </>
                          ) : (
                            <p className='py-2 text-center text-sm text-gray-500'>No products in this prescription</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Prescription Pagination */}
                {!isLoadingPrescriptions && prescriptionsTotalPages > 1 && (
                  <div className='mt-4 flex justify-center'>
                    <Pagination
                      currentPage={prescriptionPage}
                      totalPages={prescriptionsTotalPages}
                      onPageChange={setPrescriptionPage}
                    />
                  </div>
                )}

                {!isLoadingPrescriptions && prescriptionsTotalElements > 0 && (
                  <p className='mt-2 text-center text-xs text-gray-500'>
                    Showing {prescriptions.length} of {prescriptionsTotalElements} prescription
                    {prescriptionsTotalElements !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className='rounded-b-lg border-t border-gray-200 bg-gray-50 p-6'>
              <button
                onClick={() => setSelectedRecord(null)}
                className='w-full cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto'
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedPet && (
        <div className='mt-6 rounded-lg border border-gray-200 bg-white py-12 text-center'>
          <Search className='mx-auto h-12 w-12 text-gray-400' />
          <h3 className='mt-4 text-sm font-medium text-gray-900'>Select Pet</h3>
          <p className='mt-2 text-sm text-gray-500'>Please select an owner and pet to view detailed information</p>
        </div>
      )}
    </div>
  );
};

export default PetLookup;
