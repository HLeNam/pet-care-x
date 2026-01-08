import { X, AlertTriangle } from 'lucide-react';
import type { Pet } from '~/types/pet.type';

interface DeleteConfirmModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => Promise<void>;
    pet: Pet | null;
    isDeleting: boolean;
}

const DeleteConfirmModal = ({ isOpen, onClose, onConfirm, pet, isDeleting }: DeleteConfirmModalProps) => {
    if (!isOpen || !pet) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='w-full max-w-md rounded-lg bg-white shadow-xl'>
                {/* Header */}
                <div className='flex items-center justify-between border-b p-6'>
                    <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-red-100'>
                            <AlertTriangle className='h-5 w-5 text-red-600' />
                        </div>
                        <h2 className='text-xl font-semibold text-gray-800'>Delete Pet</h2>
                    </div>
                    <button
                        onClick={onClose}
                        className='rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600'
                        disabled={isDeleting}
                    >
                        <X className='h-5 w-5' />
                    </button>
                </div>

                {/* Content */}
                <div className='p-6'>
                    <p className='text-gray-600'>
                        Are you sure you want to delete <span className='font-semibold text-gray-800'>{pet.name}</span>?
                    </p>
                    <p className='mt-2 text-sm text-gray-500'>
                        This action cannot be undone. All information about this pet will be permanently removed.
                    </p>

                    {/* Pet Info Summary */}
                    <div className='mt-4 rounded-lg bg-gray-50 p-4'>
                        <div className='flex items-center gap-4'>
                            <img
                                src={'/assets/images/single_dog.png'}
                                alt={pet.name}
                                className='h-16 w-16 rounded-lg object-cover'
                                onError={(e) => {
                                    e.currentTarget.style.display = 'none';
                                }}
                            />
                            <div className='flex-1'>
                                <p className='font-medium text-gray-800'>{pet.name}</p>
                                <p className='text-sm text-gray-600'>
                                    {pet.species} • {pet.breed}
                                </p>
                                <p className='text-sm text-gray-500'>
                                    {pet.birth_date}
                                </p>
                                <p className='mt-4 text-sm text-gray-500'>
                                    {pet.health_status}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className='flex gap-3 border-t bg-gray-50 p-6'>
                    <button
                        type='button'
                        onClick={onClose}
                        className='flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50'
                        disabled={isDeleting}
                    >
                        Cancel
                    </button>
                    <button
                        type='button'
                        onClick={onConfirm}
                        className='flex-1 rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50'
                        disabled={isDeleting}
                    >
                        {isDeleting ? 'Deleting...' : 'Delete Pet'}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default DeleteConfirmModal;
