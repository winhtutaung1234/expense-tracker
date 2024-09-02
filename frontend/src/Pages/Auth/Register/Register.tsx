import { ChangeEvent, useState } from 'react'
import Logo from '../../../Assets/Logo'
import { Facebook, Google } from '../../../Assets/LoginRegister'
import { Link } from 'react-router-dom'
import { RegisterForm } from '../../../Types/Auth/Register'

const Register = () => {
    const [registerFromData, setRegisterFromData] = useState<RegisterForm>({
        name: "",
        email: "",
        password: "",
        confirmpassword: "",
    })
    
    const [error, setError] = useState();

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        setRegisterFromData((prevData) => ({
            ...prevData,
            [e.target.name]: e.target.value
        }))
    }

    return (
        <main className="dark:bg-dark-custom bg-white-custom min-h-svh flex justify-center items-center">
            <form className="flex items-center flex-col min-w-[330px]">
                <div className="flex -translate-x-2">
                    <img src={Logo} />
                    <div className="flex flex-col items-center">
                        <h1 className="font-alexbrush text-4xl dark:text-white drop-shadow-logo">Budget Flow</h1>
                        <p className="font-arsenal italic dark:text-white text-xs">Free yourself Financially</p>
                    </div>
                </div>

                <div className="w-full relative mt-5">
                    <svg version="1.1" viewBox="0 0 24 24" className='fill-current dark:text-white opacity-50 w-[20px] absolute top-1/2 -translate-y-1/2 translate-x-2'><g id="info" />
                        <g id="icons">
                            <g id="user"><ellipse cx="12" cy="8" rx="5" ry="6" />
                                <path d="M21.8,19.1c-0.9-1.8-2.6-3.3-4.8-4.2c-0.6-0.2-1.3-0.2-1.8,0.1c-1,0.6-2,0.9-3.2,0.9s-2.2-0.3-3.2-0.9    C8.3,14.8,7.6,14.7,7,15c-2.2,0.9-3.9,2.4-4.8,4.2C1.5,20.5,2.6,22,4.1,22h15.8C21.4,22,22.5,20.5,21.8,19.1z" />
                            </g>
                        </g>
                    </svg>
                    <input
                        value={registerFromData.name}
                        name='name'
                        onChange={handleInputChange}
                        className="dark:bg-gray placeholder:text-black shadow placeholder:dark:text-white placeholder:opacity-50 placeholder:font-montserrat py-2 ps-10 w-full rounded-md" placeholder="Email" />
                </div>
                <div className="w-full relative mt-3">
                    <svg viewBox="0 0 512 512" className='fill-current dark:text-white opacity-50 w-[20px] absolute top-1/2 -translate-y-1/2 translate-x-2'>
                        <path d="M48 64C21.5 64 0 85.5 0 112c0 15.1 7.1 29.3 19.2 38.4L236.8 313.6c11.4 8.5 27 8.5 38.4 0L492.8 150.4c12.1-9.1 19.2-23.3 19.2-38.4c0-26.5-21.5-48-48-48L48 64zM0 176L0 384c0 35.3 28.7 64 64 64l384 0c35.3 0 64-28.7 64-64l0-208L294.4 339.2c-22.8 17.1-54 17.1-76.8 0L0 176z" />
                    </svg>
                    <input
                        value={registerFromData.email}
                        name='email'
                        onChange={handleInputChange}
                        className="dark:bg-gray placeholder:text-black shadow placeholder:dark:text-white placeholder:opacity-50 placeholder:font-montserrat py-2 ps-10 w-full rounded-md" placeholder="Email" />
                </div>
                <div className="w-full relative mt-3">
                    <svg viewBox="0 0 448 512" className='fill-current dark:text-white opacity-50 w-[15px] absolute top-1/2 -translate-y-1/2 translate-x-3'>
                        <path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z" />
                    </svg>
                    <input
                        value={registerFromData.password}
                        name='password'
                        onChange={handleInputChange}
                        className="dark:bg-gray placeholder:text-black shadow placeholder:dark:text-white placeholder:opacity-50 placeholder:font-montserrat py-2 ps-10 w-full rounded-md" placeholder="Password" />
                </div>
                <div className="w-full relative mt-3">
                    <svg viewBox="0 0 448 512" className='fill-current dark:text-white opacity-50 w-[15px] absolute top-1/2 -translate-y-1/2 translate-x-3'>
                        <path d="M144 144l0 48 160 0 0-48c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192l0-48C80 64.5 144.5 0 224 0s144 64.5 144 144l0 48 16 0c35.3 0 64 28.7 64 64l0 192c0 35.3-28.7 64-64 64L64 512c-35.3 0-64-28.7-64-64L0 256c0-35.3 28.7-64 64-64l16 0z" />
                    </svg>
                    <input
                        value={registerFromData.confirmpassword}
                        name='confirmpassword'
                        onChange={handleInputChange}
                        className="dark:bg-gray placeholder:text-black shadow placeholder:dark:text-white placeholder:opacity-50 placeholder:font-montserrat py-2 ps-10 w-full rounded-md" placeholder="Confirm Password" />
                </div>
                <a href='#' className='text-dark-yellow dark:text-yellow text-sm self-end mt-2 font-montserrat'>Forgot Password?</a>
                <button className='bg-yellow w-full py-2 rounded-md mt-5 font-montserrat bg-login-button shadow'>Login</button>
                <div className='w-full flex justify-between items-center opacity-25 dark:opacity-50 mt-8'>
                    <div className='h-[1px] border dark:border-white w-[45%]'></div>
                    <p className='dark:text-white -translate-y-[2px]'>or</p>
                    <div className='h-[1px] border dark:border-white w-[45%]'></div>
                </div>
                <div className='flex w-full justify-around mt-7'>
                    <div className='bg-white py-3 rounded-md w-[40%] flex justify-center gap-2 shadow'>
                        <img src={Google} className='w-[25px]' />
                        <p className='font-montserrat font-thin'>Google</p>
                    </div>
                    <div className='bg-white py-3 rounded-md w-[40%] flex justify-center gap-2 shadow'>
                        <img src={Facebook} className='w-[25px]' />
                        <p className='font-montserrat font-thin'>Facebook</p>
                    </div>
                </div>
                <p className='dark:text-white font-montserrat mt-9'>
                    <span className='opacity-50'>Don't have an account yet? </span>
                    <Link to='/login' className='text-dark-yellow dark:text-yellow opacity-100'>Login</Link>
                </p>
            </form>
        </main>
    )
}

export default Register
