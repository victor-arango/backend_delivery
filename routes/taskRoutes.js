const tasksController = require('../controllers/tasksController');



module.exports = (app) =>{



/*
* Metodo Post
*/

app.post('/api/task/create',tasksController.create);


}