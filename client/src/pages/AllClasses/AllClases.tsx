import { useEffect, useState } from "react";
import fetchGetAllClasses from "../../utils/FetchGetAllClasses";
import styles from './AllClases.module.css';
import { IAllClasses, IViewClass } from "../../interfaces/props";
import ViewClass from "../../components/ViewClass/ViewClass";


const AllClases = () => {
    const [allClases, setAllClasses] = useState<IAllClasses[]>([]);
    const [classSelected, setClassSelected] = useState<boolean>(false);
    const [classData, setClassData] = useState<IViewClass>()

    const handleViewClass = (id_class: any) => {
        const [dataClass] = allClases.filter((cls) => cls.id_class === id_class);

        if(!dataClass) {
            console.error('Class does not exist');
            return;
        }
        setClassData(dataClass);
        setClassSelected(true);
    }

    const handleViewReturnAllClasses = () => {
        setClassSelected(false);
    }

    useEffect(() => {
        const handlerFetch = async () => {
            const getClasses = await fetchGetAllClasses();

            setAllClasses(getClasses.data);
        };

        handlerFetch();
    }, []);

    return(
        <>  
            {
                classSelected ? (
                    <div>
                        <div onClick={() => {
                            handleViewReturnAllClasses();
                        }}>
                            pa atras
                        </div>
                            
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
                    
                ) : (
                    <div className = {styles.container} >
                        <h1>Mi loco tas en todas las clases :U</h1>

                        <div className = {styles.divitionGridClass + ' d-grid'}>
                            {
                                allClases && allClases.length > 0 ? (
                                    allClases.map((element) => (
                                        <div key={element.id_class}>
                                            <p onClick={() => {
                                                handleViewClass(element.id_class)
                                            }}> Titulo: {element.class_name}</p>

                                            <h3>Descripcion: {element.description}</h3>

                                            <h2>status: {element.status_name}</h2>

                                            <p>max: {element.max_number_member}</p>

                                            <img src={element.photo} alt={element.class_name} className = {styles.imgClass} />
                                            
                                            
                                        </div>
                                    ))
                                ) : (
                                    <p>No hay clases...</p>
                                )
                            }
                        </div>
                        
                    </div>
                )
            }
            
            
            
        </>
    )
}

export default AllClases;