import { Search, FileText, PlusCircle, User, Phone } from 'lucide-react';
import { useState } from 'react';

// Temporary mock data
const mockOwners = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567' },
  { id: 2, name: 'Trần Thị B', phone: '0902345678' }
];

const mockPets = [
  { id: 1, name: 'Milu', ownerId: 1, species: 'Chó', breed: 'Golden Retriever', age: 3 },
  { id: 2, name: 'Lucky', ownerId: 2, species: 'Mèo', breed: 'Anh lông ngắn', age: 2 }
];

const mockMedicalRecords = [
  {
    id: 1,
    date: '2025-12-20',
    symptoms: 'Nôn mửa, tiêu chảy',
    diagnosis: 'Viêm dạ dày',
    nextVisit: '2026-01-05'
  },
  {
    id: 2,
    date: '2025-11-15',
    symptoms: 'Ho, sổ mũi',
    diagnosis: 'Cảm lạnh',
    nextVisit: '2025-11-25'
  }
];

const PetRecords = () => {
  const [selectedOwner, setSelectedOwner] = useState<number | null>(null);
  const [selectedPet, setSelectedPet] = useState<number | null>(null);

  const selectedOwnerData = mockOwners.find((o) => o.id === selectedOwner);
  const filteredPets = mockPets.filter((p) => p.ownerId === selectedOwner);
  const selectedPetData = mockPets.find((p) => p.id === selectedPet);

  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div>
        <h1 className='text-2xl font-bold text-gray-900'>Pet Records</h1>
        <p className='mt-1 text-sm text-gray-600'>Search and manage pet medical records</p>
      </div>

      {/* Search Section */}
      <div className='rounded-lg border border-gray-200 bg-white p-6'>
        <div className='grid gap-4 md:grid-cols-2'>
          {/* Owner Selection */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>Select Owner (by Phone)</label>
            <select
              value={selectedOwner || ''}
              onChange={(e) => {
                setSelectedOwner(Number(e.target.value) || null);
                setSelectedPet(null);
              }}
              className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
            >
              <option value=''>-- Select Owner --</option>
              {mockOwners.map((owner) => (
                <option key={owner.id} value={owner.id}>
                  {owner.name} - {owner.phone}
                </option>
              ))}
            </select>
          </div>

          {/* Pet Selection */}
          <div>
            <label className='mb-2 block text-sm font-medium text-gray-700'>Select Pet</label>
            <select
              value={selectedPet || ''}
              onChange={(e) => setSelectedPet(Number(e.target.value) || null)}
              disabled={!selectedOwner}
              className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
            >
              <option value=''>-- Select Pet --</option>
              {filteredPets.map((pet) => (
                <option key={pet.id} value={pet.id}>
                  {pet.name} - {pet.species}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pet Details & Medical Records */}
      {selectedPet && selectedPetData && (
        <div className='space-y-6'>
          {/* Pet Information Card */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <h2 className='mb-4 text-lg font-semibold text-gray-900'>Pet Information</h2>
            <div className='grid gap-4 md:grid-cols-2'>
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
            </div>
            {selectedOwnerData && (
              <div className='mt-4 border-t border-gray-200 pt-4'>
                <span className='text-sm text-gray-600'>Owner:</span>
                <div className='mt-1 flex items-center gap-2'>
                  <User className='h-4 w-4 text-gray-400' />
                  <span className='font-medium text-gray-900'>{selectedOwnerData.name}</span>
                  <Phone className='ml-2 h-4 w-4 text-gray-400' />
                  <span className='text-gray-600'>{selectedOwnerData.phone}</span>
                </div>
              </div>
            )}
          </div>

          {/* Medical Records */}
          <div className='rounded-lg border border-gray-200 bg-white p-6'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>Medical History</h2>
              <button className='flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600'>
                <PlusCircle className='h-4 w-4' />
                Create New Record
              </button>
            </div>

            <div className='space-y-3'>
              {mockMedicalRecords.map((record) => (
                <div
                  key={record.id}
                  className='rounded-lg border border-gray-200 bg-gray-50 p-4 transition-colors hover:bg-gray-100'
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                        <FileText className='h-5 w-5 text-orange-600' />
                      </div>
                      <div>
                        <p className='text-sm font-medium text-gray-900'>
                          Visit Date: {new Date(record.date).toLocaleDateString('vi-VN')}
                        </p>
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
                    <button className='text-sm text-orange-600 hover:text-orange-700'>View Details</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedPet && (
        <div className='rounded-lg border border-gray-200 bg-white py-12 text-center'>
          <Search className='mx-auto h-12 w-12 text-gray-400' />
          <h3 className='mt-4 text-sm font-medium text-gray-900'>Select Pet</h3>
          <p className='mt-2 text-sm text-gray-500'>Please select an owner and pet to view records</p>
        </div>
      )}
    </div>
  );
};

export default PetRecords;
