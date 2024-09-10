import React, { ChangeEvent, useState } from 'react';
import styles from './RegisterForm.module.css';
import formatClass from '../../utils/formatClass';
import { IRegisterForm } from '../../interfaces/props';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import { rutStructure } from '../../utils/RegisterFormInputControll';

function RegisterForm({ classes }: IRegisterForm) {
    const [fName, setFname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [rut, setRut] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [passwrod, setPassword] = useState<string>('');
    const [errorForm, setErrorForm] = useState<Array<string>>([]);
    const { formatClasses } = formatClass(styles, classes);
    
    

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => { //We have to thing in a better way to do this.
        const { name, value } = event.target;
        switch (name){
            case 'fName':
                setFname(value);
                return
            case 'lastname':
                setLastname(value);
                return
            case 'age':
                setAge(value);
                return
            case 'rut':
                value.replace(/[^0-9kK]/g, '');
                setRut(value);
                return
            case 'username':
                setUsername(value);
                return
            case 'password':
                setPassword(value);
                return
        }
    }

    const handleSubmitRegister = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { fName, lastname, age, rut, username, password } = event.target as HTMLFormElement;
        const { errorRut }  = rutStructure(rut.value);
        
        if(errorRut !== ''){
            setErrorForm([errorRut]);
            return;
        }
        

        const objBodyRegister = {
            "username": username.value,
            "password": password.value,
            "first_name": fName.value,
            "last_name": lastname.value,
            "run": 123, 
            "run_dv": "k",
            "age": age.value,
            "id_type_user": 2
        }
        console.log(objBodyRegister);
    }

    
    return (
        <form className = {formatClasses} onSubmit={handleSubmitRegister}>
            <div className = "error">
                {errorForm.length > 0 && errorForm.map((error, index) => (
                    <p key={index}>{error}</p> 
                ))}
            </div>
            <InputField
                label = 'Inserte primer nombre'
                type = 'text'
                name = 'fName'
                required = {true}
                value={fName}
                maxLength={20}
                classes = {['']}
                onChange={handleOnChange}
            />

            <InputField
                label = 'Inserte apellido paterno'
                type = 'text'
                name = 'lastname'
                required = {true}
                maxLength={20}
                value={lastname}
                classes = {['']}
                onChange={handleOnChange}
            />

            <InputField
                label = 'Inserte su edad'
                type = 'text'
                name = 'age'
                required = {true}
                value={age}
                maxLength={2}
                classes = {['']}
                onChange={handleOnChange}
            />

            <InputField
                label = 'Inserte su rut'
                type = 'text'
                placeholder='12345678-9'
                name = 'rut'
                required = {true}
                maxLength={10}
                value={rut}
                classes = {['']}
                onChange={handleOnChange}
            />

            <InputField
                label = 'Inserte su nombre de usuario'
                type = 'text'
                name = 'username'
                required = {true}
                value={username}
                maxLength={10}
                classes = {['']}
                onChange={handleOnChange}
            />

            <InputField
                label = 'Inserte su contraseña'
                type = 'password'
                name = 'password'
                required = {true}
                value={passwrod}
                maxLength={9}
                classes = {['']}
                onChange={handleOnChange}
            />

            <Button
                    id = 'btnRegister'
                    text = 'Registrarse'
                    type = 'submit'
                    classes = {['backgorund-color-blue-violet', 'color-white']}
                />
        </form>
    )
}

export default RegisterForm;