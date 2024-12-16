
const fetchUpdateUser = async (body: string) => {
    const urlBackend = import.meta.env.VITE_BACKEND_URL;
    const url = urlBackend + '/auth/api/update-user';

    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: body
    });

    const result = await response.json();

    return result;
}

export default fetchUpdateUser;