import { useLocation, useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import InputField from '../../components/InputField/InputField';
import React, { ChangeEvent, useState } from 'react';

function LoginForm ()  {
    const location = useLocation();
    const navigate = useNavigate();
    const from = location.state?.from?.pathname || '/';
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

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        
        const { username, password } = event.target as HTMLFormElement; //What is this???????? investigate.
        console.log(username.value, password);
        navigate(from, {replace: true});
        
    }

    return(
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
                text = 'boton1'
                type= 'submit'
                classes = {['backgorund-color-blue-violet', 'color-white']}
            />
        </form>
    )
};

export default LoginForm;