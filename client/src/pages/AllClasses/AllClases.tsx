import { useEffect, useState } from "react";
import fetchGetAllClasses from "../../utils/FetchGetAllClasses";
import { IAllClasses, IViewClass } from "../../interfaces/props";
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
    const [classData, setClassData] = useState<IViewClass>()
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

    const nextPage = () => setPage((prev) => prev + 1);
    const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));


    useEffect(() => {
        const handlerFetch = async () => {
            setIsLoadingGetClasses(true);
            const getClasses = await fetchGetAllClasses(String(page), '3');

            setAllClasses(getClasses.data);
            setIsLoadingGetClasses(false);
        };

        handlerFetch();
    }, [page]);

    useEffect(() => {
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

        if(!isLoadingGetClasses){
            handlerFetchCountClasses();
            return
        }

    
    
    }, [isLoadingGetClasses]);
    


    
    if(isLoadingGetClasses){
        return(
            <h1>Mi loco estan cargando las clases</h1>
        );
    }

    return(
        <>
            <Modal
                id = 'errorSesion'
                type = 'informative'
                title = 'Sesion caducada'
                paragraph = 'Redirigiendo al login..'
                isOpen = {isModalOpen('errorSesion')}
                classes = {['modal-infomative-grey']}
                onClose = {closeModal}
            />


            {
                (typeView === 'viewAll') ? (
                    <>
                     <ViewAllClasses
                        allClasses = {allClasses}
                        handleViewClass = {handleViewDetailClass}
                    />
                    <button onClick={prevPage} disabled={page === 1}>Previous</button>
                        <span> Page: {page} </span>
                    <button onClick={nextPage} disabled={page === maxPage}>Next</button>
                    </>
                ) : (
                    <div>
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

                                />
                            ) : (
                                <h1>Error no se encontró la clase</h1>
                            )
                        }
                    </div>
                )
            }
        </>
    )
}

export default AllClases;