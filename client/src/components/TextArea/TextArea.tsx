import { ITextArea } from "../../interfaces/props";
import styles from "./TextArea.module.css";
import formatClass from '../../utils/FormatClass';


function TextArea({id, name, label, placeholder, maxlength, rows, cols, required, classes, value, onChange}: ITextArea){
    const { formatClasses } = formatClass(styles, classes);


    return(
        <>
            <div className = {formatClasses}>
                <label htmlFor={id}>{label}</label>
                <textarea 
                    id = {id} 
                    name = {name} 
                    placeholder = {placeholder} 
                    maxLength = {maxlength} 
                    rows = {rows} 
                    cols = {cols} 
                    value = {value}
                    required = {required} 
                    onChange = {onChange}>
                        
                </textarea>
            </div>
        </>
    )
}

export default TextArea;


