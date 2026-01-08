import { useState, useCallback } from 'react';
import type { Pet } from '~/types/pet.type';

interface UsePetManagementReturn {
    pets: Pet[];
    isLoading: boolean;
    error: string | null;
    createPet: (pet: Pet) => Promise<void>;
    updatePet: (pet: Pet) => Promise<void>;
    deletePet: (petId: number) => Promise<void>;
    refreshPets: () => Promise<void>;
}

export const usePetManagement = (): UsePetManagementReturn => {
    // Mock data for now
    const [pets, setPets] = useState<Pet[]>([
        {
            pet_id: 1,
            pet_code: "PET-001",
            name: "Milo",
            species: "Dog",
            breed: "Golden Retriever",
            gender: "Male",
            birth_date: "2021-05-12",
            health_status: "Healthy",
            owner_id: 101
        },
        {
            pet_id: 2,
            pet_code: "PET-002",
            name: "Luna",
            species: "Cat",
            breed: "British Shorthair",
            gender: "Female",
            birth_date: "2022-01-20",
            health_status: "Vaccinated",
            owner_id: 102
        },
        {
            pet_id: 3,
            pet_code: "PET-003",
            name: "Coco",
            species: "Bird",
            breed: "Parrot",
            gender: "Other",
            birth_date: "2020-08-05",
            health_status: "Healthy",
            owner_id: 101
        },
        {
            pet_id: 4,
            pet_code: "PET-004",
            name: "Max",
            species: "Dog",
            breed: "Poodle",
            gender: "Male",
            birth_date: "2019-11-30",
            health_status: "Needs dental check",
            owner_id: 103
        },
        {
            pet_id: 5,
            pet_code: "PET-005",
            name: "Nami",
            species: "Cat",
            gender: "Female",
            health_status: "Under treatment",
            owner_id: 104,
            breed: '',
            birth_date: ''
        }
    ]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const refreshPets = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/pets', {
            //   method: 'GET',
            //   headers: {
            //     'Authorization': `Bearer ${token}`,
            //     'Content-Type': 'application/json'
            //   }
            // });
            // if (!response.ok) throw new Error('Failed to fetch pets');
            // const data = await response.json();
            // setPets(data.pets);

            // Simulate API delay
            await new Promise((resolve) => setTimeout(resolve, 500));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch pets');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Create a new pet
    const createPet = useCallback(async (petData: Pet) => {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch('/api/pets', {
            //   method: 'POST',
            //   headers: {
            //     'Authorization': `Bearer ${token}`,
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify(petData)
            // });
            // if (!response.ok) throw new Error('Failed to create pet');
            // const data = await response.json();
            // setPets((prev) => [...prev, data.pet]);

            // Mock implementation
            await new Promise((resolve) => setTimeout(resolve, 500));
            const newPet: Pet = {
                ...petData,
                pet_id: Date.now(),
                owner_id: 1,
            };
            setPets((prev) => [...prev, newPet]);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create pet');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Update an existing pet
    const updatePet = useCallback(async (petData: Pet) => {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`/api/pets/${petData.id}`, {
            //   method: 'PUT',
            //   headers: {
            //     'Authorization': `Bearer ${token}`,
            //     'Content-Type': 'application/json'
            //   },
            //   body: JSON.stringify(petData)
            // });
            // if (!response.ok) throw new Error('Failed to update pet');
            // const data = await response.json();
            // setPets((prev) => prev.map((pet) => (pet.id === petData.id ? data.pet : pet)));

            // Mock implementation
            await new Promise((resolve) => setTimeout(resolve, 500));
            setPets((prev) =>
                prev.map((pet) =>
                    pet.pet_id === petData.pet_id
                        ? { ...pet, ...petData }
                        : pet
                )
            );
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to update pet');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    // Delete a pet
    const deletePet = useCallback(async (petId: number) => {
        setIsLoading(true);
        setError(null);
        try {
            // TODO: Replace with actual API call
            // const response = await fetch(`/api/pets/${petId}`, {
            //   method: 'DELETE',
            //   headers: {
            //     'Authorization': `Bearer ${token}`,
            //     'Content-Type': 'application/json'
            //   }
            // });
            // if (!response.ok) throw new Error('Failed to delete pet');
            // setPets((prev) => prev.filter((pet) => pet.id !== petId));

            // Mock implementation
            await new Promise((resolve) => setTimeout(resolve, 500));
            setPets((prev) => prev.filter((pet) => pet.pet_id !== petId));
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to delete pet');
            throw err;
        } finally {
            setIsLoading(false);
        }
    }, []);

    return {
        pets,
        isLoading,
        error,
        createPet,
        updatePet,
        deletePet,
        refreshPets
    };
};
