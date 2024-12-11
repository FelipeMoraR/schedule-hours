require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../models/index');
const cron = require('node-cron');
const secret = process.env.JWT_SECRET;
const cloudinary = require('cloudinary').v2;


//Variables of our cloudinary client
const cloud_name = process.env.CLOUD_NAME;
const cloud_api_key = process.env.CLOUD_API_KEY;
const cloud_api_secret = process.env.CLOUD_API_SECRET;


cloudinary.config({
  cloud_name: cloud_name,
  api_key: cloud_api_key,
  api_secret: cloud_api_secret
});

//These are optional parameters => https://cloudinary.com/documentation/image_upload_api_reference
const opts = {
  invalidate: true,
  resource_type: 'image',
  folder: 'images_schedule'
}; 


cron.schedule('*/15 * * * *', async () => {
    try{
        const [_, rowsAffected] =  await db.sequelize.query(`UPDATE CLASS SET id_status = 2 WHERE CONCAT(date_class, ' ', time_class) < NOW() AND id_status != 2`,{
            type: db.Sequelize.QueryTypes.UPDATE
        });

        console.log('status classes changed to expired!, rows affected => ', rowsAffected);
    } catch (err) {
        console.error('Error CRON changing class status ' + err);
    }
});

const insertCategoryClass = async (id_class, categories) => {
    try{
        await Promise.all(categories.map(async element => {
            await db.sequelize.query('INSERT INTO CLASS_CATEGORY (id_category, id_class, createdAt, updatedAt)  VALUES (:p_id_category, :p_id_class, NOW(), NOW())',
                {
                    replacements: {
                        p_id_category: element, 
                        p_id_class: id_class
                    },
                    type: db.Sequelize.QueryTypes.RAW
                }
            )
        }));
        return true;
    } catch(err){
        console.error('Something went wrong insertCategoryClass:: ' + err);
        return false;
    }
};

const uploadCloudImg = (image) => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload(image, opts, (error, result) => {
            if(result && result.secure_url) {
                return resolve(result.secure_url);
            }

            console.log('Error cloudinary => ', error.message);
            return reject(error.message);
        });
    });
};

const deleteCloudImg = async (folder, nameImg) => {
    const idImg = folder + '/' + nameImg;

    return new Promise((resolve, reject) => {
        cloudinary.uploader.destroy(idImg, { invalidate: true }, (error, result) => {
            console.log('result => ', result);
            if(result) return resolve(result);

            console.error('Error deleteCloudImg => ' + error);
            return reject(error);
        })
    })
}

const resUploadCloudImg = (req, res) => {
    try{
        const { image } = req.body;
        if (!image) return res.status(404).json({status: 404, message: 'Image not provided'});

        uploadCloudImg(image)
            .then((url) => res.status(200).json({status: 200, message: url}))
            .catch((err) => res.status(500).json({status: 500, message: err}))
    }
    catch(err){
        console.error('Error resUploadCloudImg:: ', err);
        return res.status(500).json({status: 500, message: 'Something went wrong'});
    }
};


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
        console.error('Error createTypeUser:: ' + err);
        return res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
}

//using it
const cookieValidator = async(_, res) => {
    return res.send({ status: 200, message: 'Token is valid'}); 
}

