import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import Auth from '../../Services/Auth/Auth'

const Guest = () => {
    const navigate = useNavigate();
    useEffect(() => {
        Auth.verify()
            .then(() => {
                navigate('/');
            })
    }, [])
    return (
        <Outlet />
    )
}

export default Guest