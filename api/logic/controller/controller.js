require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../models/index');
const secret = process.env.JWT_SECRET;

//using it
const jwtVerifyAsync = (token, secret) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) {
                reject(err);
            } else {
                resolve(decoded);
            }
        });
    });
};

//using it
const decodeJWT = (token) => {
    const [header, payload, signature] = token.split('.');

    // Decodificar la parte base64 de manera URL-safe
    const decodeBase64Url = (str) => {
        const base64 = str.replace(/-/g, '+').replace(/_/g, '/');
        try {
            return decodeURIComponent(atob(base64));
        } catch (e) {
            return atob(base64);
        }
    };

    // Decodificar el header y el payload (JSON) y la firma (sin decodificar)
    const decodedHeader = JSON.parse(decodeBase64Url(header));
    const decodedPayload = JSON.parse(decodeBase64Url(payload));
    const decodedSignature = signature; // La firma no se decodifica

    return {
        header: decodedHeader,
        payload: decodedPayload,
        signature: decodedSignature,
    };
}

//using it
const createTypeUser = async(req, res) => {
    try{
        const {
            name 
        } = req.body;

        const [result] = await db.sequelize.query('CALL CreateUserType(:name);', 
            {
                replacements: {
                    name: name
                },
                type: db.Sequelize.QueryTypes.RAW
            }
        );

        if(!result){
            return res.status(404).send({ status: 404, message: 'An error happend'});
        }

        return res.status(200).send({ status: 200, message: result});
    }

    catch (err){
        console.error(err);
        return res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
}

//using it
const cookieValidator = async(req, res) => {
    return res.send({ status: 200, message: 'Token is valid'}); 
}

//using it
const midleWareVerifyToken = async (req, res, next) => {
    try{
        const authToken = req.cookies.token;
        
        if(!authToken){
            return res.status(404).send({ status: 404, message: 'Token does not exist'});
        }

        const [resultSearchToken] = await db.sequelize.query('CALL SearchToken(:token);', 
                {
                    replacements: {
                        token: authToken
                    },
                    type: db.Sequelize.QueryTypes.RAW
                }
            );
    
        if(resultSearchToken.token_exist === 1){
            return res.status(401).send({ status: 401, message: "Invalid token"});
        }
    
        jwt.verify(authToken, secret, (err, decoded) => {
            if (err) return res.status(401).send({ status: 401, message: 'Unauthorizated'});

            req.info = decoded;
            next(); //This execute the next function on the routes.
        })
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
    
}

//using it
const registerUser = async (req, res) => {
    try{
        const { username, 
            password, 
            first_name, 
            last_name, 
            run, 
            run_dv, 
            age, 
            id_type_user } = req.body;
    
        const hashedPassword = bcrypt.hashSync(password, 8);

        const [result] = await db.sequelize.query('CALL RegisterUser(:username, :hashedPassword, :first_name, :last_name, :run, :run_dv, :age, :id_type_user);', 
            {
                replacements: {
                    username: username,
                    hashedPassword: hashedPassword,
                    first_name: first_name,
                    last_name: last_name,
                    run: run,
                    run_dv: run_dv,
                    age: age,
                    id_type_user: id_type_user
                },
                type: db.Sequelize.QueryTypes.RAW
            }
        );

        const user_created = result.user_created;

        if (user_created === 1){
            return res.status(201).json({ status: 201, message: 'User created!'});
        } else {
            return res.status(409).json({ status: 409, message: 'User already exist!'});
        }

        
    }
    
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
    

}

//using it
const loginUser = async (req, res) => {   
    try{
        const { username, 
            password, 
        } = req.body;
    
        const [result] = await db.sequelize.query('CALL LoginUser(:username);', 
            {
                replacements: {
                    username: username,
                },
                type: db.Sequelize.QueryTypes.RAW
            }
        );
        if (!result) return res.status(404).json({status: 404, message: "User doesnt exist"});
        
        const resPassword = result.password;
        const resId = result.id_user;

        bcrypt.compare(password, resPassword, async (err, isMatch) => {
            if (err) return res.status(500).json({ status: 500, message: "Internal server error" });
            if(!isMatch) return res.status(401).json({status: 401, message: "Password incorrect"});  

            const objToken = { 
                id: resId,
                username: username 
            }

            const token = jwt.sign(objToken, secret, {
                expiresIn: 30 //This is in seconds
            });

            const objRefreshToken = {
                id: resId,
                username: username 
            }

            const refreshToken = jwt.sign(objRefreshToken, secret, {
                expiresIn: '5m'
            });
            
            const resultUpdateRefreshToken = await db.sequelize.query('CALL UpdateRefreshToken(:id_user, :refresh_token);',
                {
                    replacements: {
                        id_user: resId, 
                        refresh_token: refreshToken
                    },
                    type: db.Sequelize.QueryTypes.RAW
                }
            );

            if (!resultUpdateRefreshToken){
                return res.status(404).json({status: 404, message: 'Refresh token did not updated'});
            }
            
            

            return res.status(200).cookie('token', token, { //This look like encoded because the const token is a special character to prevent errors, first thing objinfo is transformered to a string with json.stringify()
                    sameSite: 'strict', // if you declare it like none this in local wont work
                    secure: false, //http secure
                    path: '/',
                    expires: new Date(new Date().getTime() + 0.5 * 60 * 1000),
                    httpOnly: true
                }
            )
            .cookie('refreshToken', refreshToken, {
                sameSite: 'strict', // if you declare it like none this in local wont work
                secure: false,
                path: '/',
                expires: new Date(new Date().getTime() + 5 * 60 * 1000),
                httpOnly: true
            })
            .json({
                status: 200,
                message: 'cookie being initialised'
            });
        });
    }    
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
}

//using it
const logoutUser = async (req, res) => {
    try{
        const token = req.cookies.token;
        const user = decodeJWT(token);
            
        const [resultDeleteInsertResfreshToken] = await db.sequelize.query('CALL DeleteInsertRefreshTokenBlackList(:id_user);', 
                {
                    replacements: {
                        id_user: user.payload.id
                    },
                    type: db.Sequelize.QueryTypes.RAW
                }
            );
        const statusInsertedRefreshToken = resultDeleteInsertResfreshToken.resfresh_token_inserted_deleted;
        let typeInsertion = '';
            
        //Set the type of insert
        if(statusInsertedRefreshToken === 1){
            typeInsertion = 'token inserted';
        } else {
            typeInsertion = 'token already exist';
        }

        return res.status(200).clearCookie('token', {
            path: '/', 
            sameSite: 'strict', 
            secure: false, 
            httpOnly: true 
        }).
        clearCookie('refreshToken', {
            path: '/', 
            sameSite: 'strict', 
            secure: false, 
            httpOnly: true 
        }).
        json({status: 200, message: "Logout successful, " + typeInsertion});
        
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
    
}


//using it
const removeCookie = async (req, res) => {
    const cookies = req.cookies.token;

    if(!cookies){
        return res.status(400).json({status: 400, message: "Cookie does not exist"});
    }

    return res.status(200).clearCookie('token', {
        path: '/', 
        sameSite: 'strict', 
        secure: false, 
        httpOnly: true 
      }).
      json({status: 200, message: "cookie removed"})
}

const insertTokenBlackList = async (req, res) => {
    const {token} = req.body;

    if(!token) return res.status(404).json({status: 404, message: 'Token do not exist'});

    const [result] = await db.sequelize.query('CALL InsertTokenBlackList(:token);',  //This is a raw query
                {
                    replacements: {
                        token: token
                    },
                    type: db.Sequelize.QueryTypes.RAW
                }
            );
        
    const statusInsertedToken = result.token_inserted 

    if(statusInsertedToken === 1) {
        return res.status(200).json({status: 200, message: 'Token inserted'});
    } else{
        return res.status(302).json({status: 302, message: 'Token already exist'});
    }
   
}

//using it
const refreshToken = async (req, res) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        const authToken = req.cookies.token;
        
        if (!refreshToken && !authToken) {
            return res.status(404).send({ status: 404, message: 'Refresh token and token does not exist' });
        } 

        if (!refreshToken && authToken){
            return res.status(404).send({ status: 404, message: 'Refresh token does not exist' });
        } 
        
        const userRefreshToken = await jwtVerifyAsync(refreshToken, secret);

        //verify if the refresh token is valid (is on our db)
        const resultVerifyRefreshToken = await db.sequelize.query('CALL VerifyRefreshToken(:id_user);',
            {
                replacements: {
                    id_user: userRefreshToken.id
                },
                type: db.Sequelize.QueryTypes.RAW
            }
        );
        
        if(resultVerifyRefreshToken[0].refresh_token === 0){
            return res.status(401).json({status: 401, message: 'Refresh token not valid'});
        }


        if(refreshToken && !authToken){ //we have to look at it 
            const newToken = jwt.sign({ id: userRefreshToken.id, username: userRefreshToken.username }, secret, { expiresIn: 30 });

            return res.status(200).cookie('token', newToken, {
                sameSite: 'strict',
                secure: false,
                path: '/',
                expires: new Date(Date.now() + 0.5 * 60 * 1000), 
                httpOnly: true
            }).json({ status: 200, message: 'Token updated' });
        }
        
        const decodedAuthToken = jwt.verify(authToken, secret);
        const currentTime = Math.floor(Date.now() / 1000); //Actual time in seconds
        
        const timeRemaining = decodedAuthToken.exp - currentTime;
        
        if (timeRemaining > 5) {
            return res.status(200).send({ status: 200, message: 'Token is still valid, no refresh needed' });
        }
            
        jwt.verify(refreshToken, secret, (err, user) => {
            if (err) {
                return res.status(403).json({ status: 403, message: 'Error in the refresh token: ' + err });
            }
    
                
            const newToken = jwt.sign({ id: user.id, username: user.username }, secret, {
                expiresIn: 30 
            });
            
            return res.status(200).cookie('token', newToken, {
                sameSite: 'strict',
                secure: false,
                path: '/',
                expires: new Date(Date.now() + 0.5 * 60 * 1000), 
                httpOnly: true
            }).json({ status: 200, message: 'Token updated' });
        });

    } catch (err){
        console.error('Something went wrong, ' + err);
        return res.status(500).json({status: 500, message: 'something went wrong updating token' + err});
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    midleWareVerifyToken,
    createTypeUser,
    cookieValidator,
    removeCookie,
    refreshToken,
    insertTokenBlackList
}