//using it
const midleWareVerifyToken = async (req, res, next) => {
    console.log('Ejecutando middleware, FIX MEEEEEE PLEASE I NEED FKIN HELP BRO PLEASE DONT FORGET ME');
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
        console.error('Error midleWareVerifyToken:: ' + err);
        return res.status(500).json({ status: 500, error: 'Something went wrong ' + err});
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
        const errors_register = result.error_register

        if (user_created === 1){
            return res.status(201).json({ status: 201, message: 'User created!'});
        } else {
            console.error('Error registerUser:: ' + errors_register);
            return res.status(409).json({ status: 409, message: errors_register});
        }
        
    }
    
    catch (err) {
        console.error('Error registerUser:: ' + err);
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
                expiresIn: 900 //This is in seconds, 15 min
            });

            const objRefreshToken = {
                id: resId,
                username: username 
            }

            const refreshToken = jwt.sign(objRefreshToken, secret, {
                expiresIn: '7d'
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
                    expires: new Date(new Date().getTime() + 15 * 60 * 1000),
                    httpOnly: true
                }
            )
            .cookie('refreshToken', refreshToken, {
                sameSite: 'strict', // if you declare it like none this in local wont work
                secure: false,
                path: '/',
                expires: new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000),
                httpOnly: true
            })
            .json({
                status: 200,
                message: 'cookie being initialised'
            });
        });
    }    
    catch (err) {
        console.error('Error loginUser:: ' + err);
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
        console.error('Error logoutUser ' + err);
        return res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
    
}


//using it
const removeCookie = async (req, res) => {
    try{
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
        json({status: 200, message: "cookie removed"});
        } 
    catch (e){
        console.log('Something went wrong removeCookie:: ', e);
        return res.status(500).json({status: 500, message: 'Someting went wront' + e});
    }
    
}

const insertTokenBlackList = async (req, res) => {
    try{
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
    catch (e){
        console.log('Something went wrong insertTokenBlackList:: ', e);
        return res.status(500).json({status: 500, message: 'Someting went wront' + e});
    }
}

const getUserData = async (req, res) => {
    try{
        const userId = req.info.id; //This is from the middleware
    
        if(!userId) return res.status(404).json({status: 404, error: 'User not logged'});
        
        const [result] = await db.sequelize.query('CALL GetUser(:id_user)', 
            {
                replacements: {
                    id_user: userId
                },
                type: db.Sequelize.QueryTypes.RAW
            }
        );
    
        const notFoundUser = result.user_status_select;
    
        if(notFoundUser) return res.status(404).json({status: 404, error: 'User does not exist'});
    
        return res.status(200).json({ status: 200, data: {
            id_user: userId,
            username: result.username,
            first_name: result.first_name,
            last_name: result.last_name,
            second_last_name: result.second_last_name,
            run: result.run,
            run_dv: result.run_dv,
            description: result.description,
            profile_photo: result.profile_photo,
            age: result.age,
            id_type_user: result.id_type_user
        }});
    }

    catch (e){ 
        console.log('Something went wrong getUserData::', e);
        return res.status(500).json({status: 500, message: 'Someting went wront' + e});
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
            const newToken = jwt.sign({ id: userRefreshToken.id, username: userRefreshToken.username }, secret, { expiresIn: 900 });

            return res.status(200).cookie('token', newToken, {
                sameSite: 'strict',
                secure: false,
                path: '/',
                expires: new Date(Date.now() + 15 * 60 * 1000), 
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
                expiresIn: 900 
            });
            
            return res.status(200).cookie('token', newToken, {
                sameSite: 'strict',
                secure: false,
                path: '/',
                expires: new Date(Date.now() + 15 * 60 * 1000), 
                httpOnly: true
            }).json({ status: 200, message: 'Token updated' });
        });

    } catch (err){
        console.error('Something went wrong refreshToken:: ' + err);
        return res.status(500).json({status: 500, message: 'something went wrong updating token' + err});
    }
}

const createStatusClass = async (req, res) => {
    try{
        const {status_name} = req.body;

        if (!status_name) return res.status(404).json({status: 404, message: 'Status name does not exist'});

        const [resultDB] = await db.sequelize.query('CALL CreateStatus(:p_name)',
            {
                replacements: {
                    p_name: status_name
                },
                type: db.Sequelize.QueryTypes.RAW
            }
        );
        
        if (resultDB.result == 1){
            return res.status(201).json({status: 201, message: 'Status created'});
        } else {
            return res.status(203).json({status: 203, message: 'Status already exist'});
        }
    }
    catch (e) {
        console.log('Something went wrong createStatusClass:: ', e);
        return res.status(500).json({status: 500, message: 'Someting went wront' + e});
    }
}


