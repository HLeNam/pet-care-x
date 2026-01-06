import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Phone,
  Filter,
  X,
  Mail,
  MapPin,
  PawPrint,
  UserIcon,
  Trash2
} from 'lucide-react';
import { useState, useMemo } from 'react';
import { Pagination } from '~/pages/User/components/Pagination';
import AppointmentDetailsModal from '~/pages/Doctor/components/AppointmentDetailsModal';
import AppointmentEditModal from '~/pages/Doctor/components/AppointmentEditModal';
import AppointmentDeleteModal from '~/pages/Doctor/components/AppointmentDeleteModal';

// Temporary mock data
const mockAppointments = [
  {
    id: 1,
    customerName: 'Nguyễn Văn A',
    petName: 'Milu',
    petType: 'Chó',
    petBreed: 'Golden Retriever',
    petAge: 3,
    appointmentTime: '2026-01-06 09:00',
    status: 'Đã xác nhận',
    phone: '0901234567',
    email: 'nguyenvana@email.com',
    address: '123 Nguyễn Huệ, Q.1, TP.HCM',
    reason: 'Khám định kỳ, tiêm phòng dại',
    notes: 'Thú cưng đang trong giai đoạn điều trị da, cần theo dõi'
  },
  {
    id: 2,
    customerName: 'Trần Thị B',
    petName: 'Lucky',
    petType: 'Mèo',
    petBreed: 'Anh lông ngắn',
    petAge: 2,
    appointmentTime: '2026-01-06 10:30',
    status: 'Chờ xác nhận',
    phone: '0902345678',
    email: 'tranthib@email.com',
    address: '456 Lê Lợi, Q.3, TP.HCM',
    reason: 'Mèo bị nôn và chán ăn',
    notes: 'Chủ báo cáo triệu chứng từ 2 ngày trước'
  },
  {
    id: 3,
    customerName: 'Lê Văn C',
    petName: 'Bông',
    petType: 'Chó',
    petBreed: 'Poodle',
    petAge: 1,
    appointmentTime: '2026-01-06 14:00',
    status: 'Đã xác nhận',
    phone: '0903456789',
    email: 'levanc@email.com',
    address: '789 Võ Văn Tần, Q.3, TP.HCM',
    reason: 'Cắt tỉa lông và kiểm tra sức khỏe',
    notes: 'Lần đầu tiên đến phòng khám'
  },
  {
    id: 4,
    customerName: 'Phạm Thị D',
    petName: 'Cún',
    petType: 'Chó',
    petBreed: 'Corgi',
    petAge: 4,
    appointmentTime: '2026-01-06 15:30',
    status: 'Đã xác nhận',
    phone: '0904567890',
    email: 'phamthid@email.com',
    address: '321 Pasteur, Q.1, TP.HCM',
    reason: 'Tái khám sau phẫu thuật',
    notes: 'Đã phẫu thuật cách đây 1 tuần'
  },
  {
    id: 5,
    customerName: 'Hoàng Văn E',
    petName: 'Max',
    petType: 'Chó',
    petBreed: 'Husky',
    petAge: 5,
    appointmentTime: '2026-01-06 16:00',
    status: 'Chờ xác nhận',
    phone: '0905678901',
    email: 'hoangvane@email.com',
    address: '654 Điện Biên Phủ, Q.Bình Thạnh, TP.HCM',
    reason: 'Chó khập khễnh chân sau',
    notes: 'Có thể cần chụp X-quang'
  },
  {
    id: 6,
    customerName: 'Vũ Thị F',
    petName: 'Kitty',
    petType: 'Mèo',
    petBreed: 'Ba Tư',
    petAge: 3,
    appointmentTime: '2026-01-07 09:00',
    status: 'Đã xác nhận',
    phone: '0906789012',
    email: 'vuthif@email.com',
    address: '987 Hai Bà Trưng, Q.1, TP.HCM',
    reason: 'Kiểm tra mắt và tai',
    notes: 'Mèo có dấu hiệu ngứa tai'
  },
  {
    id: 7,
    customerName: 'Đỗ Văn G',
    petName: 'Rocky',
    petType: 'Chó',
    petBreed: 'Bulldog',
    petAge: 2,
    appointmentTime: '2026-01-07 10:00',
    status: 'Đã xác nhận',
    phone: '0907890123',
    email: 'dovang@email.com',
    address: '147 Trần Hưng Đạo, Q.5, TP.HCM',
    reason: 'Tiêm phòng',
    notes: 'Cần tiêm phòng đầy đủ'
  },
  {
    id: 8,
    customerName: 'Mai Thị H',
    petName: 'Bella',
    petType: 'Chó',
    petBreed: 'Chihuahua',
    petAge: 1,
    appointmentTime: '2026-01-07 11:30',
    status: 'Chờ xác nhận',
    phone: '0908901234',
    email: 'maithih@email.com',
    address: '258 Cách Mạng Tháng 8, Q.10, TP.HCM',
    reason: 'Khám sức khỏe tổng quát',
    notes: 'Chủ muốn tư vấn chế độ dinh dưỡng'
  },
  {
    id: 9,
    customerName: 'Ngô Văn I',
    petName: 'Tom',
    petType: 'Mèo',
    petBreed: 'Tabby',
    petAge: 4,
    appointmentTime: '2026-01-07 13:00',
    status: 'Đã xác nhận',
    phone: '0909012345',
    email: 'ngovani@email.com',
    address: '369 Lý Thường Kiệt, Q.11, TP.HCM',
    reason: 'Triệt sản',
    notes: 'Đã chuẩn bị nhịn đói 8 tiếng'
  },
  {
    id: 10,
    customerName: 'Bùi Thị K',
    petName: 'Luna',
    petType: 'Chó',
    petBreed: 'Pomeranian',
    petAge: 2,
    appointmentTime: '2026-01-07 14:30',
    status: 'Đã hủy',
    phone: '0900123456',
    email: 'buithik@email.com',
    address: '741 Phạm Ngũ Lão, Q.1, TP.HCM',
    reason: 'Khám bệnh ngoài da',
    notes: 'Hủy do chủ bận đột xuất'
  },
  {
    id: 11,
    customerName: 'Dương Văn L',
    petName: 'Simba',
    petType: 'Mèo',
    petBreed: 'Maine Coon',
    petAge: 3,
    appointmentTime: '2026-01-07 15:00',
    status: 'Đã xác nhận',
    phone: '0911234567',
    email: 'duongvanl@email.com',
    address: '852 Nguyễn Thị Minh Khai, Q.3, TP.HCM',
    reason: 'Cắt móng và tắm',
    notes: 'Mèo khá hiền'
  },
  {
    id: 12,
    customerName: 'Trịnh Thị M',
    petName: 'Mochi',
    petType: 'Chó',
    petBreed: 'Shiba Inu',
    petAge: 1,
    appointmentTime: '2026-01-07 16:30',
    status: 'Chờ xác nhận',
    phone: '0912345678',
    email: 'trinhthim@email.com',
    address: '963 Phan Xích Long, Q.Phú Nhuận, TP.HCM',
    reason: 'Khám răng miệng',
    notes: 'Chó có mùi hôi miệng'
  },
  {
    id: 13,
    customerName: 'Lý Văn N',
    petName: 'Charlie',
    petType: 'Chó',
    petBreed: 'Beagle',
    petAge: 2,
    appointmentTime: '2026-01-08 09:00',
    status: 'Đã xác nhận',
    phone: '0913456789',
    email: 'lyvann@email.com',
    address: '159 Nguyễn Văn Cừ, Q.5, TP.HCM',
    reason: 'Khám và điều trị ký sinh trùng',
    notes: 'Chó có triệu chứng tiêu chảy'
  },
  {
    id: 14,
    customerName: 'Hồ Thị O',
    petName: 'Daisy',
    petType: 'Chó',
    petBreed: 'Yorkshire Terrier',
    petAge: 3,
    appointmentTime: '2026-01-08 10:00',
    status: 'Đã xác nhận',
    phone: '0914567890',
    email: 'hothio@email.com',
    address: '357 Bà Hạt, Q.10, TP.HCM',
    reason: 'Khám tai và mắt',
    notes: 'Chó thường xuyên gãi tai'
  },
  {
    id: 15,
    customerName: 'Phan Văn P',
    petName: 'Oscar',
    petType: 'Mèo',
    petBreed: 'Ragdoll',
    petAge: 2,
    appointmentTime: '2026-01-08 11:00',
    status: 'Chờ xác nhận',
    phone: '0915678901',
    email: 'phanvanp@email.com',
    address: '753 Nguyễn Kiệm, Q.Gò Vấp, TP.HCM',
    reason: 'Tái khám sau tiêm phòng',
    notes: 'Kiểm tra phản ứng vắc xin'
  },
  {
    id: 16,
    customerName: 'Võ Thị Q',
    petName: 'Leo',
    petType: 'Chó',
    petBreed: 'Labrador',
    petAge: 5,
    appointmentTime: '2026-01-08 13:30',
    status: 'Đã xác nhận',
    phone: '0916789012',
    email: 'vothiq@email.com',
    address: '951 Hoàng Văn Thụ, Q.Tân Bình, TP.HCM',
    reason: 'Khám bệnh về xương khớp',
    notes: 'Chó lớn tuổi, cần chăm sóc đặc biệt'
  },
  {
    id: 17,
    customerName: 'Tô Văn R',
    petName: 'Coco',
    petType: 'Chó',
    petBreed: 'Pug',
    petAge: 4,
    appointmentTime: '2026-01-08 14:00',
    status: 'Đã xác nhận',
    phone: '0917890123',
    email: 'tovanr@email.com',
    address: '357 Nguyễn Oanh, Q.Gò Vấp, TP.HCM',
    reason: 'Khám hô hấp',
    notes: 'Giống chó hay gặp vấn đề về hô hấp'
  },
  {
    id: 18,
    customerName: 'Đinh Thị S',
    petName: 'Buddy',
    petType: 'Chó',
    petBreed: 'Schnauzer',
    petAge: 3,
    appointmentTime: '2026-01-08 15:30',
    status: 'Chờ xác nhận',
    phone: '0918901234',
    email: 'dinhthis@email.com',
    address: '159 Lê Văn Việt, Q.9, TP.HCM',
    reason: 'Tư vấn chế độ ăn uống',
    notes: 'Chó bị thừa cân'
  },
  {
    id: 19,
    customerName: 'Lương Văn T',
    petName: 'Nala',
    petType: 'Mèo',
    petBreed: 'Siamese',
    petAge: 2,
    appointmentTime: '2026-01-08 16:00',
    status: 'Đã xác nhận',
    phone: '0919012345',
    email: 'luongvant@email.com',
    address: '753 Quang Trung, Q.Gò Vấp, TP.HCM',
    reason: 'Tiêm phòng và tẩy giun',
    notes: 'Mèo còn nhỏ, cần chăm sóc kỹ'
  },
  {
    id: 20,
    customerName: 'Đặng Thị U',
    petName: 'Tiger',
    petType: 'Chó',
    petBreed: 'German Shepherd',
    petAge: 6,
    appointmentTime: '2026-01-09 09:00',
    status: 'Đã xác nhận',
    phone: '0920123456',
    email: 'dangthiu@email.com',
    address: '951 Lũy Bán Bích, Q.Tân Phú, TP.HCM',
    reason: 'Khám bệnh tim',
    notes: 'Chó có tiền sử bệnh tim'
  },
  {
    id: 21,
    customerName: 'Chu Văn V',
    petName: 'Cookie',
    petType: 'Chó',
    petBreed: 'Maltese',
    petAge: 1,
    appointmentTime: '2026-01-09 10:30',
    status: 'Chờ xác nhận',
    phone: '0921234567',
    email: 'chuvanv@email.com',
    address: '357 Lạc Long Quân, Q.11, TP.HCM',
    reason: 'Khám sức khỏe định kỳ',
    notes: 'Thú cưng khỏe mạnh'
  },
  {
    id: 22,
    customerName: 'Thái Thị W',
    petName: 'Milo',
    petType: 'Mèo',
    petBreed: 'Scottish Fold',
    petAge: 2,
    appointmentTime: '2026-01-09 11:00',
    status: 'Đã xác nhận',
    phone: '0922345678',
    email: 'thaithiw@email.com',
    address: '159 Tân Sơn Nhì, Q.Tân Phú, TP.HCM',
    reason: 'Cắt móng và vệ sinh',
    notes: 'Mèo hiền lành'
  },
  {
    id: 23,
    customerName: 'Cao Văn X',
    petName: 'Pepper',
    petType: 'Chó',
    petBreed: 'Border Collie',
    petAge: 4,
    appointmentTime: '2026-01-09 13:00',
    status: 'Đã xác nhận',
    phone: '0923456789',
    email: 'caovanx@email.com',
    address: '753 Phan Huy Ích, Q.Tân Bình, TP.HCM',
    reason: 'Kiểm tra chấn thương chân',
    notes: 'Chó bị ngã khi chạy'
  },
  {
    id: 24,
    customerName: 'Tạ Thị Y',
    petName: 'Ginger',
    petType: 'Mèo',
    petBreed: 'Bengal',
    petAge: 3,
    appointmentTime: '2026-01-09 14:30',
    status: 'Chờ xác nhận',
    phone: '0924567890',
    email: 'tathiy@email.com',
    address: '357 Lê Đức Thọ, Q.Gò Vấp, TP.HCM',
    reason: 'Khám da và lông',
    notes: 'Mèo bị rụng lông bất thường'
  },
  {
    id: 25,
    customerName: 'Ông Văn Z',
    petName: 'Shadow',
    petType: 'Chó',
    petBreed: 'Doberman',
    petAge: 5,
    appointmentTime: '2026-01-09 15:00',
    status: 'Đã xác nhận',
    phone: '0925678901',
    email: 'ongvanz@email.com',
    address: '951 Tân Kỳ Tân Quý, Q.Tân Phú, TP.HCM',
    reason: 'Tái khám sau điều trị',
    notes: 'Đang trong quá trình điều trị dài hạn'
  }
];

