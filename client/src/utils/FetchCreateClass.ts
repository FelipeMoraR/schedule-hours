

const fetchCreateClass = async (body: string) => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + '/auth/api/create-class';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include', //Extract cookie credentials
            body: body
        });

        const result = await response.json();

        return result;
        
    }
    catch (e) {
        console.error('Something went wrong' + e);
        return {status: 500, message: 'Error ' + e};
    }

}


export default fetchCreateClass;