import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2, Search } from 'lucide-react';

interface InfiniteSelectItem {
  id: number | string;
  label: string;
  subLabel?: string;
}

interface InfiniteSelectProps<T extends InfiniteSelectItem> {
  value: string;
  onChange: (value: string) => void;
  items: T[];
  isLoading: boolean;
  isFetchingNextPage: boolean;
  hasNextPage: boolean;
  onLoadMore: () => void;
  disabled?: boolean;
  placeholder?: string;
  totalCount?: number;
  searchQuery?: string;
  onSearchChange?: (query: string) => void;
  emptyMessage?: string;
  loadingMessage?: string;
  getSearchText?: (item: T) => string;
}

export function InfiniteSelect<T extends InfiniteSelectItem>({
  value,
  onChange,
  items,
  isLoading,
  isFetchingNextPage,
  hasNextPage,
  onLoadMore,
  disabled = false,
  placeholder = 'Select an option',
  totalCount,
  searchQuery = '',
  onSearchChange,
  emptyMessage = 'No items available',
  loadingMessage = 'Loading...',
  getSearchText
}: InfiniteSelectProps<T>) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState<'bottom' | 'top'>('bottom');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const observerTarget = useRef<HTMLDivElement>(null);

  const selectedItem = items.find((item) => String(item.id) === value);

  // Calculate dropdown position to prevent overflow
  useEffect(() => {
    if (!isOpen || !buttonRef.current) return;

    const calculatePosition = () => {
      const buttonRect = buttonRef.current!.getBoundingClientRect();
      const dropdownHeight = 400;
      const spaceBelow = window.innerHeight - buttonRect.bottom;
      const spaceAbove = buttonRect.top;

      if (spaceBelow < dropdownHeight && spaceAbove > spaceBelow) {
        setDropdownPosition('top');
      } else {
        setDropdownPosition('bottom');
      }
    };

    calculatePosition();

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
        rootMargin: '100px'
      }
    );

    observer.observe(observerTarget.current);

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, onLoadMore, isOpen]);

  const handleSelect = (itemId: number | string) => {
    onChange(String(itemId));
    setIsOpen(false);
  };

  const handleToggle = () => {
    if (!disabled) {
      setIsOpen(!isOpen);
    }
  };

  // Filter items based on search query
  const filteredItems = searchQuery
    ? items.filter((item) => {
        const searchText = getSearchText ? getSearchText(item) : item.label;
        return searchText.toLowerCase().includes(searchQuery.toLowerCase());
      })
    : items;

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
        <span className={selectedItem ? 'text-gray-900' : 'text-gray-500'}>
          {isLoading ? (
            <span className='flex items-center gap-2'>
              <Loader2 className='h-4 w-4 animate-spin' />
              {loadingMessage}
            </span>
          ) : selectedItem ? (
            selectedItem.label
          ) : (
            placeholder
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
                  placeholder='Search...'
                  className='w-full rounded-md border border-gray-300 py-2 pr-3 pl-9 text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 focus:outline-none'
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
            </div>
          )}

          {/* Items List */}
          <div ref={listRef} className='max-h-60 overflow-y-auto'>
            {isLoading && items.length === 0 ? (
              <div className='flex items-center justify-center py-8'>
                <Loader2 className='h-5 w-5 animate-spin text-orange-600' />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className='py-8 text-center text-sm text-gray-500'>
                {searchQuery ? `No items found matching your search` : emptyMessage}
              </div>
            ) : (
              <>
                {filteredItems.map((item) => (
                  <button
                    key={item.id}
                    type='button'
                    onClick={() => handleSelect(item.id)}
                    className={`w-full cursor-pointer px-4 py-2 text-left text-sm transition-colors hover:bg-orange-50 ${
                      String(value) === String(item.id) ? 'bg-orange-100 font-medium text-orange-600' : 'text-gray-900'
                    }`}
                  >
                    <div className='flex items-center justify-between'>
                      <span>{item.label}</span>
                      {item.subLabel && <span className='text-xs text-gray-500'>{item.subLabel}</span>}
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
              Showing {filteredItems.length} of {totalCount} items
              {hasNextPage && ' (scroll to load more)'}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
