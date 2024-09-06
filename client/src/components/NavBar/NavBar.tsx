import Button from '../../components/Button/Button';
import React, { useEffect, useState } from "react";
import handlerNavigationNavBar from '../../utils/handlerNavigationNavBar';
import { useNavigate, useLocation } from 'react-router-dom';

function NavBar() {
    const [showLogout, setshowLogout] = useState<boolean>(false);

    const navigate = useNavigate();
    const location = useLocation();

    const handleButton = (event: React.MouseEvent<HTMLButtonElement>) => {
        const { id } = event.target as HTMLButtonElement;
        handlerNavigationNavBar(id, navigate);
    }

    const fetchLogoutUser = async (token:string, url: string) => {
        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });
            
            const data = await response.json(); // Here extract the body of the response
            
            if (data.status !== 200){
                console.error('Error ' + data.status + ' in the response, ' + data.message);
                return data.status
            }
            
            return data.status
        }
        catch(err: any){
            console.error(err);
            return 500
        }
    }

    const handleLogOut = async () => {
        const token = localStorage.getItem('userToken') || false;
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/logout-user';
        
        if(!token){
            console.error('userToken not found');
            return 
        }

        const statusLogoutUser = await fetchLogoutUser(token, url);

        if(statusLogoutUser === 200){
            localStorage.removeItem('userToken');
            setshowLogout(false);
            navigate('/');
            return
        }
    }

    const handleShowLogout = () => {
        const token = localStorage.getItem('userToken') || false;
        setshowLogout(!!token);
    }

    useEffect(() => {
        handleShowLogout();
    }, [location])

    return(
        <>
            <nav>
                Este es el navbar

                <Button
                    id = 'irLogin'
                    text = 'LOGIN'
                    type = 'button'
                    classes = {['']}
                    onClick = {handleButton}
                />
                {
                    showLogout ? (
                        <Button
                            id = 'logout'
                            text = 'LOGOUT'
                            type = 'button'
                            classes = {['']}
                            onClick = {handleLogOut}
                        />
                    ) : null
                }
                

            </nav>
        </>
    )
}

export default NavBar;