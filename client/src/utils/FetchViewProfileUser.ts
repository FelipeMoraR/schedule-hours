
const fetchViewProfileUser = async (idUser: string) => {
    try{
        const apiUrl = import.meta.env.VITE_BACKEND_URL;
        const url = apiUrl + `/auth/api/view-user/${idUser}`;
        console.log(url)
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        });

        const result = await response.json();

        return result;

    } catch (err){
        console.error('Error in fetchViewProfileUser::: ' + err);
        return
    }
}

export default fetchViewProfileUser;

