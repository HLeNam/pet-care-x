import { useState } from 'react';
import { Search, FileText, User, Phone, Calendar, X, Pill } from 'lucide-react';

// Mock data
const mockOwners = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567' },
  { id: 2, name: 'Trần Thị B', phone: '0912345678' },
  { id: 3, name: 'Lê Văn C', phone: '0923456789' }
];

const mockPets = [
  {
    id: 1,
    name: 'Milo',
    ownerId: 1,
    species: 'Chó',
    breed: 'Golden Retriever',
    age: 3,
    gender: 'Đực',
    birthDate: '2021-05-15',
    healthStatus: 'Khỏe mạnh'
  },
  {
    id: 2,
    name: 'Luna',
    ownerId: 1,
    species: 'Mèo',
    breed: 'British Shorthair',
    age: 2,
    gender: 'Cái',
    birthDate: '2022-08-20',
    healthStatus: 'Khỏe mạnh'
  },
  {
    id: 3,
    name: 'Max',
    ownerId: 2,
    species: 'Chó',
    breed: 'Poodle',
    age: 4,
    gender: 'Đực',
    birthDate: '2020-12-10',
    healthStatus: 'Khỏe mạnh'
  },
  {
    id: 4,
    name: 'Bella',
    ownerId: 3,
    species: 'Mèo',
    breed: 'Persian',
    age: 1,
    gender: 'Cái',
    birthDate: '2023-03-05',
    healthStatus: 'Khỏe mạnh'
  }
];

const mockMedicalRecords = [
  {
    id: 1,
    petId: 1,
    date: '2025-12-20',
    doctorName: 'BS. Nguyễn Văn A',
    symptoms: 'Nôn mửa, tiêu chảy',
    diagnosis: 'Viêm dạ dày',
    nextVisit: '2026-01-15'
  },
  {
    id: 2,
    petId: 1,
    date: '2025-11-15',
    doctorName: 'BS. Trần Thị B',
    symptoms: 'Ho, sổ mũi',
    diagnosis: 'Cảm lạnh',
    nextVisit: '2025-11-25'
  },
  {
    id: 3,
    petId: 2,
    date: '2025-12-10',
    doctorName: 'BS. Lê Văn C',
    symptoms: 'Ngứa da, rụng lông',
    diagnosis: 'Dị ứng',
    nextVisit: '2026-01-10'
  }
];

const mockPrescriptions = [
  { id: 1, recordId: 1, medicineName: 'Amoxicillin', quantity: 2, unit: 'viên/ngày', duration: '7 ngày' },
  { id: 2, recordId: 1, medicineName: 'Probiotics', quantity: 1, unit: 'gói/ngày', duration: '5 ngày' },
  { id: 3, recordId: 2, medicineName: 'Cục Hạ ', quantity: 1, unit: 'viên/ngày', duration: '5 ngày' },
  { id: 4, recordId: 2, medicineName: 'Vitamin C', quantity: 1, unit: 'viên/ngày', duration: '7 ngày' },
  { id: 5, recordId: 3, medicineName: 'Thuốc chống dị ứng', quantity: 1, unit: 'viên/ngày', duration: '10 ngày' },
  { id: 6, recordId: 3, medicineName: 'Thuốc bôi da', quantity: 2, unit: 'lần/ngày', duration: '14 ngày' }
];

