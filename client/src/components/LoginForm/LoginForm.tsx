import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import Modal from '../../components/Modal/Modal';
import React, { ChangeEvent, useState } from 'react';
import { useModal } from '../../utils/UseModal';
import { useAuthContext } from '../../hooks/authContext';

function LoginForm ()  {
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const { showModal, closeModal, isModalOpen } = useModal();
    const { login } = useAuthContext();

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
        showModal('loaderLogin');
        event.preventDefault();
        const { username, password } = event.target as HTMLFormElement; //This allow access to the form features

        try{
            login(username.value, password.value);
        } 
        catch(err){
            console.error('There is an error: ' + err);
        }

        closeModal();
    }

    return(
        <>
            <Modal
                id = 'loaderLogin'
                type = 'loader'
                title = 'Titulo loader'
                isOpen = {isModalOpen('loaderLogin')}
                classes = {['modal-loader-grey']}
                onClose={closeModal}
            />
    
            <form onSubmit={handleSubmit}>
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
        </>
    )
};

export default LoginForm;