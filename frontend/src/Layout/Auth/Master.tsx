import { useEffect, useMemo, useState } from 'react'
import { Outlet, useLocation, useNavigate } from 'react-router-dom'
import Auth from '../../Services/Auth';
import { User } from '../../Types/User';
import Nav from '../../Components/Nav/Nav';

const Master = () => {
    const [showNav, setShowNav] = useState(true);
    const [lastScrollY, setLastScrollY] = useState(0);
    const [user, setUser] = useState<User | null>();
    const [loading, setLoading] = useState<Boolean>(false);
    const location = useLocation();
    const { pathname } = location;


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

    useMemo(() => {
        setLoading(true);
        Auth.verify()
            .then((data) => {
                setUser(data)
                setLoading(false);
            })
            .catch(() => {
                setUser(null);
                navigate('/login');
                setLoading(false);
            })
    }, [pathname]);

    useEffect(() => {
        if (user && !user.email_verified_at) {
            navigate('/email-verify');
        }
    }, [user])

    return (
        <>
            {
                user && user.email_verified_at && (
                    <Nav user={user} showNav={showNav} />
                )
            }

            <div className={`xl:px-36 px-4 pb-20 ${user && user.email_verified_at && "mt-40"}`}>
                {user && !loading && (
                    <Outlet context={{showNav}} />
                )}
            </div>
        </>
    );
}

export default Master;
