import { useState } from "react";

export function useModal() {
    const [openModal, setOpenModal] = useState<string | null>(null);

    const showModal = (idModal: string | null) => setOpenModal(idModal);
    const closeModal = () => setOpenModal(null);
    const isModalOpen = (idModal: string | null) => openModal === idModal; //This return true or false depends of the entry parameter
    
    return{
        showModal,
        closeModal,
        isModalOpen 
    };
}