const createClass = async (req, res) => {     
    try{
        const { name, description, max_members, photo, categories, id_type_class_user, date, time } = req.body;
        const userId = req.info.id;

        if(!userId) return res.status(404).json({status: 404, message: 'Id user not provided'});

        if( !name || !description || !max_members || !photo || !date || !time ) return res.status(400).json({status: 400, message: 'Some value on the req.body is missing'});

        const [result] = await db.sequelize.query('CALL CreateNewClass(:id_user, :name, :description, :max_members, :photo, :id_type_class_user, :date, :time)', 
            {
                replacements: {
                    id_user: userId,
                    name: name,
                    description: description,
                    max_members: max_members,
                    photo: photo,
                    id_type_class_user: id_type_class_user,
                    date: date,
                    time: time
                },
                type: db.Sequelize.QueryTypes.RAW
            }
        );

        const statusClassCreated = result.class_inserted;
        const idClassCreated= result.new_class;

        if(statusClassCreated == 1 ) {
            console.log('Class created!!, generating categories...');
            
            const statusInsertCategoryClass = await insertCategoryClass(idClassCreated, categories);

            if(!statusInsertCategoryClass) return res.status(200).json({status: 500, message: 'Error inserting categories'});

            return res.status(200).json({status: 200, message: 'Class created! and categories inserted'});
        }

        return res.status(500).json({status: 500, message: 'Something went wrong, class not created'});
    }
    catch(err){
        console.log('Something went wrong createClass:: ' + err);
        return res.status(500).json({status: 500, message: 'Error: ' + err});
    }    
}   


const getClassCategory = async (classes) => {
        let classesWithCategories = []; 

        try{
            await Promise.all( //This execute the code in parallel
                classes.map(async (cls) => {
                    try{
                        const query = `
                            SELECT 	ct.id_category,
                                    ct.name AS category_name
                            FROM CLASS c
                            JOIN CLASS_CATEGORY cc ON cc.id_class = c.id_class
                            JOIN CATEGORY ct ON ct.id_category = cc.id_category
                            WHERE c.id_class = :id_class;
                        `
                        let categoriesPerClass = await db.sequelize.query(query, {
                            replacements: {
                                id_class: cls.id_class
                            },
                            type: db.Sequelize.QueryTypes.SELECT
                        });
    
                        let classFiltred =  classes.filter(el => el.id_class == cls.id_class)[0]
                        classFiltred['categories'] = categoriesPerClass;
                    
                        classesWithCategories.push(classFiltred);
                    } catch (err) {
                        throw new Error('Failed to fetch category for class'); //This interrupt the parallel execution.
                    }
                })
            );
        } catch(err){
            console.error('Error extracting class category getClassCategory:: ' + err);
            return false
        }
        


        return classesWithCategories;
}


const getAllClasses = async (req, res) => {
    
    try{
        let { page = 1, limit = 3 , idUser} = req.query;

        if(!page){
            console.log('No page, setting default page');
            page = 1;
        }

        if(!limit){
            console.log('No limit, setting default limit');
            limit = 3;
        }

        const offset = (page - 1) * limit;

        let query = `
                SELECT 
			        c.id_class, 
			        c.name AS class_name,
                    c.description,
                    c.max_number_member,
                    c.photo,
                    c.date_class,
                    c.time_class,
                    s.name AS status_name
                    FROM CLASS c 
	                JOIN CLASS_USER cu ON c.id_class = cu.id_class
                    JOIN STATUS s ON c.id_status = s.id_status
                    `

        const replacements = {};
        if(idUser) {
            query += `WHERE cu.id_user = :idUser AND STR_TO_DATE(CONCAT(c.date_class, ' ', c.time_class), '%Y-%m-%d %H:%i:%s') > NOW() AND s.id_status != 2 `;
            replacements.idUser = parseInt(idUser);
        }

        if(!idUser) query += ` WHERE STR_TO_DATE(CONCAT(c.date_class, ' ', c.time_class), '%Y-%m-%d %H:%i:%s') > NOW() AND s.id_status != 2 `;

        // Adding Limit and offset in a safe way
        query += ` GROUP BY c.id_class  ORDER BY c.id_class LIMIT :limit OFFSET :offset`;
        replacements.limit = parseInt(limit);
        replacements.offset = parseInt(offset);
        
        const classes = await db.sequelize.query(query, {
            replacements,
            type: db.Sequelize.QueryTypes.SELECT,
        });

        
        if (classes.length == 0) return res.status(404).json({status: 404, message: 'Classes not founded'});

        const listClasses = await getClassCategory(classes);
        
        if(!listClasses) return res.status(500).json({status: 500, message: 'Error extracting classes categories'});

        

        return res.status(200).json({status: 200, message: 'Success', data: listClasses});
    }
    catch(err){
        console.error('Something went wrong getAllClasses:: ' + err);
        return res.status(500).json({status: 500, message: 'Error ' + err})
    }
};

