import { useState } from 'react';

const PetManagement = () => {
  // Mock data
  const [pets, setPets] = useState<any[]>([
    {
      id: 1,
      name: 'Milo',
      species: 'Chó',
      breed: 'Golden Retriever',
      age: '2 tuổi',
      weight: '25kg',
      image: '/assets/images/single_dog.png'
    }
  ]);

  const editPet = (updatedPet: any) => {
    setPets((prevPets) => prevPets.map((pet) => (pet.id === updatedPet.id ? updatedPet : pet)));
  };

  const deletePet = (petId: number) => {
    setPets(pets.filter((pet) => pet.id !== petId));
  };

  return (
    <div className='mx-auto max-w-6xl'>
      {/* Header */}
      <div className='mb-6 flex items-center justify-between'>
        <h2 className='text-xl font-semibold text-gray-800'>Pet List</h2>
        <button className='flex items-center gap-2 rounded-lg bg-lime-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lime-700'>
          <svg className='h-5 w-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 4v16m8-8H4' />
          </svg>
          Add Pet
        </button>
      </div>

      {/* Pet Cards Grid */}
      <div className='grid gap-6 md:grid-cols-2 lg:grid-cols-3'>
        {pets.map((pet) => (
          <div key={pet.id} className='overflow-hidden rounded-lg bg-white shadow-md transition-shadow hover:shadow-lg'>
            <div className='h-48 bg-gray-200'>
              <img
                src={pet.image}
                alt={pet.name}
                className='h-full w-full object-cover'
                onError={(e) => {
                  e.currentTarget.src =
                    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTYiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5QZXQgSW1hZ2U8L3RleHQ+PC9zdmc+';
                }}
              />
            </div>

            <div className='p-4'>
              <h3 className='mb-2 text-lg font-semibold text-gray-800'>{pet.name}</h3>
              <div className='space-y-1 text-sm text-gray-600'>
                <p>
                  <span className='font-medium'>Species:</span> {pet.species}
                </p>
                <p>
                  <span className='font-medium'>Breed:</span> {pet.breed}
                </p>
                <p>
                  <span className='font-medium'>Age:</span> {pet.age}
                </p>
                <p>
                  <span className='font-medium'>Weight:</span> {pet.weight}
                </p>
              </div>

              <div className='mt-4 flex gap-2'>
                <button
                  className='flex-1 rounded-lg border border-lime-600 bg-white px-3 py-2 text-sm font-medium text-lime-600 transition-colors hover:bg-lime-50'
                  onClick={editPet}
                >
                  Edit
                </button>
                <button
                  className='flex-1 rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50'
                  onClick={() => deletePet(pet.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {pets.length === 0 && (
        <div className='rounded-lg bg-white p-12 text-center shadow-md'>
          <svg className='mx-auto h-16 w-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5'
            />
          </svg>
          <p className='mt-4 text-gray-600'>You haven't added any pets yet</p>
          <button className='mt-4 rounded-lg bg-lime-600 px-6 py-2.5 text-sm font-medium text-white transition-colors hover:bg-lime-700'>
            Add your first pet
          </button>
        </div>
      )}
    </div>
  );
};

export default PetManagement;