const PetLookup = () => {
  const [ownerPhone, setOwnerPhone] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<number | null>(null);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);
  const [isLoadingOwner, setIsLoadingOwner] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<number | null>(null);

  const selectedOwnerData = mockOwners.find((o) => o.id === selectedOwner);
  const filteredPets = mockPets.filter((p) => p.ownerId === selectedOwner);
  const selectedPetData = mockPets.find((p) => p.id === selectedPet);
  const petMedicalRecords = mockMedicalRecords.filter((r) => r.petId === selectedPet);
  const selectedRecordData = mockMedicalRecords.find((r) => r.id === selectedRecord);
  const recordPrescriptions = mockPrescriptions.filter((p) => p.recordId === selectedRecord);

  const handlePhoneSearch = () => {
    if (!ownerPhone.trim()) return;

    setIsLoadingOwner(true);
    setSelectedOwner(null);
    setSelectedPet(null);

    // Simulate API call
    setTimeout(() => {
      const owner = mockOwners.find((o) => o.phone === ownerPhone.trim());
      if (owner) {
        setSelectedOwner(owner.id);
      }
      setIsLoadingOwner(false);
    }, 500);
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
                className='flex items-center gap-2 rounded-lg bg-orange-600 px-4 py-2.5 font-medium text-white transition-colors hover:bg-orange-700 disabled:cursor-not-allowed disabled:bg-gray-400'
              >
                <Search className='h-4 w-4' />
                Search
              </button>
            </div>
            {isLoadingOwner && <p className='mt-2 text-sm text-gray-500'>Searching...</p>}
            {!isLoadingOwner && selectedOwner && selectedOwnerData && (
              <p className='mt-2 text-sm text-green-600'>
                Owner: {selectedOwnerData.name} ({selectedOwnerData.phone})
              </p>
            )}
            {!isLoadingOwner && ownerPhone.trim() && !selectedOwner && ownerPhone && (
              <p className='mt-2 text-sm text-red-600'>Owner not found</p>
            )}
            {isLoadingOwner && <p className='mt-2 text-sm text-gray-500'>Loading...</p>}
          </div>

          {/* Pet Selection */}
          <div>
            <label htmlFor='pet' className='mb-2 block text-sm font-medium text-gray-700'>
              Select Pet <span className='text-red-500'>*</span>
            </label>
            <select
              id='pet'
              value={selectedPet || ''}
              onChange={(e) => setSelectedPet(Number(e.target.value) || null)}
              disabled={!selectedOwner || isLoadingOwner}
              className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
            >
              <option value=''>-- Select Pet --</option>
              {filteredPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} - {pet.species}
                </option>
              ))}
            </select>
            {selectedOwner && filteredPets.length > 0 && !isLoadingOwner && (
              <p className='mt-2 text-sm text-green-600'>{filteredPets.length} pets available</p>
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
            <div className='grid gap-4 md:grid-cols-3'>
              <div>
                <span className='text-sm text-gray-600'>Name:</span>
                <p className='font-medium text-gray-900'>{selectedPetData.name}</p>
              </div>
              <div>
                <span className='text-sm text-gray-600'>Species:</span>
                <p className='font-medium text-gray-900'>{selectedPetData.species}</p>
              </div>
              <div>
                <span className='text-sm text-gray-600'>Breed:</span>
                <p className='font-medium text-gray-900'>{selectedPetData.breed}</p>
              </div>
              <div>
                <span className='text-sm text-gray-600'>Age:</span>
                <p className='font-medium text-gray-900'>{selectedPetData.age} years old</p>
              </div>
              <div>
                <span className='text-sm text-gray-600'>Gender:</span>
                <p className='font-medium text-gray-900'>{selectedPetData.gender}</p>
              </div>
              <div>
                <span className='text-sm text-gray-600'>Birth Date:</span>
                <p className='font-medium text-gray-900'>
                  {new Date(selectedPetData.birthDate).toLocaleDateString('vi-VN')}
                </p>
              </div>
              <div>
                <span className='text-sm text-gray-600'>Health Status:</span>
                <p className='font-medium text-gray-900'>{selectedPetData.healthStatus}</p>
              </div>
            </div>
            {selectedOwnerData && (
              <div className='mt-4 border-t border-gray-200 pt-4'>
                <span className='mb-2 block text-sm text-gray-600'>Owner:</span>
                <div className='flex flex-wrap items-center gap-4'>
                  <div className='flex items-center gap-2'>
                    <User className='h-4 w-4 text-gray-400' />
                    <span className='font-medium text-gray-900'>{selectedOwnerData.name}</span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <Phone className='h-4 w-4 text-gray-400' />
                    <span className='text-gray-600'>{selectedOwnerData.phone}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Medical Records */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>Medical History</h2>
              <span className='text-sm text-gray-500'>{petMedicalRecords.length} records</span>
            </div>

            {petMedicalRecords.length === 0 ? (
              <div className='py-8 text-center'>
                <FileText className='mx-auto h-12 w-12 text-gray-400' />
                <h3 className='mt-4 text-sm font-medium text-gray-900'>No Medical History</h3>
                <p className='mt-2 text-sm text-gray-500'>This pet has no medical records yet</p>
              </div>
            ) : (
              <div className='space-y-3'>
                {petMedicalRecords.map((record) => (
                  <div
                    key={record.id}
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
                              {new Date(record.date).toLocaleDateString('vi-VN')}
                            </span>
                            <span className='text-gray-400'>•</span>
                            <span className='text-gray-600'>{record.doctorName}</span>
                          </div>
                          <p className='mt-1 text-sm text-gray-600'>
                            <span className='font-medium'>Symptoms:</span> {record.symptoms}
                          </p>
                          <p className='mt-1 text-sm text-gray-600'>
                            <span className='font-medium'>Diagnosis:</span> {record.diagnosis}
                          </p>
                          <p className='mt-1 text-sm text-gray-600'>
                            <span className='font-medium'>Next Visit:</span>{' '}
                            {new Date(record.nextVisit).toLocaleDateString('vi-VN')}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedRecord(record.id)}
                        className='text-sm font-medium text-orange-600 hover:text-orange-700'
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Medical Record Detail Modal */}
      {selectedRecord && selectedRecordData && selectedPetData && selectedOwnerData && (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
          <div className='flex max-h-[90vh] w-full max-w-3xl flex-col rounded-lg bg-white'>
            {/* Modal Header - Fixed */}
            <div className='flex items-center justify-between rounded-t-lg border-b border-gray-200 bg-white p-6'>
              <h2 className='text-xl font-bold text-gray-900'>Medical Record Details</h2>
              <button
                onClick={() => setSelectedRecord(null)}
                className='rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
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
                    <span className='text-sm text-gray-600'>Owner Name:</span>
                    <p className='font-medium text-gray-900'>{selectedOwnerData.name}</p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Pet Name:</span>
                    <p className='font-medium text-gray-900'>{selectedPetData.name}</p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Visit Date:</span>
                    <p className='font-medium text-gray-900'>
                      {new Date(selectedRecordData.date).toLocaleDateString('vi-VN')}
                    </p>
                  </div>
                  <div>
                    <span className='text-sm text-gray-600'>Doctor:</span>
                    <p className='font-medium text-gray-900'>{selectedRecordData.doctorName}</p>
                  </div>
                </div>
              </div>

              {/* Medical Details */}
              <div className='mb-6 space-y-4'>
                <div>
                  <h3 className='mb-2 font-semibold text-gray-900'>Symptoms</h3>
                  <p className='rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700'>
                    {selectedRecordData.symptoms}
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 font-semibold text-gray-900'>Diagnosis</h3>
                  <p className='rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700'>
                    {selectedRecordData.diagnosis}
                  </p>
                </div>
                <div>
                  <h3 className='mb-2 font-semibold text-gray-900'>Next Visit Date</h3>
                  <p className='rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700'>
                    {new Date(selectedRecordData.nextVisit).toLocaleDateString('vi-VN')}
                  </p>
                </div>
              </div>

              {/* Prescription */}
              <div>
                <h3 className='mb-3 font-semibold text-gray-900'>Prescription</h3>
                {recordPrescriptions.length === 0 ? (
                  <p className='rounded-lg border border-gray-200 bg-gray-50 p-4 text-center text-sm text-gray-500'>
                    No prescription
                  </p>
                ) : (
                  <div className='rounded-lg border border-gray-200'>
                    <table className='w-full'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Medicine Name</th>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Dosage</th>
                          <th className='px-4 py-3 text-left text-sm font-semibold text-gray-900'>Duration</th>
                        </tr>
                      </thead>
                      <tbody className='divide-y divide-gray-200'>
                        {recordPrescriptions.map((prescription) => (
                          <tr key={prescription.id} className='hover:bg-gray-50'>
                            <td className='px-4 py-3'>
                              <div className='flex items-center gap-2'>
                                <Pill className='h-4 w-4 text-orange-500' />
                                <span className='text-sm font-medium text-gray-900'>{prescription.medicineName}</span>
                              </div>
                            </td>
                            <td className='px-4 py-3 text-sm text-gray-700'>
                              {prescription.quantity} {prescription.unit}
                            </td>
                            <td className='px-4 py-3 text-sm text-gray-700'>{prescription.duration}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>

            {/* Modal Footer - Fixed */}
            <div className='rounded-b-lg border-t border-gray-200 bg-gray-50 p-6'>
              <button
                onClick={() => setSelectedRecord(null)}
                className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50 sm:w-auto'
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
