const { getAll, create } = require('../models/user');
const User = require('../models/user');
const Rol = require('../models/rol');
const jwt = require('jsonwebtoken');
const keys = require('../config/keys');
// const verifyToken = require('../middleware/authenticate');
// const { use } = require('passport');

module.exports = {

    async getAll(req,res,next){
        try{
            const data = await User.getAll();
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los usuarios'
            });
        }
    },




    async register(req,res,next){
        try{
           
            const user = req.body;
            const data = await User.create(user);

            await Rol.create(data.id, 2) //Rol por defecto Cliente 

            return res.status(201).json({
                success:true,
                message:'El registro se realizo correctamente',
                data:data.id

            })
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al registrar el usuario',
                error:error
            })
        }
    },
    async login(req,res,next){
        try {
            
            const email = req.body.email;
            const password = req.body.password
            const myUser = await User.findByEmail(email);
            if(!myUser){
                return res.status(401).json({
                    success:false,
                    message:'El usuario o contrasela es incorrecta'
                });
            }

            if(User.isPasswordMatched(password, myUser.password)){
                const token = jwt.sign({id:myUser.id,email:myUser.email}, keys.secretOrKey,{
                    expiresIn: (60*60*24) //el token expira cada Hora
                    // expiresIn: (60*1) //el token expira cada minuto
                });
                const data = {
                    id: myUser.id,
                    fullname:myUser.fullname,
                    email:myUser.email,
                    session_token:token,
                    roles:myUser.roles
                }
                await User.updateToken(myUser.id, token);

               
                return res.status(201).json({
                    success: true,
                    data:data,
                    message:'El usuario se autentico correctamente',
                    
                })

               
            }
            else{
                return res.status(401).json({
                    success:false,
                    message:'El usuario o contrasela es incorrecta',
                   

                })
            }
            
        } catch (error) {
            console.log(`Error:  ${error}`);
            return res.status(501).json({
                success: false,
                message:'Error al realizar login',
                error: error
            })
        }
    },



    // Función para verificar el token Bearer y devolver el usuario con un nuevo token
    async checkAuthStatus(req, res) {
        const authHeader = req.headers["authorization"];

        const token = authHeader;

        console.log(token);
        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Token no proporcionado en la solicitud',
            });

            
        }
    
        const user = verifyToken(token);
    
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Token inválido o sesión expirada',
            });
        }
    
        const myUser = await User.findByEmail(user.email);
        if (!myUser) {
            return res.status(401).json({
                success: false,
                message: 'El usuario no fue encontrado en la base de datos',
            });
        }
    
        const response = {
            success: true,
            data: {
                id: user.id,
                fullname: myUser.fullname,
                email: user.email,
                session_token: getJwtToken({ id: user.id, email: user.email }),
                roles: myUser.roles,
            },
            message: 'Token válido',
        };
    
        res.status(201).json(response);
    },
    async findByDeliveryMen(req,res,next){
        try{

            const id = req.params.id;

            const data = await User.findByDeliveryMen();
            return res.status(201).json(data);
        }
        catch(error){
            console.log(`Error: ${error}`);
            return res.status(501).json({
                success: false,
                message: 'Error al obtener los repartidores'
            });
        }
    },

}
    

// Middleware para verificar el token Bearer
function authenticateToken(req, res, next) {
    const token = req.headers['authorization'];
  
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Token no proporcionado en la solicitud',
      });
    }
  
    const user = verifyToken(token);
  
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Token inválido o sesión expirada',
      });
    }
  
    req.user = user;
    next();
  }
  
  // Función para firmar un nuevo token JWT
  function getJwtToken(payload) {
    const token = jwt.sign(payload, keys.secretOrKey); // Usar keys.secretOrKey
    return token;
  }


  function verifyToken(authorizationHeader) {
    if (typeof authorizationHeader !== 'undefined') {
      const bearerToken = authorizationHeader.split(' ')[1];
      console.log(`BEARER TOKENT  ${bearerToken}`);
      try {
        const decoded = jwt.verify(bearerToken, keys.secretOrKey); // Ajusta la clave según tu configuración
        console.log(`DECODED ${decoded}` );
        return decoded;
      } catch (err) {
        return null;
      }
    } else {
      return null;
    }
  }
  