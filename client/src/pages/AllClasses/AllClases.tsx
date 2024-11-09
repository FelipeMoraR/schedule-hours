import { useEffect, useState } from "react";
import fetchGetAllClasses from "../../utils/FetchGetAllClasses";
import { IAllClasses, IViewClass } from "../../interfaces/props";
import ViewClass from "../../components/ViewClass/ViewClass";
import ViewAllClasses from "../../components/AllClassesView/AllClassesView";
import Button from "../../components/Button/Button";
import validateSesion from "../../utils/SesionValidator";
import { useModal } from "../../utils/UseModal";
import Modal from "../../components/Modal/Modal";
import { useNavigate } from "react-router-dom";
import fetchGetCountClasses from "../../utils/FetchGetCountClasses";


const AllClases = () => {
    const [allClasses, setAllClasses] = useState<IAllClasses[]>([]);
    const [classData, setClassData] = useState<IViewClass>()
    const [typeView, setTypeView] = useState('viewAll');
    const {closeModal, isModalOpen, showModal} = useModal();
    const [page, setPage] = useState<number>(1);
    const [maxPage, setMaxPage] = useState<number>();
    const [isLoadingGetClasses, setIsLoadingGetClasses] = useState<boolean>(true);
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
        setClassData(dataClass);
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
            //Controll this please !IMPORTANT
            const countClasses = await fetchGetCountClasses();
            
            if(!countClasses) return
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

        handlerFetchCountClasses();
    }, []);

    
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
                        <Button
                            id = 'goBackAllClasses'
                            text = 'Volver'
                            type = 'buttom'
                            classes = {['clase']}
                            onClick = {handleViewReturnAllClasses}
                        />
                
                        {
                            classData ? (
                                <ViewClass
                                    id_class = {classData.id_class}
                                    class_name = {classData.class_name}
                                    description = {classData.description}
                                    max_number_member = {classData.max_number_member}
                                    photo = {classData.photo}
                                    status_name = {classData.status_name}
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