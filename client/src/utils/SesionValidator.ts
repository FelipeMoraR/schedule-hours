import fetchVerifyToken from "./FetchVerifyToken";
import fetchRefreshToken from "./FetchRefreshCookie";


const validateSesion = async () => {
    const hasToken = await fetchVerifyToken();
    
    if(!hasToken){ //There is no token but maybe would be a refresh token
        const hasRefreshToken = await fetchRefreshToken(); //we can upload the token?
        
        if(!hasRefreshToken) { //With this we controll the token expiration while we have a refresh token working
            return false
        }
    }

    return true
};

export default validateSesion;