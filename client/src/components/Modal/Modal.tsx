import { useEffect } from 'react';
import { IModal } from '../../interfaces/props';
import formatClass from '../../utils/FormatClass';
import styles from './Modal.module.css';

function Modal ({id, type, title, paragraph, isOpen, classes, onClose}  : IModal){
    const { formatClasses } = formatClass(styles, classes);
    
    useEffect(() => {
        if(!isOpen) return;
    }, [isOpen]);

    if(!isOpen)  return null;

    return(
        <div className = {formatClasses} id = {id}>
            { 
                type === 'informative' ? (
                    <>
                        <div onClick={onClose}>
                            x
                        </div>

                        <div>
                            {title}
                        </div>

                        <div>
                            {paragraph}
                        </div>
                    </>
                    
                ): type === 'loader' ? (
                    <>
                        <div>
                            {title}
                        </div>

                        <div>
                            Here u have to put the loading animation.
                        </div>
                    </>
                ) : null 
            }
        </div>
    )
}

export default Modal;