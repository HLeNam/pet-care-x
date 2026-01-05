const Appointment = () => {
  // Mock data
  const records = [
    {
      id: 1,
      petName: 'Milo',
      date: '2025-12-20',
      doctor: 'BS. Nguyễn Văn A',
      diagnosis: 'Viêm tai ngoài',
      treatment: 'Sử dụng thuốc nhỏ tai, tái khám sau 7 ngày',
      cost: 250000
    },
    {
      id: 2,
      petName: 'Milo',
      date: '2025-11-15',
      doctor: 'BS. Trần Thị B',
      diagnosis: 'Tiêm phòng định kỳ',
      treatment: 'Vaccine 6 bệnh, tái khám sau 3 tuần',
      cost: 150000
    }
  ];

  return (
    <div className='mx-auto max-w-6xl'>
      <h2 className='mb-6 text-xl font-semibold text-gray-800'>Medical History</h2>

      <div className='relative space-y-6'>
        {/* Vertical Line */}
        <div className='absolute top-0 left-4 h-full w-0.5 bg-gray-200' />

        {records.map((record) => (
          <div key={record.id} className='relative pl-12'>
            {/* Timeline Dot */}
            <div className='absolute top-1 left-0 flex h-8 w-8 items-center justify-center rounded-full bg-lime-100'>
              <svg className='h-4 w-4 text-lime-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                />
              </svg>
            </div>

            {/* Record Card */}
            <div className='rounded-lg bg-white p-6 shadow-md'>
              <div className='mb-4 flex items-start justify-between'>
                <div>
                  <h3 className='text-lg font-semibold text-gray-800'>
                    {record.petName} - {record.diagnosis}
                  </h3>
                  <p className='mt-1 text-sm text-gray-600'>
                    <span className='font-medium'>Doctor:</span> {record.doctor}
                  </p>
                </div>
                <div className='text-right'>
                  <span className='text-sm text-gray-500'>{new Date(record.date).toLocaleDateString('vi-VN')}</span>
                  <p className='mt-1 text-lg font-semibold text-lime-600'>{record.cost.toLocaleString('vi-VN')}đ</p>
                </div>
              </div>

              {/* Treatment Details */}
              <div className='rounded-lg bg-gray-50 p-4'>
                <h4 className='mb-2 text-sm font-medium text-gray-700'>Phương pháp điều trị:</h4>
                <p className='text-sm text-gray-600'>{record.treatment}</p>
              </div>

              {/* Actions */}
              <div className='mt-4 flex gap-2'>
                <button className='text-sm text-lime-600 hover:text-lime-700 hover:underline'>View Details →</button>
                {/* <button className='ml-auto text-sm text-gray-600 hover:text-gray-700 hover:underline'>
                  Tải xuống hồ sơ
                </button> */}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {records.length === 0 && (
        <div className='rounded-lg bg-white p-12 text-center shadow-md'>
          <svg className='mx-auto h-16 w-16 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={1.5}
              d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
            />
          </svg>
          <p className='mt-4 text-gray-600'>No medical records yet</p>
        </div>
      )}
    </div>
  );
};

export default Appointment;
