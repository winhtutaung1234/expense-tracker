import { useEffect, useState, useRef } from 'react';
import Logo from '../../Assets/Logo';
import { NavProps } from '../../Types/Props/Nav';
import { Modal } from '../Modal';
import Auth from '../../Services/Auth/Auth';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

const Nav = (props: NavProps) => {
    const { user, showNav } = props;
    const [dropdownAnimation, setDropdownAnimation] = useState<'open' | 'close' | null>(null);
    const [showLogoutModal, setShowLogoutModal] = useState(false);
    const navigate = useNavigate();
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { pathname } = useLocation();

    useEffect(() => {
        if (dropdownAnimation) {
            setDropdownAnimation('close');
        }
    }, [pathname])

    const handleLogoutClick = () => {
        setShowLogoutModal(true);
    };

    const handleScroll = () => {
        if (dropdownAnimation === "open") {
            setDropdownAnimation('close');
        }
    };

    const onClose = () => {
        setShowLogoutModal(false);
    };

    const toggleDropDown = () => {
        setDropdownAnimation((prevData) =>
            prevData ? (prevData === 'open' ? 'close' : 'open') : 'open'
        );
    };

    const onConfirm = () => {
        Auth.logout()
            .then(() => {
                navigate('/login');
            })
            .catch(() => {
            });
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node) &&
                dropdownAnimation === 'open'
            ) {
                setDropdownAnimation('close');
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('scroll', handleScroll)

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('close', handleScroll)
        };
    }, [dropdownAnimation]);

    return (
        <>
            <nav className={`flex fixed items-center justify-between top-10 left-1/2 -translate-x-1/2 w-[80%] py-4 ps-8 pe-14 rounded-full transition-all duration-300 ${showNav ? "opacity-100" : "opacity-0"}`}>
                <div className='flex z-20'>
                    <img width={60} src={Logo} />
                    <div className='flex flex-col items-center'>
                        <p className='font-alexbrush text-3xl dark:text-white'>Budget Flow</p>
                        <p className='font-arsenal text-[8px] dark:text-white'>Free yourself Financially</p>
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
                    <div className='relative' ref={dropdownRef}>
                        {user && (
                            <button onClick={toggleDropDown}>{user.name}</button>
                        )}
                        <div
                            className={`absolute dark:bg-[#2f2f2f] rounded-sm border border-dark-yellow py-4 px-12 top-[125%] flex flex-col justify-center items-center gap-4 -translate-y-2 opacity-0
                            ${dropdownAnimation === 'open' ? "animate-openDropDown opacity-100" : ""}
                            ${dropdownAnimation === 'close' ? "animate-closeDropDown opacity-0" : ""}`}
                            style={{ transition: 'opacity 0.25s ease-in-out' }}
                        >
                            <NavLink to="/accounts">Accounts</NavLink>
                            <a>Setting</a>
                            <button onClick={handleLogoutClick}>Logout</button>
                        </div>
                    </div>
                </div>
                <div className='absolute z-10 left-0 dark:bg-dark-nav-background bg-light-nav-background rounded-full w-full h-full'></div>
                <div className='absolute left-1/2 top-1/2 bg-nav-border rounded-full -translate-x-1/2 -translate-y-1/2 shadow-md' style={{ width: "calc(100% + 1.5px)", height: "calc(100% + 1.5px)" }}></div>
            </nav >
            {showLogoutModal && <Modal type='logout' onClose={onClose} onConfirm={onConfirm} />}
        </>
    );
};

export default Nav;
