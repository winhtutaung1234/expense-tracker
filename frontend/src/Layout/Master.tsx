import React from 'react'
import { Outlet } from 'react-router-dom'
import Logo from '../Assets/Logo'

const Master = () => {
    return (
        <>
            <nav className='flex fixed items-center justify-between top-10 left-1/2 -translate-x-1/2 w-[80%] py-4 px-8 rounded-full'>
                <div className='flex z-20'>
                    <img width={60} src={Logo} />
                    <div className='flex flex-col items-center'>
                        <p className='font-alexbrush text-3xl text-white'>Budget Flow</p>
                        <p className='font-arsenal text-[8px] text-white'>Free yourself Financially</p>
                    </div>
                </div>
                <div className='flex flex-[0.7] justify-between z-20'>
                    <a>
                        <p>Dashboard</p>
                    </a>
                    <a>
                        <p>Transactions</p>
                    </a>
                    <a>
                        <p>Finance</p>
                    </a>
                    <a>
                        <p>Toe Oo Wai Yan</p>
                    </a>
                </div>
                <div className='absolute z-10 left-0 bg-dark-nav-background rounded-full w-full h-full'></div>
                <div className='absolute left-1/2 top-1/2 bg-nav-border rounded-full -translate-x-1/2 -translate-y-1/2' style={{ width: "calc(100% + 1.5px)", height: "calc(100% + 1.5px)" }}></div>
            </nav>
            <div className='mt-40 flex w-[80%] justify-center'>
                <div className='flex-[0.75]'>
                    <Outlet />
                </div>
            </div>
        </>
    )
}

export default Master