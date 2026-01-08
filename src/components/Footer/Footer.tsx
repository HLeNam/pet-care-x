import { Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAppContext } from '~/contexts';

const Footer = () => {
  const { isAuthenticated } = useAppContext();

  return (
    <footer className='mx-2 mt-12'>
      <div className='rounded-lg bg-gray-900 text-gray-300'>
        <div className='mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16'>
          <div className='grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-5'>
            {/* Logo and Description */}
            <div className='sm:col-span-2 lg:col-span-2'>
              <Link to='/products' className='group flex items-center gap-2'>
                <img src='/assets/images/logo.svg' alt='PetCareX Logo' className='h-8 w-8 object-contain' />
                <span className='text-xl font-bold text-white'>
                  PetCare<span className='text-orange-500'>X</span>
                </span>
              </Link>
              <p className='mt-4 max-w-md text-sm leading-relaxed text-gray-400'>
                PetCareX is an all-in-one pet care platform that helps pet owners schedule veterinary appointments,
                manage pet medical records, and purchase pet products and medicines online.
              </p>
            </div>

            {/* Services Column */}
            <div>
              <h3 className='mb-4 text-base font-semibold text-white'>Services</h3>
              <ul className='space-y-3'>
                <li>
                  <Link to='/products' className='text-sm transition-colors hover:text-orange-500'>
                    Pet Products & Medicines
                  </Link>
                </li>
                <li>
                  <Link to='/appointments' className='text-sm transition-colors hover:text-orange-500'>
                    Veterinary Appointment Booking
                  </Link>
                </li>
                <li>
                  <Link to='/doctor-schedule' className='text-sm transition-colors hover:text-orange-500'>
                    Doctor Schedule Lookup
                  </Link>
                </li>
                {isAuthenticated && (
                  <>
                    <li>
                      <Link to='/profile/pets' className='text-sm transition-colors hover:text-orange-500'>
                        Pet Profile Management
                      </Link>
                    </li>
                    <li>
                      <Link to='/profile/medical-history' className='text-sm transition-colors hover:text-orange-500'>
                        Medical History Tracking
                      </Link>
                    </li>
                  </>
                )}
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className='mb-4 text-base font-semibold text-white'>Company</h3>
              <ul className='space-y-3'>
                <li>
                  <Link to='/about' className='text-sm transition-colors hover:text-orange-500'>
                    About PetCareX
                  </Link>
                </li>
                <li>
                  <Link to='/contact' className='text-sm transition-colors hover:text-orange-500'>
                    Contact & Support
                  </Link>
                </li>
                <li>
                  <Link to='/terms' className='text-sm transition-colors hover:text-orange-500'>
                    Terms of Service
                  </Link>
                </li>
                <li>
                  <Link to='/privacy' className='text-sm transition-colors hover:text-orange-500'>
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>

            {/* Social Media Column */}
            <div>
              <h3 className='mb-4 text-base font-semibold text-white'>Social Media</h3>
              <div className='flex flex-wrap gap-3'>
                <a
                  href='https://facebook.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-all hover:scale-110 hover:bg-orange-500'
                  aria-label='Facebook'
                >
                  <Facebook className='h-5 w-5' />
                </a>
                <a
                  href='https://twitter.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-all hover:scale-110 hover:bg-orange-500'
                  aria-label='Twitter'
                >
                  <Twitter className='h-5 w-5' />
                </a>
                <a
                  href='https://linkedin.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-all hover:scale-110 hover:bg-orange-500'
                  aria-label='LinkedIn'
                >
                  <Linkedin className='h-5 w-5' />
                </a>
                <a
                  href='https://instagram.com'
                  target='_blank'
                  rel='noopener noreferrer'
                  className='flex h-10 w-10 items-center justify-center rounded-lg bg-gray-800 transition-all hover:scale-110 hover:bg-orange-500'
                  aria-label='Instagram'
                >
                  <Instagram className='h-5 w-5' />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className='border-t border-gray-800'>
          <div className='mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8'>
            <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
              <p className='text-sm text-gray-400'>© {new Date().getFullYear()} PetCareX. All rights reserved.</p>
              <div className='flex gap-6 text-sm'>
                <Link to='/terms' className='text-gray-400 transition-colors hover:text-orange-500'>
                  Terms
                </Link>
                <Link to='/privacy' className='text-gray-400 transition-colors hover:text-orange-500'>
                  Privacy
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
