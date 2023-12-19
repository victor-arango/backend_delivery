const db = require('../config/config');
const crypto = require('crypto');

const User = {};

//Obtiene todos los usuarios 

User.getAll = () =>{
    const sql = `SELECT * FROM users`;
    return db.manyOrNone(sql);
}


//Crea un nuevo usuario
User.create = (user) =>{

    const myPasswordHashed = crypto.createHash('md5').update(user.password).digest('hex');
    user.password = myPasswordHashed;
    const sql = `
        INSERT INTO 
            users(
                email,
                fullname,
                password,
                created_at,
                update_at
            )
        VALUEs($1,$2,$3,$4,$5) RETURNING id
    `;

    return db.oneOrNone(sql, [
        user.email,
        user.fullname,
        user.password,
        new Date(),
        new Date()
    ]);
}


User.findById = (id, callback) => {
    const sql = `SELECT
        id,
        fullname,
        email,
        password,
        session_token
    FROM
        users
    WHERE
        id = $1
    `;

 return db.oneOrNone(sql, id).then(user => {callback(null, user);})
}

//Consulta el correo 

User.findByEmail = (email) =>{
    const sql =`SELECT 
    u.id,
    u.email,
    u.fullname,
    u.is_available,
    u.password,
    array_agg(R.name) AS "roles",
    u.session_token
FROM
    users AS u
LEFT JOIN
    user_has_roles AS uhr
ON
    uhr.id_user = u.id
LEFT JOIN
    roles AS R
ON
    R.id = uhr.id_rol
WHERE u.email = $1
GROUP BY 
    u.id
`;
    return db.oneOrNone(sql, email);
}

User.findByDeliveryMen= () =>{
    const sql =`
    SELECT 
    u.id,
    u.email,
    u.fullname
FROM 
    users as u
INNER JOIN 
    user_has_roles AS UHR
ON
    UHR.id_user = u.id
INNER JOIN 
    roles AS R
ON
    R.id = UHR.id_rol
WHERE
    R.id = 3
 `;
    return db.manyOrNone(sql);
}

//Actualiza el toekent en base de datos 

User.updateToken = (id,token) =>{
    const sql = `
    UPDATE 
        users
    SET
        session_token = $2
       
    WHERE
        id = $1
    `; 


    return db.none(sql, [
       id,
       token
        
    ])
}


User.isPasswordMatched = (userPassword, hash) =>{
    const myPasswordHashed = crypto.createHash('md5').update(userPassword).digest('hex');
    if(myPasswordHashed === hash){
        return true;
    }
    return false;
}
module.exports = User;