const getTotalCountClasses = async (req, res) => {
    try{
        const { idUser } = req.query;

        let query = `
            WITH TMPCLASS AS (
	            SELECT 
		            c.name AS class_name,
                    c.id_class,
                    cu.id_user,
                    ROW_NUMBER() OVER (PARTITION BY c.id_class ORDER BY c.id_class) AS row_num
	            FROM 
		            CLASS c 
				JOIN CLASS_USER cu ON c.id_class = cu.id_class
				JOIN STATUS s ON c.id_status = s.id_status
                WHERE STR_TO_DATE(CONCAT(c.date_class, ' ', c.time_class), '%Y-%m-%d %H:%i:%s') > NOW() AND s.id_status != 2 
            )

            SELECT COUNT(*) AS totalItems
            FROM TMPCLASS
        `
        const replacements = {};
        if(idUser) {
            query += `WHERE row_num = 1 AND id_user = :idUser `
            replacements.idUser = parseInt(idUser);
        }
        else {
            query += `WHERE row_num = 1`
        } 

        const totalItemsResult = await db.sequelize.query(query, { 
                replacements,
                type: db.Sequelize.QueryTypes.SELECT 
            }
        );
        const totalItems = totalItemsResult[0].totalItems;
        
        if(!totalItems) return res.status(404).json({status: 404, message: 'No count'});
    
        return res.status(200).json({status: 200, totalItems: totalItems});
    }
    catch(err){
        console.error('Error getTotalCountClasses ' + err);
        return res.status(500).json({status: 500, message: 'Error ' + err});
    }
    
}

const getAllCategoryClass = async (_, res) => {
    try{
        const result = await db.sequelize.query('SELECT id_category, name AS category_name FROM category;', 
            {
                type: db.Sequelize.QueryTypes.SELECT
            }
        )

        if(!result) return res.status(204).json({status: 204, message: 'No results in the petition'});

        return res.status(200).json({status: 200, data: result});
    } 
    catch(err){
        console.log('Something went wrong ' + err);
        return res.status(500).json({status: 500, message: 'Error: ' + err});
    }
};


const getAllStatusClass = async (_, res) => {
    try{
        const result = await db.sequelize.query('SELECT id_status, name FROM status;', 
            {
                type: db.Sequelize.QueryTypes.SELECT
            }
        )

        if(!result) return res.status(204).json({status: 204, message: 'No results in the petition'});

        return res.status(200).json({status: 200, data: result});
    } 
    catch(err){
        console.log('Something went wrong ' + err);
        return res.status(500).json({status: 500, message: 'Error: ' + err});
    }
};


