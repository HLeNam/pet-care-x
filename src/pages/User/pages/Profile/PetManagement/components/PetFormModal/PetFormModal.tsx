import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { type PetFormInput, type Pet, PetFormSchema } from '~/types/pet.type';

interface PetFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (data: PetFormInput) => Promise<void>;
    pet?: Pet | null;
    mode: 'create' | 'edit';
}

const defaultValues: PetFormInput = {
    name: '',
    species: 'Dog',
    breed: '',
    gender: 'Male',
    birth_date: '',
    health_status: ''
};

const PetFormModal = ({ isOpen, onClose, onSubmit, pet, mode }: PetFormModalProps) => {
    const [formData, setFormData] = useState<PetFormInput>(defaultValues);
    const [errors, setErrors] = useState<Partial<Record<keyof PetFormInput, string>>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (pet && mode === 'edit') {
            setFormData({
                name: pet.name,
                species: pet.species,
                breed: pet.breed,
                gender: pet.gender,
                birth_date: pet.birth_date,
                health_status: pet.health_status
            });
        } else {
            setFormData(defaultValues);
        }
        setErrors({});
    }, [pet, mode, isOpen]);

    const validateForm = (): boolean => {
        const result = PetFormSchema.safeParse(formData);

        if (!result.success) {
            const fieldErrors: typeof errors = {};
            result.error.errors.forEach((err) => {
                const field = err.path[0] as keyof PetFormInput;
                fieldErrors[field] = err.message;
            });
            setErrors(fieldErrors);
            return false;
        }

        setErrors({});
        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);
        try {
            await onSubmit(formData);
            onClose();
        } catch (error) {
            console.error('Failed to submit pet form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleChange = (field: keyof PetFormInput, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: undefined }));
        }
    };

    if (!isOpen) return null;

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'>
            <div className='w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg bg-white shadow-xl'>
                {/* Header */}
                <div className='sticky top-0 flex items-center justify-between border-b bg-white p-6'>
                    <h2 className='text-xl font-semibold text-gray-800'>
                        {mode === 'create' ? 'Add New Pet' : 'Edit Pet'}
                    </h2>
                    <button
                        onClick={onClose}
                        className='rounded-lg p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 cursor-pointer'
                    >
                        <X className='h-5 w-5' />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className='p-6'>
                    <div className='grid gap-6 md:grid-cols-2'>
                        {/* Pet Name */}
                        <div>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>
                                Pet Name <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                value={formData.name}
                                onChange={(e) => handleChange('name', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${errors.name
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:border-lime-500 focus:ring-lime-200'
                                    }`}
                                placeholder='e.g., Milo'
                            />
                            {errors.name && <p className='mt-1 text-sm text-red-600'>{errors.name}</p>}
                        </div>

                        {/* Species */}
                        <div>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>
                                Species <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                value={formData.species}
                                onChange={(e) => handleChange('species', e.target.value)}
                                className='w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-200'
                                placeholder='e.g., Dog, Cat, Bird'
                            />
                            {errors.species && <p className='mt-1 text-sm text-red-600'>{errors.species}</p>}
                        </div>

                        {/* Breed */}
                        <div>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>
                                Breed <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='text'
                                value={formData.breed}
                                onChange={(e) => handleChange('breed', e.target.value)}
                                className={`w-full rounded-lg border px-4 py-2.5 focus:outline-none focus:ring-2 ${errors.breed
                                    ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                                    : 'border-gray-300 focus:border-lime-500 focus:ring-lime-200'
                                    }`}
                                placeholder='e.g., Golden Retriever'
                            />
                            {errors.breed && <p className='mt-1 text-sm text-red-600'>{errors.breed}</p>}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>
                                Gender <span className='text-red-500'>*</span>
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleChange('gender', e.target.value)}
                                className='w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-200'
                            >
                                <option value='Male'>Male</option>
                                <option value='Female'>Female</option>
                                <option value='Other'>Other</option>
                            </select>
                        </div>

                        {/* Birth Date */}
                        <div>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>
                                Birth Date <span className='text-red-500'>*</span>
                            </label>
                            <input
                                type='date'
                                value={formData.birth_date}
                                onChange={(e) => handleChange('birth_date', e.target.value)}
                                className='w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-lime-500 focus:ring-2 focus:ring-lime-200'
                            />
                            {errors.birth_date && <p className='mt-1 text-sm text-red-600'>{errors.birth_date}</p>}
                        </div>

                        {/* Health Status */}
                        <div className='md:col-span-2'>
                            <label className='mb-2 block text-sm font-medium text-gray-700'>Health Status</label>
                            <textarea
                                value={formData.health_status}
                                onChange={(e) => handleChange('health_status', e.target.value)}
                                rows={3}
                                className='w-full rounded-lg border border-gray-300 px-4 py-2.5 focus:border-lime-500 focus:outline-none focus:ring-2 focus:ring-lime-200'
                                placeholder='Any medical conditions, allergies, or important notes...'
                            />
                        </div>
                    </div>

                    {/* Action Buttons */}
                    <div className='mt-6 flex gap-3'>
                        <button
                            type='button'
                            onClick={onClose}
                            className='flex-1 rounded-lg border border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 cursor-pointer'
                            disabled={isSubmitting}
                        >
                            Cancel
                        </button>
                        <button
                            type='submit'
                            className='flex-1 rounded-lg bg-lime-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lime-700 disabled:cursor-not-allowed disabled:opacity-50 cursor-pointer'
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Saving...' : mode === 'create' ? 'Add Pet' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PetFormModal;
