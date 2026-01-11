import { Pill, Loader2, ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { usePrescriptionByMedicalRecord } from '~/hooks/usePrescriptions';

interface MedicalRecordPrescriptionProps {
  idHoSo: number;
}

const MedicalRecordPrescription = ({ idHoSo }: MedicalRecordPrescriptionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: prescriptionData, isLoading } = usePrescriptionByMedicalRecord(idHoSo, true);

  const prescription = prescriptionData?.data?.data;

  if (isLoading) {
    return (
      <div className='mt-2 flex items-center gap-2 text-sm text-gray-500'>
        <Loader2 className='h-4 w-4 animate-spin' />
        <span>Loading prescription...</span>
      </div>
    );
  }

  if (!prescription || !prescription.toaSanPhamList || prescription.toaSanPhamList.length === 0) {
    return null;
  }

  return (
    <div className='mt-3 border-t border-gray-200 pt-3'>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className='flex w-full cursor-pointer items-center justify-between text-sm font-semibold text-blue-600 transition-colors hover:text-blue-700'
      >
        <div className='flex items-center gap-2'>
          <Pill className='h-4 w-4' />
          <span>Prescription ({prescription.toaSanPhamList.length} medicines)</span>
        </div>
        {isExpanded ? <ChevronUp className='h-4 w-4' /> : <ChevronDown className='h-4 w-4' />}
      </button>

      {isExpanded && (
        <div className='mt-2 space-y-2 rounded-lg bg-blue-50 p-3'>
          <p className='text-xs text-gray-600'>Code: {prescription.maToa}</p>
          {prescription.toaSanPhamList.map((medicine, index) => (
            <div key={medicine.idSanPham} className='rounded border border-blue-200 bg-white p-2 text-sm'>
              <div className='flex items-start justify-between'>
                <div className='flex gap-2'>
                  <span className='flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-blue-100 text-xs font-semibold text-blue-700'>
                    {index + 1}
                  </span>
                  <div>
                    <p className='font-medium text-gray-900'>{medicine.tenSanPham}</p>
                    <p className='text-xs text-gray-600'>
                      Qty: {medicine.soLuong} × {medicine.donGia.toLocaleString('vi-VN')}đ
                    </p>
                  </div>
                </div>
                <span className='font-semibold text-blue-600'>{medicine.thanhTien.toLocaleString('vi-VN')}đ</span>
              </div>
            </div>
          ))}
          <div className='flex justify-between border-t border-blue-200 pt-2 text-sm font-semibold'>
            <span>Total:</span>
            <span className='text-blue-600'>
              {prescription.toaSanPhamList.reduce((sum, item) => sum + item.thanhTien, 0).toLocaleString('vi-VN')}đ
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default MedicalRecordPrescription;