const deleteClass = async (req, res) => {

    const transaction = await db.sequelize.transaction(); //Transaction starts
    
    try{
        const { id, folder, nameImg } = req.params;

        if (!id || !folder || !nameImg) return res.status(404).json({status: 404, message: 'Values not provided'});

        console.log(folder + ' ' + nameImg);

        await deleteCloudImg(folder, nameImg)
            .then(async (msj) => {
                if(msj.result !== 'ok') throw new Error('Img not deleted');
                
                const [result] = await db.sequelize.query('CALL DeleteClass(:id_class)', 
                    {
                        replacements: {
                            id_class: parseInt(id) 
                        },
                        transaction
                    }
                )

                if(!result) return res.status(500).json({status: 500, message: 'Something went wront, no data returned'});

                await transaction.commit();

                return res.status(200).json({status: 200, message: result['Total rows deleted'] + ' Rows deleted'});
            })
            .catch((err) => {
                throw new Error(err);
            });

        
    }
    catch(err){
        await transaction.rollback();
        console.error(err);
        return res.status(500).json({status: 500, message: 'Something went wrong deleteClass:: => ' + err });
    }
}

const cancellClass = async (req, res) => {
    const { id_class } = req.body;

    if(!id_class) return res.status(404).json({status: 404, message: 'Id class not provided'});

    const transaction = await db.sequelize.transaction(); //Transaction starts

    try{
        const [_, affectedRows] = await db.sequelize.query('UPDATE CLASS SET id_status = 3 WHERE id_class = :id_class',{
            replacements: {
                id_class: parseInt(id_class)
            },
            transaction,
            type: db.Sequelize.QueryTypes.UPDATE
        });

        if(affectedRows > 0){
            console.log('Class cancelled!');
            await transaction.commit(); // Made the upload in DB

            return res.status(200).json({status: 200, message: 'Class cancelled'});
        }

        await transaction.rollback();

        return res.status(304).json({status: 304, message: 'Class not modified'});

    } catch (err) {
        await transaction.rollback();
        console.error('Error cancelling class => ' + err);
        return res.status(500).json({status: 500, message: 'Error cancelling class ' + err});
    }
    
}

