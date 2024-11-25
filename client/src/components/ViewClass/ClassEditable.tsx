import { useState } from "react";
import { IClass } from "../../interfaces/props";
import Button from "../Button/Button";
import InputField from '../InputField/InputField';
import TextArea from '../TextArea/TextArea';
import convertBase64 from "../../utils/decodeImageBase64";
import Select from "../Select/Select";
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
import { useNavigate } from 'react-router-dom';
import validateSesion from '../../utils/SesionValidator.ts';
import fetchUpdateClass from "../../utils/FetchUpdateClass.ts";
import fetchUploadImg from "../../utils/FetchUploadImgClodify.ts";
import { IBodyCreateClass } from "../../interfaces/props"; 

const ClassEditable = ({ id_class, class_name, description, max_number_member, photo, status_name, categories, allCategories, allStatus, deleteClass, members, date_class, time_class } : IClass) => {

    const id_status_filtered = allStatus?.filter(status => status.name === status_name ).map(status => status.id_status)[0]; //Remember, if you just use one '=' this repleace all name of the obj.

    const id_category_filtered = categories?.map(cat => cat.id_category.toString());
    
    const [formValues, setFormValues] = useState({
        "name": class_name,
        "description": description,
        "max_members": max_number_member,
        "photo": "", //This take the name of the file, not the img.
        "id_status": id_status_filtered,
        "date": date_class,
        "time": time_class
    });
    const [categorySelected, setCategoryClassSelected] = useState<Array<string>>(id_category_filtered);
    const [preViewImg, setPreViewImg] = useState<string | null | ArrayBuffer>(photo); //What is an ArrayBuffer?
    const [imgUri64, setImgUri64] = useState<string>('');
    const navigate = useNavigate();
    const { closeModal, isModalOpen, showModal } = useModal();
    const [messageResponse, setMessageResponse] = useState<string>();
    const { addIdError, removeIdError, emptyIdError, hasError } = identifyInputError();
    const [errorFormatImg, setErrorFormatImg] = useState('');
    const [errorForm, setErrorForm] = useState<Array<string>>([]);

    //We have to add error controll
    const handlePreViewImg = (files: Blob) => {
        const reader = new FileReader(); //What is this?

            reader.onload = () => { //Why i have to use this??
                setPreViewImg(reader.result);
            }

            reader.onerror = () => {
                setPreViewImg(photo);
            }

            reader.readAsDataURL(files);
    }

    const restoreOldPhoto = () => {
        setPreViewImg(photo);
        setFormValues({
            ...formValues,
            ['photo']: ''
        })
    }

    //Here we configurate the base of the body, but still left the img, img will be retrieve with an endpoint so in this function we dont added it.
    const bodyCreation = () => {
        const bodyCreateClass: IBodyCreateClass = {
            "id_class": id_class,
        }
        
        const categorySelectedSorted = categorySelected.sort();
        const idCategoryFilteredSorted = id_category_filtered.sort();

        if(formValues.name !== class_name) {
            bodyCreateClass["new_name"] = formValues.name;
        }

        if(formValues.description !== description) {
            bodyCreateClass["new_description"] = formValues.description;
        }
        
        if(formValues.max_members !== max_number_member) {
            bodyCreateClass["new_max_number_member"] = formValues.max_members.toString();
        }

        if(formValues.id_status?.toString() !== id_status_filtered?.toString()) {
            bodyCreateClass["new_id_status"] = formValues?.id_status?.toString();
        }

        if(categorySelectedSorted.length === idCategoryFilteredSorted.length) {
            const isSame = categorySelectedSorted.every((value, index) => value === idCategoryFilteredSorted[index]);
            
            if (!isSame) bodyCreateClass["new_categories"] = categorySelected;
        } else {
            bodyCreateClass["new_categories"] = categorySelected;
        }

        if(formValues.date !== date_class || formValues.time !== time_class){
            bodyCreateClass["new_date"] = formValues.date;
            bodyCreateClass["new_time"] = formValues.time;
        }


        return bodyCreateClass
    }

    const handleInputOnChange = async (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLTextAreaElement> | React.ChangeEvent<HTMLSelectElement>) => {
        setFormValues({
            ...formValues,
            [event.target.id]: event.target.value
        });

        removeIdError(event.target.id); //Implement this on the other form (RegisterForm)

        if(!(event.target instanceof HTMLInputElement)) return; //This prevent the access of htmlTextAreaElements elements to the rest of code.

        if(!event.target.files) return;

        const files = event.target.files; //Controll when they try to upload other thing than an image, and it has to be just one
       
        
        if(!files || files.length === 0) return;

        const fileSizeMb = files[0].size / (1024 * 1024);

        if(fileSizeMb > 9.5){
            setErrorFormatImg('Mi loco la imagen pesa mucho, debe ser inferior a 9.5mb');
            addIdError('photo');
            setFormValues({
                ...formValues,
                ['photo']: ''
            });
            return
        }

        if(files[0].type.startsWith('image/')){
            const imgBs64 = await convertBase64(files[0]);
            
            if(typeof(imgBs64) !== 'string') return
            
            
            handlePreViewImg(files[0]);
            
            setImgUri64(imgBs64);
            removeIdError('photo');
            setErrorFormatImg('');
            return
        }

        
        
        setErrorFormatImg('Formato no aceptado, debe ser una imagen');
        
        
        addIdError('photo');
        setFormValues({
            ...formValues,
            ['photo']: ''
        });
        
        return;
    }

    const handleInputOnChangeCategory = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value, checked } = event.target;

        //removeIdError('categories');

        if(checked && value){
            setCategoryClassSelected([
                ...categorySelected,
                value
            ]);
            return
        }

        const arrayClean = categorySelected.filter((e) => e != value);

        setCategoryClassSelected(arrayClean);
    }

    const handleSubmitEditClass = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        showModal('loadingForm');

        const errors: string[] = [];
        const addError = (error: string) => errors.push(error);
        const { name, description, max_members, date, time } = formValues;


        if(!date || !time) {
            addError('Debes ingresar una fecha y su hora');
            addIdError('date');
        }

        const dateTimeString = `${date}T${time}`;
        const dateClass = new Date(dateTimeString);
        const now = new Date();

        if(dateClass < now) {
            addError('La fecha debe ser mayor o igual a la actual');
            addIdError('date');
        } 

        if(dateClass > now) removeIdError('date');

        if(!validateOnlyLetters(name)) {
            addError('Solo se admiten letras en el nombre de la clase');
            addIdError('name'); 
        }

        if(!validateMaxLengthInput(name, 45) || !validateMinLengthInput(name, 1)){
            addError('Largo del texto debe estar entre 1 a 45 caracteres');
            addIdError('name');
        }

        if(validateOnlyLetters(name) && validateMaxLengthInput(name, 45) && validateMinLengthInput(name, 1)) removeIdError('name');

        if(!validateOnlyNumberLetters(description)) {
            addError('Solo se admiten letras y números en la descripción de la clase');
            addIdError('description'); 
        }

        if(!validateMaxLengthInput(description, 255) || !validateMinLengthInput(description, 1)){
            addError('Largo del texto debe estar entre 1 a 255 caracteres');
            addIdError('description');
        }

        if(validateOnlyNumberLetters(description) && validateMaxLengthInput(description, 255) && validateMinLengthInput(description, 1)) removeIdError('description');
        
        if(!validateOnlyNumbers(max_members.toString())){
            addError('Solo se admiten número en el maximo número de participantes');
            addIdError('max_members');
        }

        if(!validateMaxLengthInput(max_members.toString(), 2) || !validateMinLengthInput(max_members.toString(), 1)){
            addError('Largo maximo del número son 2 digitos');
            addIdError('max_members');
        }

        if(validateOnlyNumbers(max_members.toString()) && validateMaxLengthInput(max_members.toString(), 2) && validateMinLengthInput(max_members.toString(), 1)) removeIdError('max_members');

        if(categorySelected.length === 0) {
            addError('Debes seleccionar al menos una categoria');
            addIdError('categories');
        } 

        if(categorySelected.length > 0) removeIdError('categories');

        if(errors.length > 0){
            setErrorForm(errors);
            closeModal();
            return
        }

        emptyIdError();
        setErrorForm([]);

        const statusSesion = await validateSesion();

        if(!statusSesion){
            closeModal(); //Closing loadingForm modal

            setMessageResponse('Sesion caducada');
            showModal('infoResponse');

            await new Promise(resolve => setTimeout(resolve, 1000));

            navigate('/login-user');
            return
        }

        //First parts of the uploadClass body
        const body = bodyCreation();

        
        if (formValues.photo != ""){
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

            body["new_photo"] = responseUrlImg.message;
        }


        if(Object.keys(body).length === 1) {
            console.log('No changes');
            closeModal(); //Closing loadingForm modal
            
            setMessageResponse('No changes');
            showModal('infoResponse');
            return
        }

        
        const formatBody = JSON.stringify(body);
        console.log(formatBody); 

        
        const response = await fetchUpdateClass(formatBody);

        if(response.status !== 200){
            console.log('Error updateClass');
            return
        }

        console.log('Upload completed!');
        navigate('/your-classes');

        return
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

            <form onSubmit={handleSubmitEditClass}>


                {
                    errorForm.length !== 0 ? (
                        <div className='error'>
                            {errorForm.map((error, index) => (
                                <p key={index}>{error}</p>
                            ))}
                        </div>
                    ) : null
                }

                {
                    errorFormatImg !== '' ? (
                        <div className='error'>
                            <p>{errorFormatImg}</p>
                        </div>
                    ) : null
                }

                <InputField
                    id = {'name'}
                    label = {'Nombre Clase'}
                    type = {'text'}
                    name = {'name'}
                    required = {true}
                    maxLength={45}
                    value = {formValues.name}
                    classes = {hasError('name') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />
                    date_class


                <InputField
                    id = {'date'}
                    label = {'Fecha clase'}
                    type = {'date'}
                    name = {'date'}
                    required = {true}
                    value = {formValues.date}
                    classes = {hasError('date') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />

                <InputField
                    id = {'time'}
                    label = {'Hora clase'}
                    type = {'time'}
                    name = {'time'}
                    required = {true}
                    value = {formValues.time}
                    classes = {hasError('date') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />

                <TextArea
                    id = {'description'}
                    label = {'Descripcion'}
                    name = {'description'}
                    placeholder = {'Descripcion'}
                    maxlength = {250} 
                    rows = {5}
                    cols = {20}
                    value = {formValues.description}
                    required = {true}
                    classes = {hasError('description') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />

                <InputField
                    id = {'max_members'}
                    label = {'Numero maximo miembros'}
                    type = {'text'}
                    name = {'max_members'}
                    required = {true}
                    maxLength={45}
                    value = {formValues.max_members}
                    classes = {hasError('max_members') ? ['error-class'] : ['normal-class']} 
                    onChange={handleInputOnChange}
                />


                <InputField
                    id = {'photo'}
                    label = {'Foto clase'}
                    type = {'file'}
                    name = {'photo'}
                    required = {false}
                    value={formValues.photo}
                    classes = {hasError('photo') ? ['error-class'] : ['normal-class']}
                    onChange={handleInputOnChange}
                />
                
                

                {
                    preViewImg  && !(preViewImg instanceof ArrayBuffer) ? (
                        <>
                        {
                            preViewImg !== photo ? (
                            <Button
                                id = "restorePhoto"
                                text = "Restaurar foto incial"
                                classes = {['a']}
                                onClick = {restoreOldPhoto}
                                type = "button"
                            />
                            ) : null
                        }

                            <img src={preViewImg} alt="jeje" />
                        </>
                    ) : null
                }
                

                <Select
                    id = 'id_status'
                    name = 'id_status'
                    values = {allStatus ? (allStatus): ([])}
                    keyValue = "id_status"
                    keyName = "name"
                    onChange = {handleInputOnChange}
                    selectedValue = {formValues.id_status}
                />


                {
                    allCategories && allCategories.length > 0 ? (
                        allCategories.map((cat) => ( //This structure of map dont need a return because this sintaxis implicity say it
                            <div key={cat.id_category}>
                                <InputField
                                id = {cat.id_category.toString()}
                                label = {cat.category_name}
                                type = {'checkbox'}
                                name = {'categories'}
                                required = {false}
                                value={cat.id_category}
                                classes = {hasError('categories') ? ['error-class'] : ['normal-class']}
                                onChange={handleInputOnChangeCategory}
                                checked = {categorySelected.includes(cat.id_category.toString())}
                                />
                            </div>
                        ))  //Here is the change, this end with a double (), if we use ({}) you have to write the return or this wouldnt work
                    ) : (
                        <p>No hay ninguna categoria</p>
                    )
                }

                <Button
                    id = "modifyClass"
                    text = "Modificar Clase"
                    classes = {['a']}
                    type = "submit"
                />


                {
                    deleteClass ? (
                        <div>
                            <Button
                                id = 'deleteClass'
                                text = 'Eliminar clase'
                                type = 'buttom'
                                classes = {['btn-delete']}
                                onClick = {() => {
                                    deleteClass(id_class);
                                }}
                            />

                        </div>
                    ) : null
                }
            </form>
                
            <h1>Miembros</h1>
                {
                    members && members.length > 0 ? (
                        members.map((member, index) => (
                            <div key={member.id_type_class_user}>
                                {index + 1} - {member.username}
                                {   
                                    member.id_type_class_user !== 1 ? (
                                        <button>Eliminar</button>
                                    ) : null
                                }
                            </div>
                        ))
                    ) : (
                        <h2>No hay miembros</h2>
                    )
                }
            
        </>
    )
}   

export default ClassEditable;