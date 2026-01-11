import { useState } from 'react';
import { toast } from 'react-toastify';
import { usePetList, useCreatePet, useUpdatePet, useDeletePet } from '~/hooks/usePetManagement';
import { useAppContext } from '~/contexts';
import type { Pet, PetFormInput } from '~/types/pet.type';
import DeleteConfirmModal from './components/DeleteConfirmModal';
import PetCard from './components/PetCard';
import PetFormModal from './components/PetFormModal';
import { Plus } from 'lucide-react';

type ModalMode = 'create' | 'edit' | 'delete' | null;

const PetManagement = () => {
  const { profile } = useAppContext();
  const { pets, isLoading } = usePetList({ pageNo: 1, pageSize: 100 });
  const createPetMutation = useCreatePet();
  const updatePetMutation = useUpdatePet();
  const deletePetMutation = useDeletePet();

  const [modalMode, setModalMode] = useState<ModalMode>(null);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedPet(null);
    setModalMode('create');
  };

  const handleOpenEditModal = (pet: Pet) => {
    setSelectedPet(pet);
    setModalMode('edit');
  };

  const handleOpenDeleteModal = (petId: number) => {
    const pet = pets.find((p) => p.pet_id === petId);
    if (pet) {
      setSelectedPet(pet);
      setModalMode('delete');
    }
  };

  const handleCloseModal = () => {
    setModalMode(null);
    setSelectedPet(null);
  };

  const handleSubmitForm = async (formData: PetFormInput) => {
    try {
      if (modalMode === 'create') {
        // Create new pet
        await createPetMutation.mutateAsync({
          ten: formData.name,
          loai: formData.species,
          giong: formData.breed,
          gioiTinh: formData.gender,
          ngaySinh: formData.birth_date,
          tinhTrangSucKhoe: formData.health_status,
          idChu: profile!.userId
        });
        toast.success('Pet created successfully!');
      } else if (modalMode === 'edit' && selectedPet) {
        // Update existing pet
        await updatePetMutation.mutateAsync({
          idThuCung: selectedPet.pet_id,
          ten: formData.name,
          loai: formData.species,
          giong: formData.breed,
          gioiTinh: formData.gender,
          ngaySinh: formData.birth_date,
          tinhTrangSucKhoe: formData.health_status
        });
        toast.success('Pet updated successfully!');
      }

      handleCloseModal();
    } catch (error) {
      const errorMessage = (error as Error)?.message || 'Operation failed';
      toast.error(errorMessage);
      throw error;
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedPet) return;

    try {
      await deletePetMutation.mutateAsync({
        idThuCung: selectedPet.pet_id
      });
      toast.success('Pet deleted successfully!');
      handleCloseModal();
    } catch (error) {
      const errorMessage = (error as Error)?.message || 'Failed to delete pet';
      toast.error(errorMessage);
    }
  };

  return (
    <div className='mx-auto max-w-6xl'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <div>
          <h2 className='text-xl font-semibold text-gray-800'>Pet List</h2>
          <p className='mt-1 text-sm text-gray-600'>Manage your pets' information</p>
        </div>
        <button
          onClick={handleOpenCreateModal}
          className='flex cursor-pointer items-center gap-2 rounded-lg bg-lime-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lime-700'
        >
          <Plus className='h-5 w-5' />
          Add Pet
        </button>
      </div>

      {/* Loading State */}
      {isLoading && pets.length === 0 && (
        <div className='flex items-center justify-center rounded-lg bg-white p-12 shadow-md'>
          <div className='text-center'>
            <div className='mx-auto h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-lime-600'></div>
            <p className='mt-4 text-gray-600'>Loading pets...</p>
          </div>
        </div>
      )}

      {/* Pet Cards Grid */}
      {!isLoading && pets.length > 0 && (
        <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
          {pets.map((pet) => (
            <PetCard key={pet.pet_id} pet={pet} onEdit={handleOpenEditModal} onDelete={handleOpenDeleteModal} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!isLoading && pets.length === 0 && (
        <div className='rounded-lg bg-white p-12 text-center shadow-md'>
          <svg className='mx-auto h-16 w-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
            />
          </svg>
          <h3 className='mt-4 text-lg font-medium text-gray-800'>No pets yet</h3>
          <p className='mt-2 text-gray-600'>Get started by adding your first pet</p>
          <button
            onClick={handleOpenCreateModal}
            className='mt-6 cursor-pointer rounded-lg bg-lime-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lime-700'
          >
            Add your first pet
          </button>
        </div>
      )}

      {/* Pet Form Modal (Create/Edit) */}
      <PetFormModal
        isOpen={modalMode === 'create' || modalMode === 'edit'}
        onClose={handleCloseModal}
        onSubmit={handleSubmitForm}
        pet={selectedPet}
        mode={modalMode === 'edit' ? 'edit' : 'create'}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={modalMode === 'delete'}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        pet={selectedPet}
        isDeleting={deletePetMutation.isPending}
      />
    </div>
  );
};

export default PetManagement;
