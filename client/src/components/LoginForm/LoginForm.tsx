import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import Modal from '../../components/Modal/Modal';
import React, { ChangeEvent, useState } from 'react';
import { useModal } from '../../utils/UseModal';
import { useAuthContext } from '../../hooks/authContext';


function LoginForm ()  {
    const { closeModal } = useModal();
    const { login, errorLoged, isLoadingLogin } = useAuthContext();
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target;
        if(name === 'username'){
            setUsername(value);
        }
        else {
            setPassword(value);
        }
    }

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { username, password } = event.target as HTMLFormElement; //This allow access to the form features

        try{
            await login(username.value, password.value);
        } 
        catch(err){
            console.error('There is an error: ' + err);
        }
    }

    return(
        <>              
            <Modal
                id = 'loaderLogin'
                type = 'loader'
                title = 'LOADING LOGIN...'
                isOpen = {isLoadingLogin}
                classes = {['modal-infomative-grey']}
                onClose={closeModal}
            />
            
            {
                errorLoged !== '' ? (
                    <div>
                        {errorLoged}
                    </div>
                ) : null
            }
            
            <form onSubmit={handleSubmit}>
                <InputField
                    id = 'username'
                    label = 'Nombre Usuario'
                    name = 'username'
                    type = 'text'
                    required = {true}
                    value = {username}
                    maxLength={10}
                    placeholder = 'Ingrese nombre'
                    classes = {['clase1', 'clase2']}
                    onChange = {handleOnChange}
                />

                <InputField
                    id = 'password'
                    label = 'Contraseña'
                    name = 'password'
                    type = 'password'
                    required = {true}
                    value = {password}
                    maxLength={9}
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
        </>
    )
};

export default LoginForm;