const ITEMS_PER_PAGE = 10;

const Appointments = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [dateFilter, setDateFilter] = useState<string>('all');
  const [customFromDate, setCustomFromDate] = useState<string>('');
  const [customToDate, setCustomToDate] = useState<string>('');
  const [selectedAppointment, setSelectedAppointment] = useState<(typeof mockAppointments)[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<(typeof mockAppointments)[0] | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<(typeof mockAppointments)[0] | null>(null);

  // Filter appointments based on date
  const filteredAppointments = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const weekEnd = new Date(today);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return mockAppointments.filter((appointment) => {
      const appointmentDate = new Date(appointment.appointmentTime);
      appointmentDate.setHours(0, 0, 0, 0);

      switch (dateFilter) {
        case 'today':
          return appointmentDate.getTime() === today.getTime();
        case 'tomorrow':
          return appointmentDate.getTime() === tomorrow.getTime();
        case 'week':
          return appointmentDate >= today && appointmentDate <= weekEnd;
        case 'custom':
          if (customFromDate && customToDate) {
            const fromDate = new Date(customFromDate);
            fromDate.setHours(0, 0, 0, 0);
            const toDate = new Date(customToDate);
            toDate.setHours(23, 59, 59, 999);
            return appointmentDate >= fromDate && appointmentDate <= toDate;
          }
          return true;
        default:
          return true;
      }
    });
  }, [dateFilter, customFromDate, customToDate]);

  const totalPages = Math.ceil(filteredAppointments.length / ITEMS_PER_PAGE);

  const paginatedAppointments = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredAppointments.slice(startIndex, endIndex);
  }, [filteredAppointments, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDateFilterChange = (filter: string) => {
    setDateFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const handleViewDetails = (appointment: (typeof mockAppointments)[0]) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleEdit = (appointment: (typeof mockAppointments)[0]) => {
    setEditFormData({ ...appointment });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditFormData(null);
  };

  const handleEditFormChange = (field: string, value: string) => {
    if (editFormData) {
      setEditFormData({ ...editFormData, [field]: value });
    }
  };

  const handleSaveEdit = () => {
    // TODO: Implement API call to save changes
    console.log('Saving appointment:', editFormData);
    handleCloseEditModal();
  };

  const handleDelete = (appointment: (typeof mockAppointments)[0]) => {
    setAppointmentToDelete(appointment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    // TODO: Implement API call to delete appointment
    console.log('Deleting appointment:', appointmentToDelete);
    setIsDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setAppointmentToDelete(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Đã xác nhận':
        return 'bg-green-100 text-green-800';
      case 'Chờ xác nhận':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  return (
    <div className='space-y-6'>
      {/* Page Header */}
      <div className='flex items-center justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>Appointments</h1>
          <p className='mt-1 text-sm text-gray-600'>
            List of medical appointments (
            {dateFilter === 'all' ? `${mockAppointments.length} total` : `${filteredAppointments.length} filtered`})
          </p>
        </div>
        <div className='flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2'>
          <CalendarIcon className='h-5 w-5 text-orange-600' />
          <span className='text-sm font-medium text-orange-600'>{new Date().toLocaleDateString('vi-VN')}</span>
        </div>
      </div>

      {/* Filter Section */}
      <div className='rounded-lg border border-gray-200 bg-white p-4'>
        <div className='flex flex-wrap items-center gap-4'>
          <div className='flex items-center gap-2'>
            <Filter className='h-5 w-5 text-gray-500' />
            <span className='text-sm font-medium text-gray-700'>Filter by Date:</span>
          </div>
          <div className='flex flex-wrap gap-2'>
            <button
              onClick={() => handleDateFilterChange('all')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dateFilter === 'all'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              All
            </button>
            <button
              onClick={() => handleDateFilterChange('today')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dateFilter === 'today'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => handleDateFilterChange('tomorrow')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dateFilter === 'tomorrow'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Tomorrow
            </button>
            <button
              onClick={() => handleDateFilterChange('week')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dateFilter === 'week'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              This Week
            </button>
            <button
              onClick={() => handleDateFilterChange('custom')}
              className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                dateFilter === 'custom'
                  ? 'bg-orange-500 text-white'
                  : 'border border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
              }`}
            >
              Custom
            </button>
          </div>
        </div>

        {/* Custom Date Range Picker */}
        {dateFilter === 'custom' && (
          <div className='mt-4 flex flex-wrap items-center gap-4 border-t border-gray-200 pt-4'>
            <div className='flex items-center gap-2'>
              <label htmlFor='fromDate' className='text-sm font-medium text-gray-700'>
                From:
              </label>
              <input
                type='date'
                id='fromDate'
                value={customFromDate}
                onChange={(e) => setCustomFromDate(e.target.value)}
                className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
              />
            </div>
            <div className='flex items-center gap-2'>
              <label htmlFor='toDate' className='text-sm font-medium text-gray-700'>
                To:
              </label>
              <input
                type='date'
                id='toDate'
                value={customToDate}
                onChange={(e) => setCustomToDate(e.target.value)}
                min={customFromDate}
                className='rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 focus:outline-none'
              />
            </div>
            {customFromDate && customToDate && (
              <button
                onClick={() => {
                  setCustomFromDate('');
                  setCustomToDate('');
                }}
                className='rounded-lg border border-red-300 bg-white px-3 py-2 text-sm font-medium text-red-600 transition-colors hover:bg-red-50'
              >
                Clear Dates
              </button>
            )}
          </div>
        )}
      </div>

      {/* Appointments List */}
      <div className='overflow-hidden rounded-lg border border-gray-200 bg-white'>
        <div className='overflow-x-auto'>
          <table className='w-full'>
            <thead className='border-b border-gray-200 bg-gray-50'>
              <tr>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Customer
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Pet
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Time
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Status
                </th>
                <th className='px-6 py-3 text-left text-xs font-semibold tracking-wider text-gray-700 uppercase'>
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className='divide-y divide-gray-200'>
              {paginatedAppointments.map((appointment) => (
                <tr key={appointment.id} className='transition-colors hover:bg-gray-50'>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                        <User className='h-5 w-5 text-orange-600' />
                      </div>
                      <div>
                        <div className='font-medium text-gray-900'>{appointment.customerName}</div>
                        <div className='flex items-center gap-1 text-sm text-gray-500'>
                          <Phone className='h-3 w-3' />
                          {appointment.phone}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='text-sm font-medium text-gray-900'>{appointment.petName}</div>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex items-center gap-2 text-sm text-gray-900'>
                      <Clock className='h-4 w-4 text-gray-400' />
                      {new Date(appointment.appointmentTime).toLocaleString('vi-VN')}
                    </div>
                  </td>
                  <td className='px-6 py-4'>
                    <span
                      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(appointment.status)}`}
                    >
                      {appointment.status}
                    </span>
                  </td>
                  <td className='px-6 py-4'>
                    <div className='flex gap-2'>
                      <button
                        onClick={() => handleViewDetails(appointment)}
                        className='rounded-lg border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50'
                      >
                        View Details
                      </button>
                      <button
                        onClick={() => handleEdit(appointment)}
                        className='rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600'
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(appointment)}
                        className='rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600'
                      >
                        <Trash2 className='h-5 w-5' />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className='flex justify-center border-t border-gray-200 py-4'>
            <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
          </div>
        )}

        {/* Empty State */}
        {filteredAppointments.length === 0 && (
          <div className='py-12 text-center'>
            <CalendarIcon className='mx-auto h-12 w-12 text-gray-400' />
            <h3 className='mt-4 text-sm font-medium text-gray-900'>No appointments</h3>
            <p className='mt-2 text-sm text-gray-500'>
              {dateFilter === 'all'
                ? 'There are no appointments scheduled.'
                : dateFilter === 'custom'
                  ? customFromDate && customToDate
                    ? 'There are no appointments in the selected date range.'
                    : 'Please select a date range.'
                  : `There are no appointments for ${dateFilter === 'today' ? 'today' : dateFilter === 'tomorrow' ? 'tomorrow' : 'this week'}.`}
            </p>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AppointmentDetailsModal isOpen={isModalOpen} appointment={selectedAppointment} onClose={handleCloseModal} />

      {/* Edit Modal */}
      <AppointmentEditModal
        isOpen={isEditModalOpen}
        appointment={editFormData}
        onClose={handleCloseEditModal}
        onSave={handleSaveEdit}
        onChange={handleEditFormChange}
      />

      {/* Delete Confirmation Modal */}
      <AppointmentDeleteModal
        isOpen={isDeleteModalOpen}
        appointment={appointmentToDelete}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Appointments;
