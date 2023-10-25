const usersController = require('../controllers/usersController');
// const passport = require('passport');


module.exports=(app,upload) =>{


    //Llama los datos de la BD
    app.post('/api/auth/login', usersController.login);
    app.post('/api/auth/register', usersController.register);
    app.get('/api/auth/check-status', usersController.checkAuthStatus);
    app.get('/api/auth/findByDeliveryMen',usersController.findByDeliveryMen);
    


}