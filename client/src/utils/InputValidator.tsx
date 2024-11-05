import { useState } from "react";


export function validateOnlyNumberLetters(value: string){
    const regex = /^[a-zA-Z0-9]+$/;
    const statusRegex = regex.test(value);
    return statusRegex
}

export function validateOnlyLetters(value: string){
    const regex = /^[a-zA-Z]+$/;
    const statusRegex = regex.test(value);
    return statusRegex
}

export function validateOnlyNumbers(value: string){
    const regex = /^[0-9]+$/;
    const statusRegex = regex.test(value);
    return statusRegex
}

export function validateMaxLengthInput(value: string, maxLength: number){
    if(value.length > maxLength){
        return false
    }

    return true
}

export function validateMinLengthInput(value: string, minLength: number){
    if(value.length < minLength){
        return false
    }

    return true
}

export function validatePassword(password: string){
    const allowedCharsRegex = /^[a-zA-Z0-9@!#$%&]+$/.test(password);
    const hasLetter = /[a-zA-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialCharacter = /[@!#$%&]/.test(password);

    return allowedCharsRegex && hasLetter && hasNumber && hasSpecialCharacter;
}


export function validateRut(rut: string){
    const rutStatus = /^[0-9]{8}[0-9kK]$/.test(rut); 
    
    return rutStatus;
}

export function identifyInputError(){
    const [arrayIdError, setArrayIdError ] = useState<Array<string>>([]);
    
    const addIdError = (id: string) => {
        setArrayIdError((prev: string[]) => {
            if(!prev.includes(id)){
                return [...prev, id];
            }
            return prev
        });
    };

    const removeIdError = (id: string) => {
        setArrayIdError(prevArray => prevArray.filter((value: string) => value !== id));
    }

    const emptyIdError = () => setArrayIdError([]);
    
    const hasError = (id : string) => arrayIdError.some((value:string) => id == value );
    
    return { addIdError, removeIdError, emptyIdError, hasError }
}

export function extractComponentRut(rut: string){
    const run = rut.slice(0, 8);
    const dv = rut.slice(8, 9);

    return { run, dv }
}