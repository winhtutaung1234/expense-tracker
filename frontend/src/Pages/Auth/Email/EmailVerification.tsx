import { useEffect, useRef, useState } from 'react';
import Logo from '../../../Assets/Logo';
import { useLocation, useNavigate } from 'react-router-dom';
import { VerifyEmailProps } from '../../../Types/Auth/Email';
import Auth from '../../../Services/Auth';
import Storage from '../../../Services/Storage';

const EmailVerification = () => {
    const location = useLocation();
    const rawSearch = location.search;
    const [redirect, setRedirect] = useState(false);
    const navigate = useNavigate();
    const [buttonDisabled, setButtonDisabled] = useState(true);
    const [countdown, setCountdown] = useState(10);
    const countdownRef = useRef<number | null>(null);
    const intervalRef = useRef<number | null>(null);

    const [verifyEmailPayload, setVerifyEmailPayload] = useState<VerifyEmailProps>({
        user_id: "",
        email: location.state?.email || "",
        token: "",
    });

    useEffect(() => {
        countdownRef.current = countdown;
        intervalRef.current = setInterval(() => {
            setCountdown((prev) => {
                if (prev <= 1) {
                    if (intervalRef.current) {
                        clearInterval(intervalRef.current);
                    }
                    setButtonDisabled(false);
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, []);

    useEffect(() => {
        if (Boolean(rawSearch)) {
            const params = new URLSearchParams(rawSearch);
            setVerifyEmailPayload((prevData) => {
                const newData = { ...prevData };
                for (const [key, value] of params.entries()) {
                    if (key in newData) {
                        newData[key as keyof VerifyEmailProps] = value;
                    }
                }
                return newData;
            });
        } else {
            if (!Boolean(verifyEmailPayload.email)) {
                setRedirect(true);
            }
        }
    }, [rawSearch]);

    useEffect(() => {
        if (redirect) {
            navigate('/');
        }
    }, [redirect, navigate]);

    useEffect(() => {
        if (Boolean(verifyEmailPayload.user_id) && Boolean(verifyEmailPayload.token)) {
            Auth.verifyEmail(verifyEmailPayload)
                .then((data) => {
                    Storage.setItem('Access Token', data.accessToken);
                    navigate('/email-verified', { state: { hasAccess: true } });
                })
                .catch((error) => {
                    // console.log(error);
                });
        }
    }, [verifyEmailPayload, navigate]);

    const handleSendVerificationLinkAgain = () => {
        Auth.resendEmail()
            .then(() => {
                setButtonDisabled(true);
                setCountdown(10);

                if (intervalRef.current) {
                    clearInterval(intervalRef.current);
                }

                intervalRef.current = setInterval(() => {
                    setCountdown((prev) => {
                        if (prev <= 1) {
                            if (intervalRef.current) {
                                clearInterval(intervalRef.current);
                            }
                            setButtonDisabled(false);
                            return 0;
                        }
                        return prev - 1;
                    });
                }, 1000);
            })
            .catch((error) => {
                // console.log(error);
            })
    };

    return (
        <main className='min-h-[100svh] flex justify-center items-center bg-white-custom dark:bg-dark-custom'>
            <div className='flex flex-col xl:w-[30%] md:w-[50%] sm:w-[65%] gap-3 -translate-y-[10%]'>
                <div className="flex -translate-x-2 justify-center">
                    <img src={Logo} alt="Logo" />
                    <div className="flex flex-col items-center">
                        <h1 className="font-alexbrush text-4xl dark:text-white drop-shadow-logo">Budget Flow</h1>
                        <p className="font-arsenal italic dark:text-white text-xs">Free yourself Financially</p>
                    </div>
                </div>
                <div className='bg-white shadow-md dark:bg-gray dark:text-white px-10 py-8 flex flex-col gap-5 border-t-[1px] border-t-light-yellow'>
                    <div className='flex items-center gap-3'>
                        <svg viewBox="0 0 512 512" className='fill-current dark:text-white w-[50px]'>
                            <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                        </svg>
                        <p className='text-[24px] font-bold font-inter'>Verify it's you.</p>
                    </div>
                    <div className='text-[14px]'>
                        <span className='opacity-50'>
                            We have sent an email verification link to
                        </span> <span className='underline'>{verifyEmailPayload.email}</span>
                        <span className='opacity-50'>
                            . Please check your inbox and enter the link to verify.
                        </span>
                    </div>
                    <div className='flex flex-col gap-2'>
                        <p>Didn't receive an email?</p>
                        <div className='relative'>
                            {buttonDisabled && (
                                <>
                                    <div className='absolute bg-gray opacity-75 w-full h-full rounded-md'></div>
                                    <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-white'>
                                        {countdown}s
                                    </div>
                                </>
                            )}
                            <button
                                onClick={handleSendVerificationLinkAgain}
                                className={`bg-login-button text-black font-montserrat py-3 rounded-md w-full ${buttonDisabled ? 'cursor-not-allowed' : ''}`}
                                disabled={buttonDisabled}
                            >
                                Send Verification Link Again
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default EmailVerification;
