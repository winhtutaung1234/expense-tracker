import { useEffect, useState } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Auth from '../../Services/Auth/Auth';
import { User } from '../../Types/User';
import Nav from '../../Components/Nav/Nav';

const Master = () => {
    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [user, setUser] = useState<User | null>();

    const controlNav = () => {
        if (window.scrollY > lastScrollY) {
            setShowNav(false);
        } else {
            setShowNav(true);
        }
        setLastScrollY(window.scrollY);
    };

    useEffect(() => {
        const handleScroll = () => {
            controlNav();
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [lastScrollY]);


    const navigate = useNavigate();

    useEffect(() => {
        Auth.verify()
            .then((data) => {
                setUser(data)
            })
            .catch(() => {
                navigate('/login');
            })
    }, []);

    useEffect(() => {
        if (user && !user.email_verified) {
            navigate('/email-verify');
        }
    }, [user])

    return (    
        <>
            {
                user && user.email_verified && (
                    <Nav user={user} showNav={showNav} />
                )
            }

            <div className={`xl:px-36 px-4 ${user && user.email_verified && "mt-40"}`}>
                <Outlet />
            </div>
        </>
    );
}

export default Master;
