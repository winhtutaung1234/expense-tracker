import { useNavigate } from 'react-router-dom';
import Logo from '../../../Assets/Logo';
import { useEffect } from 'react';

const EmailVerified = () => {

    const navigate = useNavigate();

    useEffect(() => {
        const timer = setTimeout(() => {
            navigate('/');
        }, 3500);

        return () => clearTimeout(timer);
    }, [])

    return (
        <main className='min-h-[100svh] flex justify-center items-center px-3'>
            <div className='flex flex-col gap-8 -translate-y-10 md:w-1/2 sm:w-[80%]'>
                <div className="flex -translate-x-2 justify-center opacity-0 animate-opacityAppear">
                    <img src={Logo} alt="Logo" />
                    <div className="flex flex-col items-center">
                        <h1 className="font-alexbrush text-4xl dark:text-white drop-shadow-logo">Budget Flow</h1>
                        <p className="font-arsenal italic dark:text-white text-xs">Free yourself Financially</p>
                    </div>
                </div>
                <div className='relative flex justify-end items-center gap-5 sm:p-8 p-3 rounded-md'>
                    <svg id="Icons" viewBox="0 0 24 24" className='xl:w-[100px] md:w-[75px] w-[75px] fill-current absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-yellow opacity-0 animate-moveLeft'>
                        <path className="cls-1" d="M12,1A11,11,0,1,0,23,12,11,11,0,0,0,12,1Zm5.707,8.707-7,7a1,1,0,0,1-1.414,0l-3-3a1,1,0,0,1,1.414-1.414L10,14.586l6.293-6.293a1,1,0,0,1,1.414,1.414Z" />
                    </svg>
                    <div className=' text-white text-[10px] xl:text-[14px] font-montserrat sm:flex-[0.75] flex-[0.7] opacity-0 animate-opacityAppearHalf'>
                        Your email has been successfully verified! You can now access all the features of Budget Flow. Thank you for confirming your email. If you have any questions or need further assistance, feel free to reach out to our support team.
                    </div>
                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gray rounded-lg -z-10 h-full transition-all border-none animate-takeFullWidth'></div>
                </div>
            </div>
        </main>
    );
}

export default EmailVerified;
