import { IModal } from '../../interfaces/props';
import formatClass from '../../utils/FormatClass';
import styles from './Modal.module.css';

function Modal ({id, type, title, paragraph, isOpen, classes, onClose}  : IModal){
    const { formatClasses } = formatClass(styles, classes);
    
    if(!isOpen)  return null;

    return(
        <>
            <div className = {styles.overlay}></div>
            <div className = {formatClasses + ' d-flex flex-col p-2'} id = {id}>
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
                            <div className = 'text-align-center'>
                                {title}
                            </div>

                            <div className = {styles.loading + ' d-flex gap-3 h-full flex-justify-content-center flex-align-items-center'}>
                                <div className = {styles.fBall}></div>

                                <div className = {styles.sBall}></div>
                                
                                <div className = {styles.tBall}></div>
                            </div>
                        </>
                    ) : null 
                }
            </div>
        </>  
    )
}

export default Modal;