import {IRegisterClass} from '../../interfaces/props';
import formatClass from '../../utils/FormatClass';
import styles from './FormRegisterClass.module.css';
import fetchCreateClass from '../../utils/FetchCreateClass';
import fetchUploadImg from '../../utils/FetchUploadImgClodify';
import fetchGetAllCategoryClass from '../../utils/FetchGetAllCategoryClass';
import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import InputField from '../InputField/InputField';
import TextArea from '../TextArea/TextArea';
import convertBase64 from '../../utils/decodeImageBase64';
import { IAllCategoryClass } from '../../interfaces/props';
import { useModal } from '../../utils/UseModal.ts';
import Modal from '../Modal/Modal.tsx';
import { 
    validateOnlyNumberLetters, 
    validateOnlyLetters, 
    validateOnlyNumbers, 
    validateMaxLengthInput, 
    validateMinLengthInput,
    identifyInputError
    } from '../../utils/InputValidator.tsx';



function FormRegisterClass({ classes }: IRegisterClass) {
    const { formatClasses } = formatClass(styles, classes);
    const [formValues, setFormValues] = useState({
        "name": "",
        "description": "",
        "max_members": "",
        "photo": ""
    });
    const [imgUri64, setImgUri64] = useState<string>('');
    const [isLoadingCategory, setIsLoadingCategory] = useState<boolean>(true);
    const [allCategoryClass, setAllCategoryClass] = useState<IAllCategoryClass[]>([]);
    const [cateogyClassSelected, setCateogyClassSelected] = useState<Array<string>>([]);
    const { showModal, closeModal, isModalOpen } = useModal();
    const [messageResponse, setMessageResponse] = useState<string>();

    const handleInputOnChange = async (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        setFormValues({
            ...formValues,
            [event.target.id]: event.target.value
        });

        if(!(event.target instanceof HTMLInputElement)) return; //This prevent the access to the rest code to htmlTextAreaElements

        if(!event.target.files) return;

        const files = event.target.files; //Controll when they try to upload other thing than an image, and it has to be just one
       
        if(!files) return;

        if(files[0].type.startsWith('image/')){
            const imgBs64 = await convertBase64(files[0]);
            
            if(typeof(imgBs64) !== 'string') return
            
            setImgUri64(imgBs64);
        }

        return;
    }

    const handleInputOnChangeCategory = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        if(checked && value){
            setCateogyClassSelected([
                ...cateogyClassSelected,
                value
            ])
            return
        }

        const arrayClean = cateogyClassSelected.filter((e) => e != value);

        setCateogyClassSelected(arrayClean);
    }

    const handleSubmitRegisterClass = async (event: React.FormEvent<HTMLFormElement>) =>{
        event.preventDefault();
        
        showModal('loadingForm');

        const bodyUploadImg = JSON.stringify({
            "image": imgUri64
        });
         
        const responseUrlImg = await fetchUploadImg(bodyUploadImg);
        
        if(!responseUrlImg) {
            closeModal(); //Closing loadingForm modal
        
            setMessageResponse(responseUrlImg.message);
            showModal('infoResponse');
            return;
        };
        
        const bodyCreateClass = JSON.stringify({
            "name": formValues["name"],
            "description": formValues["description"], 
            "max_members": formValues["max_members"], 
            "photo": 's',
            "categories": cateogyClassSelected
        });
        
        const responseCreateClass = await fetchCreateClass(bodyCreateClass);
        
        closeModal(); //Closing loadingForm modal
        
        setMessageResponse(responseCreateClass.message);
        showModal('infoResponse');

        return;
    }

    useEffect(() => {
        const handlerGetAllCategoryClass = async () => {
            const result = await fetchGetAllCategoryClass();
            setIsLoadingCategory(false);
            setAllCategoryClass(result)
        }
        
        handlerGetAllCategoryClass();
    }, []);

    if(isLoadingCategory) {
        return(
            <>
                CARGANDO CATEGORIAS :UUU
            </>
        )
    }

    return (
        <>
            <Modal 
                id = 'loadingForm'
                type = 'loader'
                title = 'loadingForm'
                isOpen = {isModalOpen('loadingForm')}
                classes = {['modal-infomative-grey']}
                onClose = {closeModal}
            />

            <Modal 
                id = 'infoResponse'
                type = 'informative'
                title = 'Result'
                paragraph = {messageResponse}
                isOpen = {isModalOpen('infoResponse')}
                classes = {['modal-infomative-grey']}
                onClose = {closeModal}
            />

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
                    onChange={handleInputOnChange}
                />

                {
                    allCategoryClass && allCategoryClass.length > 0 ? (
                        allCategoryClass.map((category) => ( //This structure of map dont need a return because this sintaxis implicity say it
                            <div key={category.id_category}>
                                <InputField
                                id = {category.id_category.toString()}
                                label = {category.name}
                                type = {'checkbox'}
                                name = {'photo'}
                                required = {false}
                                value={category.id_category}
                                classes = {['lol']}
                                onChange={handleInputOnChangeCategory}
                                />
                            </div>
                        ))  //Here is the change, this end with a double (), if we use ({}) you have to write the return or this wouldnt work
                    ) : (
                        <p>NO HAY NIUNA WEA ALSKDÑJGSDFGK AAAAAAAAA</p>
                    )
                }
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