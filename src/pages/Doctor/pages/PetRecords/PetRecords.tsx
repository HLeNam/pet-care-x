import {
  Search,
  FileText,
  PlusCircle,
  User,
  Phone,
  Calendar,
  Tag,
  CalendarDays,
  HeartPulse,
  PawPrint
} from 'lucide-react';
import { useState } from 'react';
import type { Pet } from '~/types/pet.type';
import MedicalRecordModal from '../../components/MedicalRecordModal/MedicalRecordModal';
import type { MedicalRecord, MedicalRecordFormData } from '~/types/medical.type';
import MedicalDetailModal from '~/pages/User/pages/Profile/MedicalHistory/components/MedicalDetailModal';

// Temporary mock data
const mockOwners = [
  { id: 1, name: 'Nguyễn Văn A', phone: '0901234567' },
  { id: 2, name: 'Trần Thị B', phone: '0902345678' },
  { id: 3, name: 'Lê Văn C', phone: '0903456789' }
];

const mockPets: Pet[] = [
  {
    pet_id: 1,
    pet_code: 'PET001',
    name: 'Milu',
    owner_id: 1,
    species: 'Dog',
    gender: 'Female',
    breed: 'Golden Retriever',
    birth_date: '2020-05-15',
    health_status: 'Healthy'
  },
  {
    pet_id: 2,
    pet_code: 'PET002',
    name: 'Lucky',
    owner_id: 2,
    species: 'Cat',
    gender: 'Male',
    breed: 'British Shorthair',
    birth_date: '2019-08-22',
    health_status: 'Vaccinated'
  },
  {
    pet_id: 3,
    pet_code: 'PET003',
    name: 'Coco',
    owner_id: 3,
    species: 'Dog',
    gender: 'Female',
    breed: 'Poodle',
    birth_date: '2022-03-10',
    health_status: 'Healthy'
  }
];

const mockMedicalRecords: MedicalRecord[] = [
  {
    id: 1,
    petName: 'Milo',
    date: '2025-12-20',
    doctor: 'BS. Nguyễn Văn A',
    diagnosis: 'Viêm tai ngoài',
    treatment: 'Sử dụng thuốc nhỏ tai, vệ sinh tai định kỳ 2 lần/ngày',
    cost: 250000,
    symptoms: 'Ngứa tai liên tục, rung đầu, có mùi hôi ở vùng tai, tiết dịch màu vàng nâu',
    prescriptions: [
      'Thuốc nhỏ tai Otomax - 3 giọt/lần, 2 lần/ngày trong 7 ngày',
      'Viên kháng sinh Cephalexin 500mg - 1 viên/ngày sau ăn trong 5 ngày',
      'Dung dịch rửa tai Epi-Otic - Rửa tai 1 lần/ngày trước khi nhỏ thuốc'
    ],
    nextAppointment: '2025-12-27',
    notes: 'Tránh để nước vào tai trong quá trình điều trị. Nếu thấy triệu chứng nặng hơn, liên hệ ngay với phòng khám.'
  },
  {
    id: 2,
    petName: 'Lucky',
    date: '2025-11-15',
    doctor: 'BS. Trần Thị B',
    diagnosis: 'Tiêm phòng định kỳ',
    treatment: 'Tiêm vaccine 6 bệnh (Distemper, Parvo, Hepatitis, Parainfluenza, Corona, Leptospirosis)',
    cost: 150000,
    symptoms: 'Không có triệu chứng - Khám sức khỏe định kỳ',
    prescriptions: ['Không có đơn thuốc', 'Theo dõi trong 24h sau tiêm, có thể có sốt nhẹ, mệt mỏi'],
    nextAppointment: '2025-12-06',
    notes: 'Thú cưng khỏe mạnh, phản ứng tốt với vaccine. Tiếp tục chế độ dinh dưỡng hiện tại.'
  },
  {
    id: 3,
    petName: 'Coco',
    date: '2025-10-10',
    doctor: 'BS. Lê Văn C',
    diagnosis: 'Rối loạn tiêu hóa',
    treatment: 'Điều chỉnh chế độ ăn, bổ sung men vi sinh',
    cost: 180000,
    symptoms: 'Tiêu chảy nhẹ, ăn kém, nôn 2-3 lần trong ngày',
    prescriptions: [
      'Men vi sinh Bio-Three - 1 gói/lần, 2 lần/ngày sau ăn',
      'Smecta - 1/2 gói/lần, 3 lần/ngày',
      'Thức ăn dạng nhuyễn trong 3 ngày đầu'
    ],
    nextAppointment: '2025-10-13',
    notes: 'Nghi ngờ do ăn phải thức ăn không phù hợp. Khuyến cáo chỉ cho ăn thức ăn chuyên dụng.'
  }
];

