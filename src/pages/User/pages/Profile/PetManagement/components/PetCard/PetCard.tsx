import { Mars, Venus, Dog, Cat, PawPrint, Tag, CalendarDays, HeartPulse, Pencil, Trash, Bird } from 'lucide-react';
import type { Pet } from '~/types/pet.type';

interface PetCardProps {
    pet: Pet;
    onEdit: (pet: Pet) => void;
    onDelete: (petId: number) => void;
}

const PetCard = ({ pet, onEdit, onDelete }: PetCardProps) => {
    const genderIconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
        Male: Mars,
        Female: Venus,
        Other: PawPrint
    };

    const speciesIconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
        dog: Dog,
        cat: Cat,
        bird: Bird
    };

    const GenderIcon = genderIconMap[pet.gender] ?? PawPrint;
    const SpeciesIcon = speciesIconMap[pet.species?.toLowerCase()] ?? PawPrint;


    return (
        <div className="group overflow-hidden rounded-xl bg-white shadow-sm transition hover:shadow-lg">
            {/* Image */}
            <div className="relative h-48 overflow-hidden">
                <img
                    src="/assets/images/single_dog.png"
                    alt={pet.name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                />

                {/* Species badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1 rounded-full bg-white/90 px-3 py-1 text-xs font-medium text-gray-700 shadow">
                    <SpeciesIcon className="h-3.5 w-3.5" />
                    {pet.species}
                </div>
            </div>

            {/* Content */}
            <div className="p-4">
                {/* Header */}
                <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-lg font-semibold text-gray-800">
                        {pet.name}
                    </h3>

                    <span
                        className={`flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium
                                ${pet.gender === "Male"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-pink-100 text-pink-700"}`}
                    >
                        <GenderIcon className="h-3.5 w-3.5" />
                        {pet.gender}
                    </span>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Tag className="h-4 w-4 text-gray-400" />
                        <span className="font-bold">Breed:</span>
                        <span>{pet.breed}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <CalendarDays className="h-4 w-4 text-gray-400" />
                        <span className="font-bold">Birthday:</span>
                        <span>{pet.birth_date}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <PawPrint className="h-4 w-4 text-gray-400" />
                        <span className="font-bold">Species:</span>
                        <span>{pet.species}</span>
                    </div>

                    {/* Health */}
                    {pet.health_status && (
                        <div className="flex items-center gap-2">
                            <HeartPulse className="h-4 w-4 text-gray-400" />
                            <span className="font-bold">Health Status:</span>
                            <span>{pet.health_status}</span>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={() => onEdit(pet)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-lime-600 px-3 py-2 text-sm font-medium text-lime-600 transition hover:bg-lime-50 cursor-pointer"
                    >
                        <Pencil className="h-4 w-4" />
                        Edit
                    </button>

                    <button
                        onClick={() => onDelete(pet.pet_id)}
                        className="flex flex-1 items-center justify-center gap-2 rounded-lg border border-red-300 px-3 py-2 text-sm font-medium text-red-600 transition hover:bg-red-50 cursor-pointer"
                    >
                        <Trash className="h-4 w-4" />
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
};

export default PetCard;
