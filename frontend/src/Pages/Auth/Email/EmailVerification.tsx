import { useEffect, useState } from 'react'
import Logo from '../../../Assets/Logo'
import { User } from '../../../Types/User';
import Auth from '../../../Services/Auth/Auth';
import { useNavigate } from 'react-router-dom';

const EmailVerification = () => {
    const [user, setUser] = useState<User | null>();
    const navigate = useNavigate();

    useEffect(() => {
        Auth.verify()
            .then((data) => {
                if (data.email_verified) {
                    navigate('/');
                } else {
                    setUser(data)
                }
            }).catch(() => {
                navigate('/login');
            })
    }, [])

    return (
        <main className='min-h-[100svh] flex justify-center items-center'>
            <form className='flex flex-col  xl:w-[30%] md:w-[50%] sm:w-[65%] gap-3 -translate-y-[10%]'>
                <div className="flex -translate-x-2 justify-center">
                    <img src={Logo} />
                    <div className="flex flex-col items-center">
                        <h1 className="font-alexbrush text-4xl dark:text-white drop-shadow-logo">Budget Flow</h1>
                        <p className="font-arsenal italic dark:text-white text-xs">Free yourself Financially</p>
                    </div>
                </div>
                <div className='dark:bg-gray dark:text-white px-10 py-8 flex flex-col gap-5 border-t-[1px] border-t-light-yellow'>
                    <div className='flex items-center gap-3'>
                        <svg viewBox="0 0 512 512" className='fill-current dark:text-white w-[50px]'>
                            <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                        </svg>
                        <p className='text-[24px] font-bold font-inter'>Verify it's you.</p>
                    </div>
                    <div className='text-[14px]'>
                        <span className='opacity-50'>
                            We have sent  an email verification link to
                        </span>
                        <span className='underline'> {user && user.email}</span>
                        <span className='opacity-50'>
                            . Please check your inbox and enter the link to verify.
                        </span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p>Didn't recieve an email?</p>
                        <button className='bg-login-button text-black font-montserrat py-3 rounded-md'>
                            Send Verification Link Again
                        </button>
                    </div>
                </div>
            </form>
        </main>
    )
}

export default EmailVerification