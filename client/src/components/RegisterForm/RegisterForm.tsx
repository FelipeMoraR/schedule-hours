import React, { ChangeEvent, useEffect, useState } from 'react';
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
import { useModal } from '../../utils/UseModal.ts';
import Modal from '../Modal/Modal.tsx';
import { IErrorResponse } from '../../interfaces/props';
import { useNavigate } from 'react-router-dom';


const fetchRegisterUser = async (bodyReq: string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const urlRegisterUser = apiUrl + '/auth/api/register-user';
    
    try{
        const response = await fetch(urlRegisterUser, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: bodyReq
        })

        const data = await response.json();

        
        return data
    } 
    catch(err){
        console.error('Something went wrong: ', err);
        return {status: 500, message: 'internal server error'}
    }
    
}

function RegisterForm({ classes }: IRegisterForm) {
    const [errorForm, setErrorForm] = useState<Array<string>>([]);
    const { formatClasses } = formatClass(styles, classes);
    const { addIdError, removeIdError, emptyIdError, hasError } = identifyInputError();
    const {showModal, closeModal, isModalOpen} = useModal();
    const [errorResponse, setErrorResponse ] = useState<IErrorResponse>({
        status: 0,
        message: ''
    });

    const [formValues, setFormValues] = useState({
        "fName" : "",
        "lastname" : "",
        "age" : "",
        "rut" : "",
        "username" : "",
        "password" : ""
    })

    const navigate = useNavigate();

    const handleOnChange = (event: ChangeEvent<HTMLInputElement>) => { //We have to think in a better way to do this. //** NEW IDEA, EXTRACT VALUES FROM EVENT FORM
        setFormValues({
            ...formValues,
            [event.target.id]: event.target.value
        });
        return;
    }

    const handleSubmitRegister = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const { fName, lastname, age, rut, username, password } = formValues;

        const errors: string[] = [];
        const addError = (error: string) => errors.push(error);

        showModal('loadingRegister');

        if(!validateOnlyLetters(fName)){
            addError('Solo se admiten letras en el primer nombre');
            addIdError('fName'); 
        }

        if(!validateMaxLengthInput(fName, 20)){
            addError('Largo maximo para el primer nombre son 20 caracteres');
            addIdError('fName');
        }

        if(!validateMinLengthInput(fName, 4)){
            addError('Largo minimo para el primer nombre son 4 caracteres');
            addIdError('fName');
        }

        if(validateOnlyLetters(fName) && validateMaxLengthInput(fName, 20) && validateMinLengthInput(fName, 4)) removeIdError('fName');
        

        if(!validateOnlyLetters(lastname)){
            addError('Solo se admiten letras en el apellido paterno');
            addIdError('lastname');
        }
        
        if(!validateMaxLengthInput(lastname, 20)){
            addError('Largo maximo para el apellido son 20 caracteres');
            addIdError('lastname');
        }
        
        if(!validateMinLengthInput(lastname, 4)){
            addError('Largo minimo para el apellido paterno son 4 caracteres');
            addIdError('lastname');
        }

        if(validateOnlyLetters(lastname) && validateMaxLengthInput(lastname, 20) && validateMinLengthInput(lastname, 4)) removeIdError('lastname');

        if(!validateOnlyNumbers(age)){
            addError('La edad solo deben ser números');
            addIdError('age');
        }

        if(!validateMaxLengthInput(age, 3)){
            addError('Largo maximo para la edad son 3 números');
            addIdError('age');
        }

        if(!validateMinLengthInput(age, 1)){
            addError('Largo minimo para la edad es 1 número');
            addIdError('age');
        }
        
        if(validateOnlyNumbers(age) && validateMaxLengthInput(age, 3) && validateMinLengthInput(age, 1)) removeIdError('age');

        if(!validateMaxLengthInput(rut, 9) || !validateMinLengthInput(rut, 9)){
            addError('Largo del Rut no valido, debe tener un largo de 9 caracteres');
            addIdError('rut');
        }

        if(!validateRut(rut)){
            addError('Rut no valido, formato valido 123456789 sin puntos ni guion');
            addIdError('rut');
        }

        if(validateRut(rut) && validateMaxLengthInput(rut, 9) && validateMinLengthInput(rut, 9)) removeIdError('rut');

        if(!validateOnlyNumberLetters(username)){
            addError('Nombre de usuario no valido, solo se admiten número y letras');
            addIdError('username');
        }

        if(!validateMaxLengthInput(username, 10)){
            addError('Largo maximo para el nombre de usuario son de 10 caracteres');
            addIdError('username');
        }

        if(!validateMinLengthInput(username, 4)){
            addError('Largo minimo para el nombre de usuario son de 4 caracteres');
            addIdError('username');
        }

        if(validateOnlyNumberLetters(username) && validateMaxLengthInput(username, 10) && validateMinLengthInput(username, 4)) removeIdError('username');

        if(!validatePassword(password)){
            addError('Contraseña no valida, debe contener al menos un número, un caracter especial del siguiente listado @ ! # $ % &');
            addIdError('password');
        }

        if(!validateMaxLengthInput(password, 9) ||  !validateMinLengthInput(password, 9)){
            addError('La contraseña debe tener un largo de 9 caracteres');
            addIdError('password');
        }

        if(validatePassword(password) && validateMaxLengthInput(password, 9) && validateMinLengthInput(password, 9)) removeIdError('password');
        
        
        if(errors.length > 0) {
            setErrorForm(errors);
            closeModal();
            return
        }

        emptyIdError();
        setErrorForm([]);

        const { run, dv } = extractComponentRut(rut);

        const objBodyRegister = JSON.stringify({
            "username": username,
            "password": password,
            "first_name": fName,
            "last_name": lastname,
            "run": run, 
            "run_dv": dv,
            "age": age,
            "id_type_user": 2
        })

        const responseRegister = await fetchRegisterUser(objBodyRegister);

        closeModal(); //Closing the loading modal;

        setErrorResponse({
            status: responseRegister.status,
            message: responseRegister.message
        });

        showModal('responseRegisterModal');
    }

    useEffect(() => {
        const checkStatusResponse = async () => {
            await new Promise(resolve => setTimeout(resolve, 2000));

            if(errorResponse.status === 201){
                navigate('/login-user');
            }
        }

        checkStatusResponse();
    }, [errorResponse])

    return (
        <>
            <Modal
                id = 'loadingRegister'
                type = 'loader'
                title = 'Loading...'
                isOpen = {isModalOpen('loadingRegister')}
                classes = {['modal-infomative-grey']}
                onClose = {closeModal}
            />

            <Modal
                id = 'responseRegisterModal'
                type = 'informative'
                title = {errorResponse.status !== 201 ? 'Error al crear el usuario' : 'Usuario creado correctamente'}
                paragraph= {errorResponse.status !== 201 ? errorResponse.message : errorResponse.message + 'Redirecting...'}
                isOpen = {isModalOpen('responseRegisterModal')}
                classes = {['modal-infomative-grey']}
                onClose = {closeModal}
            />

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
                    value={formValues.fName}
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
                    value={formValues.lastname}
                    classes={hasError('lastname') ? ['error-class'] : ['normal-class']} 
                    onChange={handleOnChange}
                />

                <InputField
                    id = 'age'
                    label = 'Inserte su edad'
                    type = 'text'
                    name = 'age'
                    required = {true}
                    value={formValues.age}
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
                    value={formValues.rut}
                    classes={hasError('rut') ? ['error-class'] : ['normal-class']} 
                    onChange={handleOnChange}
                />

                <InputField
                    id='username'
                    label = 'Inserte su nombre de usuario'
                    type = 'text'
                    name = 'username'
                    required = {true}
                    value={formValues.username}
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
                    value={formValues.password}
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
        </>
    )
    
}

export default RegisterForm;