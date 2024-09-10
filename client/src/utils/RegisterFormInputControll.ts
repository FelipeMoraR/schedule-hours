export function rutStructure(rut:string){
    let errorRut = '';
    const rutPattern = /^\d{8}-[0-9kK]$/;

    if(rut.length !== 10){
        errorRut += 'Error en el formato del rut, faltan caracteres'
    }

    if(!rutPattern.test(rut)){
        errorRut += 'Error en el formato del rut, debe tener el siguiente formato 12345678-k'
    }

    return { errorRut }
}