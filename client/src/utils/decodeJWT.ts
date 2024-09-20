const decodeJWT = (token: string): { [key: string]: any } | null => {
    if (!token) {
        return null; // Retornar null si el token no es válido
    }

    const base64Url = token.split('.')[1];
    if (!base64Url) {
        return null; // Retornar null si no se puede obtener la parte del payload
    }

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(window.atob(base64).split('').map(c => {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    try {
        return JSON.parse(jsonPayload); // Retornar el payload como un objeto
    } catch (e) {
        console.error('Error parsing JSON:', e);
        return null; // Retornar null si hay un error en el parseo
    }
};

export default decodeJWT;