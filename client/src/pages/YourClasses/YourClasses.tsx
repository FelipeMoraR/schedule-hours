import { useEffect, useState } from "react";
import fetchGetAllClasses from "../../utils/FetchGetAllClasses";
import { IAllClasses, IClass } from "../../interfaces/props";
import ViewAllClasses from "../../components/AllClassesView/AllClassesView";
import fetchGetCountClasses from "../../utils/FetchGetCountClasses";
import { useAuthContext } from "../../hooks/authContext";
import fetchDeleteClass from '../../utils/FetchDeleteClass';
import Modal from "../../components/Modal/Modal";
import { useModal } from "../../utils/UseModal";
import validateSesion from "../../utils/SesionValidator";
import { useNavigate } from "react-router-dom";
import ViewClass from "../../components/ViewClass/ViewClass";
import fetchGetAllCategoryClass from "../../utils/FetchGetAllCategoryClass";
import fetchGetAllStatusClasses from "../../utils/FetchGetAllStatusClasses";

const YourClasses = () => {
    const [isLoadingGetClasses, setIsLoadingGetClasses] = useState<boolean>(true);
    const [isLoadingGetAllCategories, setIsLoadingGetAllCategories] = useState<boolean>(true);
    const [isLoadingGetAllStatus, setIsLoadingGetAllStatus] = useState<boolean>(true);
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [allClasses, setAllClasses] = useState<IAllClasses[]>([]);
    const [classData, setClassData] = useState<IClass>();
    const [allCategories, setAllCategoryClass] = useState([]);
    const [allStatus, setAllStatus] = useState([]);
    const [typeView, setTypeView] = useState('viewAll');
    const {userData} = useAuthContext();
    const {closeModal, isModalOpen, showModal} = useModal();
    const navigate = useNavigate();
    
    
    const handleViewDetailClass = async (id_class: any) => {
        const statusSesion = await validateSesion();
        
        if(!statusSesion) {
            showModal('errorSesion');

            await new Promise(resolve => setTimeout(resolve, 1000));

            navigate('/login-user');
            return
        }

        const [dataClass] = allClasses.filter((cls) => cls.id_class === id_class);

        if(!dataClass) {
            console.error('Class does not exist');
            return;
        }

        const objClassData = {
            ...dataClass,
            type_user: userData.id_type_user
        }

        setClassData(objClassData);
        setTypeView('viewDetail');
    }

    const handleViewReturnAllClasses = () => {
        setTypeView('viewAll');
    }

    const handleDeleteClass = async  (id_class: number) => {
        showModal('loadingDeleteClass');
        const idClass = id_class.toString();
        
        const statusResponse = await fetchDeleteClass(idClass);

        if(!statusResponse){
            console.error('Error trying to remove the class');
            closeModal();
            return 
        }

        await handlerFetchGetClasses();
        closeModal();
        
        return
    }  


    const handlerFetchGetClasses = async () => {
        const getClasses = await fetchGetAllClasses(String(page), '3', userData.id_user);
        
        setAllClasses(getClasses.data);
        
    };

    const handlerFetchCountClasses = async () => {
        const countClasses = await fetchGetCountClasses(userData.id_user);
        
        if(!countClasses) return;

        if(countClasses.status !== 200) return;

        const limitPerPage = 3;
        const residue = countClasses.totalItems % limitPerPage;
        const totalPages = countClasses.totalItems / limitPerPage;
        
        if (residue > 0) {
            setMaxPage(Math.floor(totalPages) + 1)
            return
        } 

        setMaxPage(Math.floor(totalPages));

        return
        
    };


    const nextPage = () => {
        setAllClasses([]); //With this we controll the flow of classes data, whit out it we pass to the next page with the old information.
        setPage((prev) => prev + 1)
    };
    const prevPage = () => {
        setAllClasses([]); //Beside this mantain the page when we re-render some components.
        setPage((prev) => Math.max(prev - 1, 1))
    }; // Math.max(prev - 1, 1) enshure prev never will be less than 0

    useEffect(() => {
        const handlerFunctionFetchs = async () => {
            setIsLoadingGetClasses(true);
            await handlerFetchGetClasses();
            await handlerFetchCountClasses();
            setIsLoadingGetClasses(false);
        }
        
        handlerFunctionFetchs();
    }, [page]);

    useEffect(() => {
        if(isLoadingGetClasses) return
        
        const handlerFetchGetAllCategories = async () => {
            const result = await fetchGetAllCategoryClass();
            
            if (result) setAllCategoryClass(result);
            setIsLoadingGetAllCategories(false);
        }

        console.warn('Loading all categories');
        handlerFetchGetAllCategories();
        
        
    }, [isLoadingGetClasses]);

    useEffect(() => {
        if(isLoadingGetClasses || isLoadingGetAllCategories) return;
        
        const handlerFetchGetAllStatus = async () => {
            const result = await fetchGetAllStatusClasses();
            
            if (result) setAllStatus(result);
        
            setIsLoadingGetAllStatus(false);
        }
        

        console.warn('Loading all status');
        handlerFetchGetAllStatus();

    }, [isLoadingGetClasses, isLoadingGetAllCategories]);


    if(isLoadingGetClasses || isLoadingGetAllCategories || isLoadingGetAllStatus){
        return(
            <h1>Cargando clases!</h1>
        )
    }
    
    if(allClasses.length < 0 || allCategories.length < 0 || allStatus.length < 0) {
        return (
            <h1>Error al cargar las clases :(</h1>
        )
    }

    

    if(typeView == 'viewDetail') {
        return(
            <> 
                        {
                            classData ? (
                                <ViewClass
                                    id_class = {classData.id_class}
                                    class_name = {classData.class_name}
                                    description = {classData.description}
                                    max_number_member = {classData.max_number_member}
                                    photo = {classData.photo}
                                    status_name = {classData.status_name}
                                    type_user = {classData.type_user}
                                    handleBack = {handleViewReturnAllClasses}
                                    isEditable = {true}
                                    deleteClass = {handleDeleteClass}
                                    categories = {classData.categories}
                                    allCategories = {allCategories}
                                    allStatus = {allStatus}
                                />
                            ) : (
                                <h1>Error no se encontró la clase</h1>
                            )
                        }
                    </>
        )
    }


    return (
        <>
            <h1>Tus clases</h1>
            <Modal
                id = 'loadingDeleteClass'
                type = 'loader'
                title = 'Loading'
                isOpen = {isModalOpen('loadingDeleteClass')}
                classes = {['modal-infomative-grey']}
                onClose = {closeModal}
            /> 

            <ViewAllClasses
                allClasses = {allClasses}
                type_user = {userData.id_type_user}
                isEditable = {true}
                deleteClass = {handleDeleteClass}
                handleViewClass = {handleViewDetailClass}
            />

            <button onClick={prevPage} disabled={page === 1}>Previous</button>
                    <span> Page: {page} </span>
            <button onClick={nextPage} disabled={page === maxPage}>Next</button>
        </>
    )
} 

export default YourClasses;