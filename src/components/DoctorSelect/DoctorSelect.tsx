import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2, Search } from 'lucide-react';
import type { Employee } from '~/types/employee.type';

interface DoctorSelectProps {
  value: string;
  onChange: (value: string) => void;
  doctors: Employee[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  disabled?: boolean;
  totalCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
}

export const DoctorSelect = ({
  value,
  onChange,
  doctors,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  disabled = false,
  totalCount,
  searchQuery = '',
  onSearchChange
}: DoctorSelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const selectedDoctor = doctors.find((d) => d.employee_id === Number(value));

  // Calculate dropdown position to prevent overflow
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const calculatePosition = () => {
      const buttonRect = buttonRef.current!.getBoundingClientRect();
      const dropdownHeight = 400; // Approximate max height of dropdown (search + list + footer)
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      // Nếu không đủ chỗ bên dưới nhưng có đủ chỗ bên trên thì hiển thị lên trên
      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    };

    calculatePosition();

    // Recalculate on scroll or resize
    window.addEventListener('scroll', calculatePosition, true);
    window.addEventListener('resize', calculatePosition);

    return () => {
      window.removeEventListener('scroll', calculatePosition, true);
      window.removeEventListener('resize', calculatePosition);
    };
  }, [isOpen]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    if (!observerTarget.current || !isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          onLoadMore();
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Load sớm hơn 100px trước khi đến cuối list
      }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore, isOpen]);

  const handleSelect = (doctorId: number) => {
    onChange(String(doctorId));
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Filter doctors based on search query
  const filteredDoctors = searchQuery
    ? doctors.filter((doctor) => doctor.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : doctors;

  return (
    <div ref={dropdownRef} className='relative w-full'>
      {/* Select Button */}
      <button
        ref={buttonRef}
        type='button'
        onClick={handleToggle}
        disabled={disabled}
        className='flex w-full cursor-pointer items-center justify-between rounded-lg border border-gray-300 bg-white px-4 py-2 text-left focus:border-orange-500 focus:ring-2 focus:ring-orange-500 focus:outline-none disabled:cursor-not-allowed disabled:bg-gray-100'
      >
        <span className={selectedDoctor ? 'text-gray-900' : 'text-gray-500'}>
          {isLoading ? (
            <span className='flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              Loading...
            </span>
          ) : selectedDoctor ? (
            selectedDoctor.name
          ) : (
            'Select doctor'
          )}
        </span>
        <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && !disabled && (
        <div
          className={`absolute z-50 w-full rounded-lg border border-gray-300 bg-white shadow-lg ${
            dropdownPosition === 'top' ? 'bottom-full mb-1' : 'top-full mt-1'
          }`}
        >
          {/* Search Input */}
          {onSearchChange && (
            <div className='border-b border-gray-200 p-2'>
              <div className='relative'>
                <Search className='absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-gray-400' />
                <input
                  type='text'
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  placeholder='Search doctor...'
                  className='w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none'
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Doctor List */}
          <div ref={listRef} className='max-h-60 overflow-y-auto'>
            {isLoading && doctors.length === 0 ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='h-5 w-5 animate-spin text-orange-600' />
              </div>
            ) : filteredDoctors.length === 0 ? (
              <div className='py-8 text-center text-sm text-gray-500'>
                {searchQuery ? 'No doctors found matching your search' : 'No doctors available'}
              </div>
            ) : (
              <>
                {filteredDoctors.map((doctor) => (
                  <button
                    key={doctor.employee_id}
                    type='button'
                    onClick={() => handleSelect(doctor.employee_id)}
                    className={`w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors hover:bg-orange-50 ${
                      Number(value) === doctor.employee_id
                        ? 'bg-orange-100 font-medium text-orange-600'
                        : 'text-gray-900'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <span>{doctor.name}</span>
                      <span className='text-xs text-gray-500'>{doctor.employee_code}</span>
                    </div>
                  </button>
                ))}

                {/* Infinite Scroll Trigger & Loading Indicator */}
                {hasNextPage && (
                  <div ref={observerTarget} className='flex items-center justify-center py-3'>
                    {isFetchingNextPage && <Loader2 className='h-4 w-4 animate-spin text-orange-600' />}
                  </div>
                )}
              </>
            )}
          </div>

          {/* Footer with total count */}
          {totalCount !== undefined && totalCount > 0 && (
            <div className='border-t border-gray-200 bg-gray-50 px-4 py-2 text-xs text-gray-500'>
              Showing {filteredDoctors.length} of {totalCount} doctors
              {hasNextPage && ' (scroll to load more)'}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
