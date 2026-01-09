import {
  Search,
  FileText,
  PlusCircle,
  User,
  Phone,
  Calendar,
  Stethoscope,
  Tag,
  CalendarDays,
  HeartPulse
} from 'lucide-react';
import { useState } from 'react';
import type { Pet } from '~/types/pet.type';
import MedicalRecordModal from '../../components/MedicalRecordModal/MedicalRecordModal';
import type { MedicalRecord, MedicalRecordFormData } from '~/types/medical.type';

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
    nextAppointment: 'Tái khám sau 7 ngày (27/12/2025) để kiểm tra tình trạng viêm nhiễm',
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
    nextAppointment: 'Tiêm mũi tăng cường sau 3 tuần (06/12/2025)',
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
    nextAppointment: 'Theo dõi tại nhà, nếu không cải thiện sau 3 ngày thì tái khám',
    notes: 'Nghi ngờ do ăn phải thức ăn không phù hợp. Khuyến cáo chỉ cho ăn thức ăn chuyên dụng.'
  }
];

const PetRecords = () => {
  const [selectedOwner, setSelectedOwner] = useState<number | null>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedOwnerData = mockOwners.find((o) => o.id === selectedOwner);
  const filteredPets = mockPets.filter((p) => p.owner_id === selectedOwner);

  const handleOwnerChange = (ownerId: number | null) => {
    setSelectedOwner(ownerId);
    setSelectedPet(null);
  };

  const handlePetChange = (petId: number | null) => {
    const pet = mockPets.find((p) => p.pet_id === petId);
    setSelectedPet(pet || null);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveMedicalRecord = (data: MedicalRecordFormData) => {
    console.log('Saving medical record:', data);
    // TODO: Implement API call to save medical record
    alert('Medical record saved successfully!');
    handleCloseModal();
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
        <div className='grid gap-4 md:grid-cols-2'>
          {/* Owner Selection */}
          <div>
            <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
              <Phone className='h-4 w-4' />
              Select Owner (by Phone)
            </label>
            <select
              value={selectedOwner || ''}
              onChange={(e) => handleOwnerChange(Number(e.target.value) || null)}
              className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
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
            <label className='mb-2 flex items-center gap-2 text-sm font-medium text-gray-700'>
              <Tag className='h-4 w-4' />
              Select Pet
            </label>
            <select
              value={selectedPet?.pet_id || ''}
              onChange={(e) => handlePetChange(Number(e.target.value) || null)}
              disabled={!selectedOwner}
              className='w-full rounded-lg border border-gray-300 px-4 py-2.5 text-sm transition-colors focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
            >
              <option value=''>-- Select Pet --</option>
              {filteredPets.map((pet) => (
                <option key={pet.pet_id} value={pet.pet_id}>
                  {pet.name} - {pet.species}
                </option>
              ))}
            </select>
          </div>
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
                    <span className='font-medium'>Tên:</span>
                  </div>
                  <p className='ml-6 font-semibold text-gray-900'>{selectedPet.name}</p>
                </div>

                <div>
                  <div className='flex items-center gap-2 text-sm text-gray-600'>
                    <Stethoscope className='h-4 w-4' />
                    <span className='font-medium'>Giống:</span>
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
                onClick={handleOpenModal}
                className='flex items-center gap-2 rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600'
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
                              <span className='font-medium'>Symptoms:</span> {record.symptoms}
                            </p>
                            <p>
                              <span className='font-medium'>Diagnosis:</span> {record.diagnosis}
                            </p>
                            <p>
                              <span className='font-medium'>Treatment:</span> {record.treatment}
                            </p>
                            <p className='flex items-center gap-1'>
                              <CalendarDays className='h-3.5 w-3.5' />
                              <span className='font-medium'>Follow-up:</span> {record.nextAppointment}
                            </p>
                          </div>
                        </div>
                      </div>
                      <button className='text-sm font-medium text-orange-600 hover:text-orange-700'>Details</button>
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
          <p className='mt-2 text-sm text-gray-500'>Please select an owner and a pet to view medical records</p>
        </div>
      )}

      {/* Medical Record Modal */}
      <MedicalRecordModal
        isOpen={isModalOpen}
        petName={selectedPet?.name}
        onClose={handleCloseModal}
        onSave={handleSaveMedicalRecord}
      />
    </div>
  );
};

export default PetRecords;
