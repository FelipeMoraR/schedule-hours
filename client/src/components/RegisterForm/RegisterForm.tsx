import React, { ChangeEvent, useState } from 'react';
import styles from './RegisterForm.module.css';
import formatClass from '../../utils/FormatClass';
import { IRegisterForm } from '../../interfaces/props';
import InputField from '../InputField/InputField';
import Button from '../Button/Button';
import { validateOnlyNumberLetters, 
    validateOnlyLetters, 
    validateOnlyNumbers, 
    validateMaxLengthInput, 
    validateMinLengthInput, 
    validatePassword, 
    validateRut,
    identifyInputError,
    extractComponentRut } from '../../utils/InputValidator.tsx';


function RegisterForm({ classes }: IRegisterForm) {
    const [fName, setFname] = useState<string>('');
    const [lastname, setLastname] = useState<string>('');
    const [age, setAge] = useState<string>('');
    const [rut, setRut] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [passwrod, setPassword] = useState<string>('');
    const [errorForm, setErrorForm] = useState<Array<string>>([]);
    const { formatClasses } = formatClass(styles, classes);
    const { addIdError, removeIdError, emptyIdError, hasError } = identifyInputError();
    

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

        const errors: string[] = [];
        const addError = (error: string) => errors.push(error);

        if(!validateOnlyLetters(fName.value)){
            addError('Solo se admiten letras en el primer nombre');
            addIdError('fName'); 
        }

        if(!validateMaxLengthInput(fName.value, 20)){
            addError('Largo maximo para el primer nombre son 20 caracteres');
            addIdError('fName');
        }

        if(!validateMinLengthInput(fName.value, 4)){
            addError('Largo minimo para el primer nombre son 4 caracteres');
            addIdError('fName');
        }

        if(validateOnlyLetters(fName.value) && validateMaxLengthInput(fName.value, 20) && validateMinLengthInput(fName.value, 4)) removeIdError('fName');
        

        if(!validateOnlyLetters(lastname.value)){
            addError('Solo se admiten letras en el apellido paterno');
            addIdError('lastname');
        }
        
        if(!validateMaxLengthInput(lastname.value, 20)){
            addError('Largo maximo para el apellido son 20 caracteres');
            addIdError('lastname');
        }
        
        if(!validateMinLengthInput(lastname.value, 4)){
            addError('Largo minimo para el apellido paterno son 4 caracteres');
            addIdError('lastname');
        }

        if(validateOnlyLetters(lastname.value) && validateMaxLengthInput(lastname.value, 20) && validateMinLengthInput(lastname.value, 4)) removeIdError('lastname');

        if(!validateOnlyNumbers(age.value)){
            addError('La edad solo deben ser números');
            addIdError('age');
        }

        if(!validateMaxLengthInput(age.value, 3)){
            addError('Largo maximo para la edad son 3 números');
            addIdError('age');
        }

        if(!validateMinLengthInput(age.value, 1)){
            addError('Largo minimo para la edad es 1 número');
            addIdError('age');
        }
        
        if(validateOnlyNumbers(age.value) && validateMaxLengthInput(age.value, 3) && validateMinLengthInput(age.value, 1)) removeIdError('age');

        if(!validateMaxLengthInput(rut.value, 9) || !validateMinLengthInput(rut.value, 9)){
            addError('Largo del Rut no valido, debe tener un largo de 9 caracteres');
            addIdError('rut');
        }

        if(!validateRut(rut.value)){
            addError('Rut no valido, formato valido 123456789 sin puntos ni guion');
            addIdError('rut');
        }

        if(validateRut(rut.value) && validateMaxLengthInput(rut.value, 9) && validateMinLengthInput(rut.value, 9)) removeIdError('rut');

        if(!validateOnlyNumberLetters(username.value)){
            addError('Nombre de usuario no valido, solo se admiten número y letras');
            addIdError('username');
        }

        if(!validateMaxLengthInput(username.value, 10)){
            addError('Largo maximo para el nombre de usuario son de 10 caracteres');
            addIdError('username');
        }

        if(!validateMinLengthInput(username.value, 4)){
            addError('Largo minimo para el nombre de usuario son de 4 caracteres');
            addIdError('username');
        }

        if(validateOnlyNumberLetters(username.value) && validateMaxLengthInput(username.value, 10) && validateMinLengthInput(username.value, 4)) removeIdError('username');

        if(!validatePassword(password.value)){
            addError('Contraseña no valida, debe contener al menos un número, un caracter especial del siguiente listado @ ! # $ % &');
            addIdError('password');
        }

        if(!validateMaxLengthInput(password.value, 9) ||  !validateMinLengthInput(password.value, 9)){
            addError('La contraseña debe tener un largo de 9 caracteres');
            addIdError('password');
        }

        if(validatePassword(password.value) && validateMaxLengthInput(password.value, 9) && validateMinLengthInput(password.value, 9)) removeIdError('password');
        
        
        if(errors.length > 0) {
            setErrorForm(errors);
            return
        }

        emptyIdError();

        const { run, dv } = extractComponentRut(rut.value);

        const objBodyRegister = {
            "username": username.value,
            "password": password.value,
            "first_name": fName.value,
            "last_name": lastname.value,
            "run": run, 
            "run_dv": dv,
            "age": age.value,
            "id_type_user": 2
        }
        console.log(objBodyRegister);
    }

    return (
        <form className = {formatClasses} onSubmit={handleSubmitRegister}>
            {
                errorForm.length !== 0 ? (
                    <div className='error'>
                        {errorForm.map((error, index) => (
                            <p key={index}>{error}</p>
                        ))}
                    </div>
                ) : null
            }

            <InputField
                id = 'fName'
                label = 'Inserte primer nombre'
                type = 'text'
                name = 'fName'
                required = {true}
                value={fName}
                maxLength={20}
                classes={hasError('fName') ? ['error-class'] : ['normal-class']} 
                onChange={handleOnChange}
            />
            

            <InputField
                id = 'lastname'
                label = 'Inserte apellido paterno'
                type = 'text'
                name = 'lastname'
                required = {true}
                maxLength={20}
                value={lastname}
                classes={hasError('lastname') ? ['error-class'] : ['normal-class']} 
                onChange={handleOnChange}
            />

            <InputField
                id = 'age'
                label = 'Inserte su edad'
                type = 'text'
                name = 'age'
                required = {true}
                value={age}
                maxLength={3}
                classes={hasError('age') ? ['error-class'] : ['normal-class']} 
                onChange={handleOnChange}
            />

            <InputField
                id = 'rut'
                label = 'Inserte su rut'
                type = 'text'
                placeholder='123456789'
                name = 'rut'
                required = {true}
                maxLength={9}
                value={rut}
                classes={hasError('rut') ? ['error-class'] : ['normal-class']} 
                onChange={handleOnChange}
            />

            <InputField
                id='username'
                label = 'Inserte su nombre de usuario'
                type = 'text'
                name = 'username'
                required = {true}
                value={username}
                maxLength={10}
                classes={hasError('username') ? ['error-class'] : ['normal-class']} 
                onChange={handleOnChange}
            />

            <InputField
                id='password'
                label = 'Inserte su contraseña'
                type = 'password'
                name = 'password'
                required = {true}
                value={passwrod}
                maxLength={9}
                classes={hasError('password') ? ['error-class'] : ['normal-class']} 
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