require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../models/index');
const secret = process.env.JWT_SECRET;

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

        res.status(200).send({ status: 200, message: result});
    }

    catch (err){
        console.error(err);
        res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
}


const statusVerifyToken = async(req, res) => {
    res.send({ status: 200, message: req.info});
}

const midleWareVerifyToken = async (req, res, next) => {
    try{
        const authToken = req.headers.authorization;

        if(!authToken || !authToken.startsWith('Bearer ')){
            return res.status(401).send({ status: 401, message: 'Authorization error'});
        }

        const token = authToken.split(' ')[1];

        const [resultSearchToken] = await db.sequelize.query('CALL SearchToken(:token);', 
                {
                    replacements: {
                        token: token
                    },
                    type: db.Sequelize.QueryTypes.RAW
                }
            );
    
        if(resultSearchToken.token_exist === 1){
            return res.status(401).send({ status: 401, message: "Invalid token"});
        }
    

        jwt.verify(token, secret, (err, decoded) => {
            if (err) return res.status(401).send({ status: 401, message: 'Unauthorizated'});

            req.info = decoded;
            next(); //This execute the next function on the routes.
        })
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
    
}

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

        user_created === 1 ? res.status(201).json({ status: 201, message: 'User created!'}) : res.status(409).json({ status: 409, message: 'User already exist!'});

        
    }
    
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
    

}

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

        bcrypt.compare(password, resPassword, (err, isMatch) => {
            if (err) throw err; 
            if(!isMatch) return res.status(401).json({status: 401, message: "Password incorrect"});  

            const objToken = { 
                id: resId,
                username: username 
            }

            const token = jwt.sign(objToken, secret, {
                expiresIn: 1800 // 30 min in seconds
            });
            
            res.status(200).cookie('objInfo', token, { //This look like encoded because the const objInfo is a special character to prevent errors, first thing objinfo is transformered to a string with json.stringify()
                    sameSite: 'strict', // if you declare it like none this in local wont work
                    secure: false,
                    path: '/',
                    expires: new Date(new Date().getTime() + 50000 * 1000),
                    httpOnly: true
                }
            )
            .json({
                status: 200,
                message: 'cookie being initialised'
            });
        });
    }    
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
}

const logoutUser = async (req, res) => {
    try{
        const authToken = req.headers.authorization;

        if(!authToken || !authToken.startsWith('Bearer ')){
            return res.status(401).send({status: 401, message: 'Authorization error'});
        }

        const token = authToken.split(' ')[1]; //This ensures we are only using the token  

        const result = await db.sequelize.query('CALL InsertToken(:token);', 
                {
                    replacements: {
                        token: token
                    },
                    type: db.Sequelize.QueryTypes.RAW
                }
            );
        
        const statusInsertedToken = result.token_inserted
        
        if(statusInsertedToken == 1) {
            res.status(200).clearCookie('objInfo', {
                path: '/', 
                sameSite: 'strict', 
                secure: false, 
                httpOnly: true 
              }).
              json({status: 200, message: "Logout successful, token inserted"})
        } 
        else{
            res.status(200).clearCookie('objInfo', {
                path: '/', 
                sameSite: 'strict', 
                secure: false, 
                httpOnly: true 
              }).
              json({status: 200, message: "Logout successful, token already exist in db"});
        } 
         
    }
    catch (err) {
        console.error(err);
        res.status(500).json({ status: 500, error: 'Something went wrong'})
    }
    
}

const cookieDetect = async (req, res) => {
    const cookie = req.cookies.objInfo;

    if(cookie){
        res.status(200).json({message: 'Cookie exist', value: cookie});
    } else {
        res.status(404).json({message: 'Cookie dont exist'});
    }
}

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    midleWareVerifyToken,
    createTypeUser,
    statusVerifyToken,
    cookieDetect
}