const uploadClass = async (req, res) => {
    const { id_class, new_name, new_description, new_max_number_member, new_photo, new_id_status, new_categories, new_date, new_time } = req.body;
    
    const transaction = await db.sequelize.transaction(); //Transaction starts

    let messageRes = '';

    try{
        if(!id_class) return res.status(404).json({status: 404, message: 'Id class not provided'});

        const classExist = await db.sequelize.query('SELECT name FROM CLASS WHERE id_class = :id_class', {
            replacements: {
                id_class: parseInt(id_class)
            },
            type: db.Sequelize.QueryTypes.SELECT,
            transaction
        });

        if(classExist.length == 0) {
            await transaction.rollback();
            return res.status(404).json({status: 404, message: 'Class does not exist'})
        }


        if (new_name) {
            const [_, affectedRows] = await db.sequelize.query(`UPDATE CLASS SET name = :name_class WHERE id_class = :id_class `, {
                replacements: {
                    name_class: new_name,
                    id_class: parseInt(id_class)
                },
                type: db.Sequelize.QueryTypes.UPDATE,
                transaction
            });

            if(affectedRows > 0){
                messageRes += 'Name changed. '
            } else {
                messageRes += 'Name notChanged because is the same value in db but you send it the value. '
            }
        }

        if (new_description) {
            const [_, affectedRows] = await db.sequelize.query(`UPDATE CLASS SET description = :description_class WHERE id_class = :id_class `, {
                replacements: {
                    description_class: new_description,
                    id_class: parseInt(id_class)
                },
                type: db.Sequelize.QueryTypes.UPDATE,
                transaction
            });


            if(affectedRows > 0){
                messageRes += 'Description changed. '
            } else {
                messageRes += 'Description notChanged because is the same value in db but you send it the value. '
            }
        }

        if (new_max_number_member) {
            const [_, affectedRows] = await db.sequelize.query(`UPDATE CLASS SET max_number_member = :max_number_member WHERE id_class = :id_class `, {
                replacements: {
                    max_number_member: parseInt(new_max_number_member),
                    id_class: parseInt(id_class)
                },
                type: db.Sequelize.QueryTypes.UPDATE,
                transaction
            });

            if(affectedRows > 0){
                messageRes += 'max_number_member changed. '
            } else {
                messageRes += 'max_number_member notChanged because is the same value in db but you send it the value. '
            }
        }

        if (new_photo) {
            const [_, affectedRows] = await db.sequelize.query(`UPDATE CLASS SET photo = :photo WHERE id_class = :id_class `, {
                replacements: {
                    photo: new_photo,
                    id_class: parseInt(id_class)
                },
                type: db.Sequelize.QueryTypes.UPDATE,
                transaction
            });

            if(affectedRows > 0){
                messageRes += 'photo changed. '
            } else {
                messageRes += 'photo notChanged because is the same value in db but you send it the value. '
            }
        }

        if (new_id_status) {
            const [_, affectedRows] = await db.sequelize.query(`UPDATE CLASS SET id_status = :id_status WHERE id_class = :id_class `, {
                replacements: {
                    id_status: parseInt(new_id_status),
                    id_class: parseInt(id_class)
                },
                type: db.Sequelize.QueryTypes.UPDATE,
                transaction
            });

            if(affectedRows > 0){
                messageRes += 'status changed. '
            } else {
                messageRes += 'status notChanged because is the same value in db but you send it the value. '
            }
        }
        
        if (new_date) {
            const [_, affectedRows] = await db.sequelize.query(`UPDATE CLASS SET date_class = :dateClass WHERE id_class = :id_class `, {
                replacements: {
                    dateClass: new_date,
                    id_class: parseInt(id_class)
                },
                type: db.Sequelize.QueryTypes.UPDATE,
                transaction
            });

            if(affectedRows > 0){
                messageRes += 'Date changed. '
            } else {
                messageRes += 'Date notChanged because is the same value in db but you send it the value. '
            }
        }


        if (new_time) {
            const [_, affectedRows] = await db.sequelize.query(`UPDATE CLASS SET time_class = :timeClass WHERE id_class = :id_class `, {
                replacements: {
                    timeClass: new_time,
                    id_class: parseInt(id_class)
                },
                type: db.Sequelize.QueryTypes.UPDATE,
                transaction
            });

            if(affectedRows > 0){
                messageRes += 'Time class changed. '
            } else {
                messageRes += 'Time class not changed notChanged because is the same value in db but you send it the value. '
            }
        }
        
        if(!Array.isArray(new_categories) && new_categories) {
            await transaction.rollback();
            console.error('Error uploadClass:: categories must be an array');
            return res.status(415).json({status: 415, message: 'Categories must be an array.'})
        }

        if (new_categories) {
            //Remember new_categories has to be an array, and you have to controll the send by the front.
            console.log('Class edited, uploading categories..');

            await db.sequelize.query('DELETE FROM CLASS_CATEGORY WHERE id_class = :id_class', {
                replacements: {
                    id_class: parseInt(id_class)
                },
                transaction
            });

            try {
                await Promise.all(
                    new_categories.map(async cat => {
                        try{
                            console.log('Inserting category ' + cat);
                            const categoryInserted = await db.sequelize.query('INSERT INTO CLASS_CATEGORY (id_category, id_class, createdAt, updatedAt) VALUES (:id_category, :id_class, NOW(), NOW() )', {
                            replacements: {
                                    id_category: parseInt(cat),
                                    id_class: parseInt(id_class)
                            },
                            transaction
                            });

                            console.log(categoryInserted);
                        } catch (err) {
                            throw new Error('Error uploading categories ' + err);
                        }
                    })
                );

                messageRes += 'Categories changed. '
            } catch (err) {
                await transaction.rollback();
                console.log('Rollback in the categories insert');
                console.error('Error uploadClass:: ' + err);
                return res.status(500).json({status: 500, message: 'Error inserting categories'});
            }
        }
        
        
       
        await transaction.commit(); // Made the upload in DB

        return res.status(200).json({status: 200, message: messageRes});
        

    } catch (err){
        await transaction.rollback();
        console.log('External transaction.rollback');
        console.log('Error uploadClass:: ' + err);
        return res.status(500).json({status: 500, message: 'Error uploading class ' + err});
    }
}

