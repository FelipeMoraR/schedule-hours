
const fetchInsertTokenBlackList = async (body: string) => {
    const apiUrl = import.meta.env.VITE_BACKEND_URL;
    const url = apiUrl + '/auth/api/insert-token-black-list';

    try{
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: body
        })

        if(response.status == 200 || response.status == 302){
            return true
        }

        return false

    } catch(err){
        console.error('There is an error inserting token.' + err)
        return false
    }
    
}

export default fetchInsertTokenBlackList;