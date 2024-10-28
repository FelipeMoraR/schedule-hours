import {IRegisterClass} from '../../interfaces/props';
import formatClass from '../../utils/FormatClass';
import styles from './FormRegisterClass.module.css';
//import fetchCreateClass from '../../utils/FetchCreateClass';
import React, { useState } from 'react';
import Button from '../Button/Button';
import InputField from '../InputField/InputField';
import TextArea from '../TextArea/TextArea';
import convertBase64 from '../../utils/decodeImageBase64';


function FormRegisterClass({ classes }: IRegisterClass) {
    const { formatClasses } = formatClass(styles, classes);
    const [formValues, setFormValues] = useState({
        "name": "",
        "description": "",
        "max_members": "",
        "photo": ""
    });

    
    const handleInputPhotoOnChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        
        const files = event.target.files; //Controll when they try to upload other thing than an image, and it has to be just one
        if(files){
            const imgBs64 = await convertBase64(files[0]);
            console.log('LÑSKDFGKJ => ', imgBs64);
        }
        
        return;
    }

    const handleInputOnChange = (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        console.log(event.target.value);
        setFormValues({
            ...formValues,
            [event.target.id]: event.target.value
        });

        return;
    }

    const handleSubmitRegisterClass = async (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        console.log('ñlsdgñjk => ', formValues);
    }

    return (
        <>
            <form className= {formatClasses} onSubmit={handleSubmitRegisterClass}>
                <InputField
                    id = {'name'}
                    label = {'Nombre Clase'}
                    type = {'text'}
                    name = {'name'}
                    required = {true}
                    value = {formValues.name}
                    classes = {['lol']}
                    onChange={handleInputOnChange}
                />

                <TextArea
                    id = {'description'}
                    label = {'Descripciom'}
                    name = {'description'}
                    placeholder = {'Descripcion'}
                    maxlength = {250} 
                    rows = {5}
                    cols = {20}
                    required = {true}
                    classes = {['lol']}
                    onChange={handleInputOnChange}
                />

                <InputField
                    id = {'max_members'}
                    label = {'Maximo numero de participantes'}
                    type = {'number'}
                    name = {'max_members'}
                    required = {true}
                    value={formValues.max_members}
                    classes = {['lol']}
                    onChange={handleInputOnChange}
                />


                <InputField
                    id = {'photo'}
                    label = {'Foto clase'}
                    type = {'file'}
                    name = {'photo'}
                    required = {true}
                    value={formValues.photo}
                    classes = {['lol']}
                    onChange={handleInputPhotoOnChange}
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

export default FormRegisterClass;