const getAllMembersClass = async (req, res) => {
    try{
        const { idClass } = req.query;

        if(!idClass) return res.status(404).json({status: 404, message: 'id_class not provided'});

        const result = await db.sequelize.query('SELECT cu.id_type_class_user, u.username, u.id_user, cu.id_status_class_user FROM CLASS_USER cu JOIN USER u ON cu.id_user = u.id_user WHERE cu.id_class = :id_class;', {
            replacements: {
                id_class: parseInt(idClass)
            },
            type: db.Sequelize.QueryTypes.SELECT
        });

        
        if(!result) return res.status(404).json({status: 404, message: 'No memebers found'});

        return res.status(200).json({status: 200, data: result});

    } catch(err){
        console.log('Something wrong happend getAllMembersClass:: ' + err);
        return res.status(500).json({status: 500, message: 'Something went wrong ' + err});
    }
}

const removeMemberClass = async (req, res) => {
    const transaction = await db.sequelize.transaction();

    try{
        const { idUser, idClass } = req.params;

        const result = await db.sequelize.query('DELETE FROM CLASS_USER WHERE id_user = :id_user AND id_class = :id_class', {
            replacements: {
                id_user: parseInt(idUser),
                id_class: parseInt(idClass)
            },
            type: db.Sequelize.QueryTypes.BULKDELETE, 
            transaction
        });

        if(!result || result == 0) {
            await transaction.rollback();
            console.log('Delete anything, going back...');
            return res.status(404).json({status: 404, message: 'Nothing to delete...'});
        }

        await transaction.commit();

        return res.status(200).json({status: 200, message: 'User removed'});
        
    } catch(err){
        console.error('Somethin went wrong removeMemberClass:: ' + err);
        return res.status(500).json({status: 500, message: 'Something went wrong ' + err});
    }
}

const petitionEnrollStudentClass = async (req, res) => {
    try{
        const { idUser, idClass } = req.body;

        if(!idUser || !idClass) return res.status(404).json({status: 404, message: 'Id user or id class not provided'});
        
        const [classAviable] = await db.sequelize.query('CALL VerifyClassDate(:idUser, :idClass)', {
            replacements: {
                idUser: parseInt(idUser),
                idClass: parseInt(idClass)
            }
        });


        if(!classAviable.classAviable) return res.status(406).json({status: 406, message: 'User already has a class in that time'});

        const [result] = await db.sequelize.query('CALL EnrollStudentClass(:idUser, :idClass)', {
            replacements: {
                idUser: parseInt(idUser),
                idClass: parseInt(idClass)
            }
        });

        if(!result) throw new Error('no response insert student');

        return res.status(200).json({status: 200, data: result});
    } catch (err){
        console.log('Something went wrong enrollStudentClass::  ' + err);
        return res.status(500).json({status: 500, message: err});
    }
}


const acceptEnrollStudentClass = async (req, res) => {
    try{
        const { idUser, idClass } = req.body;

        if(!idUser || !idClass) return res.status(404).json({status: 404, message: 'Entry values missing idUser or idClass'});

        const [result] = await db.sequelize.query('CALL AcceptEnrollStudent(:idUser, :idClass)', {
            replacements: {
                idUser: idUser,
                idClass: idClass
            }
        });

        if(!result) throw new Error('No response of AcceptEnrollStudent sp');

        return res.status(200).json({status: 200, data: result});
    } catch(err){
        console.log(err);
        return res.status(500).json({status: 500, message: err});
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
    insertTokenBlackList,
    getUserData,
    createStatusClass,
    createClass,
    resUploadCloudImg,
    getAllCategoryClass,
    getAllClasses,
    getTotalCountClasses,
    deleteClass,
    uploadClass,
    getAllStatusClass,
    getAllMembersClass,
    removeMemberClass,
    cancellClass,
    petitionEnrollStudentClass,
    acceptEnrollStudentClass
}