const PetRecords = () => {
  const [phoneInput, setPhoneInput] = useState('');
  const [selectedOwner, setSelectedOwner] = useState<number | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isNewRecordModalOpen, setIsNewRecordModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);
  const [isSearching, setIsSearching] = useState(false);

  const selectedOwnerData = mockOwners.find((o) => o.id === selectedOwner);
  const filteredPets = mockPets.filter((p) => p.owner_id === selectedOwner);

  const handleSearch = async () => {
    if (!phoneInput.trim()) {
      alert('Please enter a phone number');
      return;
    }

    setIsSearching(true);
    try {
      // TODO: Replace with actual API call
      // const response = await api.searchOwnerByPhone(phoneInput);

      // Mock API call - simulate finding owner
      setTimeout(() => {
        const owner = mockOwners.find((o) => o.phone === phoneInput);
        if (owner) {
          setSelectedOwner(owner.id);
          setSelectedPet(null);
        } else {
          alert('No owner found with this phone number');
          setSelectedOwner(null);
          setSelectedPet(null);
        }
        setIsSearching(false);
      }, 500);
    } catch (error) {
      console.error('Search error:', error);
      alert('Error searching for owner');
      setIsSearching(false);
    }
  };

  const handleReset = () => {
    setPhoneInput('');
    setSelectedOwner(null);
    setSelectedPet(null);
  };

  const handlePetChange = (petId: number | null) => {
    const pet = mockPets.find((p) => p.pet_id === petId);
    setSelectedPet(pet || null);
  };

  const handleOpenNewRecordModal = () => {
    setIsNewRecordModalOpen(true);
  };

  const handleCloseNewRecordModal = () => {
    setIsNewRecordModalOpen(false);
  };

  const handleOpenViewDetailsModal = (record: MedicalRecord) => {
    setSelectedRecord(record);
    setIsDetailModalOpen(true);
  };

  const handleCloseViewDetailsModal = () => {
    setIsDetailModalOpen(false);
    setTimeout(() => setSelectedRecord(null), 300);
  };

  const handleSaveMedicalRecord = (data: MedicalRecordFormData) => {
    console.log('Saving medical record:', data);
    // TODO: Implement API call to save medical record
    alert('Medical record saved successfully!');
    handleCloseNewRecordModal();
  };

  const calculateAge = (birthDate: string): number => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
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
              {selectedOwner && (
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
          {selectedOwner && selectedOwnerData && (
            <div className='rounded-lg border border-orange-200 bg-orange-50 p-4'>
              <div className='mb-3 flex items-center gap-2'>
                <User className='h-5 w-5 text-orange-600' />
                <h3 className='font-semibold text-gray-900'>Owner Found</h3>
              </div>
              <div className='mb-4 grid gap-2 text-sm'>
                <div className='flex items-center gap-2'>
                  <span className='font-medium text-gray-700'>Name:</span>
                  <span className='text-gray-900'>{selectedOwnerData.name}</span>
                </div>
                <div className='flex items-center gap-2'>
                  <Phone className='h-4 w-4 text-gray-500' />
                  <span className='font-medium text-gray-700'>Phone:</span>
                  <span className='text-gray-900'>{selectedOwnerData.phone}</span>
                </div>
              </div>

              <div>
                <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
                  <Tag className='h-4 w-4' />
                  Select Pet
                </label>
                <select
                  value={selectedPet?.pet_id || ''}
                  onChange={(e) => handlePetChange(Number(e.target.value) || null)}
                  className='w-full rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
                >
                  <option value=''>-- Select Pet --</option>
                  {filteredPets.map((pet) => (
                    <option key={pet.pet_id} value={pet.pet_id}>
                      {pet.name} - {pet.species} - {pet.breed}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Pet Details & Medical Records */}
      {selectedPet && (
        <div className='space-y-6'>
          {/* Pet Information Card */}
          <div className='rounded-lg border border-gray-200 bg-white p-6 shadow-sm'>
            <div className='mb-4 flex items-center justify-between'>
              <h2 className='text-lg font-semibold text-gray-900'>Pet Information</h2>
              <span className='rounded-full bg-orange-100 px-3 py-1 text-xs font-medium text-orange-700'>
                {selectedPet.pet_code}
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
                  <p className='ml-6 font-semibold text-gray-900'>{selectedPet.name}</p>
                </div>

                <div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <PawPrint className='h-4 w-4' />
                    <span className='font-medium'>Species:</span>
                  </div>
                  <p className='ml-6 font-semibold text-gray-900'>{selectedPet.species}</p>
                </div>
              </div>

              <div className='space-y-3'>
                <div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Tag className='h-4 w-4' />
                    <span className='font-medium'>Breed:</span>
                  </div>
                  <p className='ml-6 font-semibold text-gray-900'>{selectedPet.breed}</p>
                </div>

                <div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <CalendarDays className='h-4 w-4' />
                    <span className='font-medium'>Age:</span>
                  </div>
                  <p className='ml-6 font-semibold text-gray-900'>
                    {calculateAge(selectedPet.birth_date)} years ({selectedPet.birth_date})
                  </p>
                </div>
              </div>

              <div className='space-y-3'>
                <div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <User className='h-4 w-4' />
                    <span className='font-medium'>Gender:</span>
                  </div>
                  <p className='ml-6 font-semibold text-gray-900'>{selectedPet.gender}</p>
                </div>

                <div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <HeartPulse className='h-4 w-4' />
                    <span className='font-medium'>Health Status:</span>
                  </div>
                  <p className='ml-6 font-semibold text-gray-900'>{selectedPet.health_status}</p>
                </div>
              </div>
            </div>

            {/* Owner Info */}
            {selectedOwnerData && (
              <div className='mt-4 border-t border-gray-200 pt-4'>
                <div className='flex items-center gap-2 text-sm text-gray-600'>
                  <User className='h-4 w-4' />
                  <span className='font-medium'>Owner:</span>
                </div>
                <div className='mt-1 ml-6 flex items-center gap-4'>
                  <span className='font-semibold text-gray-900'>{selectedOwnerData.name}</span>
                  <span className='flex items-center gap-1 text-gray-600'>
                    <Phone className='h-3.5 w-3.5' />
                    {selectedOwnerData.phone}
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
                onClick={handleOpenNewRecordModal}
                className='flex cursor-pointer items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600'
              >
                <PlusCircle className='h-4 w-4' />
                Create New Medical Record
              </button>
            </div>

            <div className='space-y-3'>
              {mockMedicalRecords.length > 0 ? (
                mockMedicalRecords.map((record) => (
                  <div
                    key={record.id}
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
                              Visit date: {new Date(record.date).toLocaleDateString('en-US')}
                            </p>
                          </div>
                          <div className='space-y-1 text-sm text-gray-600'>
                            <p>
                              <span className='font-semibold'>Symptoms:</span> {record.symptoms}
                            </p>
                            <p>
                              <span className='font-semibold'>Diagnosis:</span> {record.diagnosis}
                            </p>
                            <p>
                              <span className='font-semibold'>Treatment:</span> {record.treatment}
                            </p>
                            <p className='flex items-center gap-1'>
                              <span className='font-semibold'>Follow-up:</span> {record.nextAppointment}
                            </p>
                            {record.notes && (
                              <p>
                                <span className='font-semibold'>Note:</span>{' '}
                                {record.notes.length > 100 ? `${record.notes.substring(0, 100)}...` : record.notes}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleOpenViewDetailsModal(record)}
                        className='cursor-pointer text-sm font-medium text-orange-600 hover:text-orange-700'
                      >
                        Details
                      </button>
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
          </div>
        </div>
      )}

      {/* Empty State */}
      {!selectedPet && (
        <div className='rounded-lg border border-gray-200 bg-white py-16 text-center shadow-sm'>
          <Search className='mx-auto h-16 w-16 text-gray-400' />
          <h3 className='mt-4 text-lg font-medium text-gray-900'>No pet selected</h3>
          <p className='mt-2 text-sm text-gray-500'>
            {selectedOwner
              ? 'Please select a pet to view medical records'
              : 'Search for an owner by phone number to get started'}
          </p>
        </div>
      )}

      {/* Medical Record Modal */}
      <MedicalRecordModal
        isOpen={isNewRecordModalOpen}
        petName={selectedPet?.name}
        onClose={handleCloseNewRecordModal}
        onSave={handleSaveMedicalRecord}
      />

      <MedicalDetailModal isOpen={isDetailModalOpen} onClose={handleCloseViewDetailsModal} record={selectedRecord} />
    </div>
  );
};

export default PetRecords;
