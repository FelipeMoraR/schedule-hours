import { useEffect, useState } from "react";
import fetchGetAllClasses from "../../utils/FetchGetAllClasses";
import { IAllClasses, IClass } from "../../interfaces/props";
import ViewClass from "../../components/ViewClass/ViewClass";
import ViewAllClasses from "../../components/AllClassesView/AllClassesView";
import validateSesion from "../../utils/SesionValidator";
import { useModal } from "../../utils/UseModal";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import fetchGetCountClasses from "../../utils/FetchGetCountClasses";
import { useAuthContext } from "../../hooks/authContext";


const AllClases = () => {
    const [allClasses, setAllClasses] = useState<IAllClasses[]>([]);
    const [classData, setClassData] = useState<IClass>();
    const [typeView, setTypeView] = useState('viewAll');
    const {closeModal, isModalOpen, showModal} = useModal();
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>(1);
    const [isLoadingGetClasses, setIsLoadingGetClasses] = useState<boolean>(true);
    const navigate = useNavigate();
    const {userData} = useAuthContext();
    

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

    const handlerFetchGetAllClasses = async () => {
        setIsLoadingGetClasses(true);
        const getClasses = await fetchGetAllClasses(String(page), '3');
        
        setAllClasses(getClasses.data);
        setIsLoadingGetClasses(false);
    };

    const handlerFetchCountClasses = async () => {
        const countClasses = await fetchGetCountClasses();
        
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
        handlerFetchGetAllClasses();
        handlerFetchCountClasses();
    }, [page]);


    
    if(isLoadingGetClasses){
        return(
            <h1>Cargando clases!</h1>
        );
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
                            handleBack={handleViewReturnAllClasses}
                            isEditable = {false}
                            categories = {classData.categories}
                        />
                    ) : (
                        <h1>Error no se encontró la clase</h1>
                    )
                }
            </>
        )
    }

    return(
        <>

            <h1>Todas las clases</h1>
            
            <Modal
                id = 'errorSesion'
                type = 'informative'
                title = 'Sesion caducada'
                paragraph = 'Redirigiendo al login..'
                isOpen = {isModalOpen('errorSesion')}
                classes = {['modal-infomative-grey']}
                onClose = {closeModal}
            />

            <ViewAllClasses
                allClasses = {allClasses}
                handleViewClass = {handleViewDetailClass}
                type_user = {userData.id_type_user}
                isEditable = {false}
            />

            <button onClick={prevPage} disabled={page === 1}>Previous</button>
                <span> Page: {page} </span>
            <button onClick={nextPage} disabled={page === maxPage}>Next</button>            
        </>
    )
}

export default AllClases;