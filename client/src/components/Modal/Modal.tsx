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
            <div onClick={onClose}>
                x
            </div>

            <div>
                <div>
                    {title}
                </div>

                <div>
                    { 
                        type === 'informative' ? (
                            <div>
                                {paragraph}
                            </div>
                        ): type === 'loader' ? (
                            <div>
                                LOADING...
                            </div>
                        ) : null 
                    }
                </div>
            </div>
            
        </div>
    )

    
     

}

export default Modal;