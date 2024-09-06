import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import Modal from '../../components/Modal/Modal';
import React, { ChangeEvent, useState } from 'react';
import { useModal } from '../../utils/useModal';

function LoginForm ()  {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { showModal, closeModal, isModalOpen } = useModal();
    const [errorLogin, setErrorLogin] = useState<string | null>(null);


    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if(name === 'username'){
            setUsername(value);
        }
        else {
            setPassword(value);
        }
    }

    const fetchLoginUser = async (url: string, bodyReq: string) => {
        try{
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: bodyReq
            });
            
            const data = await response.json(); // Here extract the body of the response
            
            if (data.status !== 200){
                console.error('Error ' + data.status + ' in the response, ' + data.message);
                return data
            }
            
            return data
        }
        catch(err: any){
            console.error(err);
            return 500
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        showModal('loaderLogin');
        event.preventDefault();
        const { username, password } = event.target as HTMLFormElement; //This allow access to the form features
        const bodyReq = JSON.stringify({
            username: username.value,
            password: password.value
        });
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/login-user';

        try{
            const dataLogin = await fetchLoginUser(url, bodyReq);

            if(!dataLogin.token){
                closeModal();
                setErrorLogin('Error ' + dataLogin.message);
                return
            }

            localStorage.setItem('userToken', dataLogin.token);
            navigate(from, {replace: true});
            closeModal();
            return
        }
        catch(err){
            console.error('There is an error' + err);
            return
        }
    }

    return(
        <>
            <Modal
                id = 'modal1'
                type = 'informative'
                title = 'Titulo'
                paragraph = 'si'
                isOpen = {isModalOpen('modal1')}
                classes = {['modal-infomative-grey']}
                onClose={closeModal}
            />

            <Modal
                id = 'loaderLogin'
                type = 'loader'
                title = 'Titulo loader'
                isOpen = {isModalOpen('loaderLogin')}
                classes = {['modal-loader-grey']}
                onClose={closeModal}
            />
        

            <form onSubmit={handleSubmit}>
                <div className='error'>
                    {
                        errorLogin !== null ? (
                            <div>
                                {errorLogin}
                            </div>
                        ) : null
                    }
                </div>
                <InputField
                    label = 'Nombre Usuario'
                    name = 'username'
                    type = 'text'
                    required = {true}
                    value = {username}
                    placeholder = 'Ingrese nombre'
                    classes = {['clase1', 'clase2']}
                    onChange = {handleOnChange}
                />
                <InputField
                    label = 'Contraseña'
                    name = 'password'
                    type = 'password'
                    required = {true}
                    value = {password}
                    placeholder = 'Ingrese contraseña'
                    classes = {['claseP1', 'claseP2']}
                    onChange = {handleOnChange}
                />
                <Button
                    id = 'btnLogin'
                    text = 'boton1'
                    type = 'submit'
                    classes = {['backgorund-color-blue-violet', 'color-white']}
                />
                
            </form>

            <div onClick={() => {
                showModal('modal1');
            }}>
                Open modal 1
            </div>
        </>
        
    )
};

export default LoginForm;