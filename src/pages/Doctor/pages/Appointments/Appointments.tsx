import { Calendar as CalendarIcon, Clock, User, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { Pagination } from '~/pages/User/components/Pagination';
import AppointmentDetailsModal from '~/pages/Doctor/components/AppointmentDetailsModal';
import AppointmentEditModal from '~/pages/Doctor/components/AppointmentEditModal';
import AppointmentDeleteModal from '~/pages/Doctor/components/AppointmentDeleteModal';
import { useDoctorAppointmentsList } from '~/hooks/useDoctorAppointmentsList';
import useQueryParams from '~/hooks/useQueryParams';
import type { DoctorAppointmentItemResponse } from '~/types/employee.type';

const ITEMS_PER_PAGE = 10;

const Appointments = () => {
  const { updateParams, getParam } = useQueryParams();
  const currentPage = parseInt(getParam('page', '1') || '1');

  const { appointments, pagination, isLoading } = useDoctorAppointmentsList({
    pageNo: currentPage,
    pageSize: ITEMS_PER_PAGE
  });

  const [selectedAppointment, setSelectedAppointment] = useState<DoctorAppointmentItemResponse | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState<DoctorAppointmentItemResponse | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [appointmentToDelete, setAppointmentToDelete] = useState<DoctorAppointmentItemResponse | null>(null);

  const handlePageChange = (page: number) => {
    if (page === 1) {
      updateParams({ page: null }); // Remove page param when it's page 1
    } else {
      updateParams({ page });
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleViewDetails = (appointment: DoctorAppointmentItemResponse) => {
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedAppointment(null);
  };

  const handleEdit = (appointment: DoctorAppointmentItemResponse) => {
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

  const handleDelete = (appointment: DoctorAppointmentItemResponse) => {
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
      case 'Đã Hoàn Thành':
        return 'bg-green-100 text-green-800';
      case 'Chờ xác nhận':
      case 'Đã Đặt':
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
            {isLoading ? 'Loading...' : `List of medical appointments (${pagination.totalElements} total)`}
          </p>
        </div>
        <div className='flex items-center gap-2 rounded-lg bg-orange-50 px-4 py-2'>
          <CalendarIcon className='h-5 w-5 text-orange-600' />
          <span className='text-sm font-medium text-orange-600'>{new Date().toLocaleDateString('vi-VN')}</span>
        </div>
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
              {isLoading ? (
                <tr>
                  <td colSpan={5} className='px-6 py-12 text-center text-sm text-gray-500'>
                    Loading appointments...
                  </td>
                </tr>
              ) : appointments.length === 0 ? (
                <tr>
                  <td colSpan={5} className='px-6 py-12 text-center'>
                    <CalendarIcon className='mx-auto h-12 w-12 text-gray-400' />
                    <h3 className='mt-4 text-sm font-medium text-gray-900'>No appointments</h3>
                    <p className='mt-2 text-sm text-gray-500'>There are no appointments scheduled.</p>
                  </td>
                </tr>
              ) : (
                appointments.map((appointment) => (
                  <tr key={appointment.idLichHen} className='transition-colors hover:bg-gray-50'>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-3'>
                        <div className='flex h-10 w-10 items-center justify-center rounded-full bg-orange-100'>
                          <User className='h-5 w-5 text-orange-600' />
                        </div>
                        <div>
                          <div className='font-medium text-gray-900'>{appointment.tenKhachHang || 'N/A'}</div>
                          <div className='text-sm text-gray-500'>{appointment.tenChiNhanh || 'N/A'}</div>
                        </div>
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='text-sm font-medium text-gray-900'>{appointment.tenThuCung || 'N/A'}</div>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex items-center gap-2 text-sm text-gray-900'>
                        <Clock className='h-4 w-4 text-gray-400' />
                        {appointment.ngayHen} {appointment.gioBatDau}
                      </div>
                    </td>
                    <td className='px-6 py-4'>
                      <span
                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${getStatusColor(appointment.trangThai)}`}
                      >
                        {appointment.trangThai}
                      </span>
                    </td>
                    <td className='px-6 py-4'>
                      <div className='flex gap-2'>
                        <button
                          onClick={() => handleViewDetails(appointment)}
                          className='cursor-pointer rounded-lg border border-orange-300 bg-white px-4 py-2 text-sm font-medium text-orange-600 transition-colors hover:bg-orange-50'
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleEdit(appointment)}
                          className='cursor-pointer rounded-lg bg-orange-500 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-orange-600'
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(appointment)}
                          className='cursor-pointer rounded-lg bg-red-500 p-2 text-white transition-colors hover:bg-red-600'
                        >
                          <Trash2 className='h-5 w-5' />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {!isLoading && pagination.totalPage > 1 && (
          <div className='flex justify-center border-t border-gray-200 py-4'>
            <Pagination currentPage={currentPage} totalPages={pagination.totalPage} onPageChange={handlePageChange} />
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
