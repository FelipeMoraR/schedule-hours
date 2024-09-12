

export function regexOnlyNumberLetters(value: string){
    const regex = /^[a-zA-Z0-9]+$/;
    const statusRegex = regex.test(value);
    return statusRegex
}

export function maxLengthInput(value: string, maxLength: number){
    if(value.length > maxLength){
        return false
    }

    return true
}

export function minLengthInput(value: string, minLength: number){
    if(value.length < minLength){
        return false
    }

    return true
}

export function validatePassword(password: string){
    const allowedCharsRegex = /^[a-zA-Z0-9@!#$%&]+$/.test(password);
    const hasLetter = /^[a-z]+$/.test(password);
    const hasNumber = /^[0-9]+$/.test(password);
    const hasSpecialCharacter = /^[@!#$%&]+$/.test(password);
    

    return allowedCharsRegex && hasLetter && hasNumber && hasSpecialCharacter;
}