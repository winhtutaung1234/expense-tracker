import Logo from '../../Assets/Logo'
import { NavProps } from '../../Types/Props/Nav';

const Nav = (props: NavProps) => {
    const { user, showNav } = props;
    return (
        <nav className={`flex fixed items-center justify-between top-10 left-1/2 -translate-x-1/2 w-[80%] py-4 px-8 rounded-full transition-all duration-300 ${showNav ? "opacity-100" : "opacity-0"}`}>
            <div className='flex z-20'>
                <img width={60} src={Logo} />
                <div className='flex flex-col items-center'>
                    <p className='font-alexbrush text-3xl text-white'>Budget Flow</p>
                    <p className='font-arsenal text-[8px] text-white'>Free yourself Financially</p>
                </div>
            </div>
            <div className='flex flex-[0.7] justify-between z-20 dark:text-white'>
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
                    {user && (
                        <p>{user.name}</p>
                    )}
                </a>
            </div>
            <div className='absolute z-10 left-0 bg-dark-nav-background rounded-full w-full h-full'></div>
            <div className='absolute left-1/2 top-1/2 bg-nav-border rounded-full -translate-x-1/2 -translate-y-1/2' style={{ width: "calc(100% + 1.5px)", height: "calc(100% + 1.5px)" }}></div>
        </nav >
    )
}

export default Nav