const tasksController = require('../controllers/tasksController');
const authenticateToken = require('../middleware/authenticate');



module.exports = (app) =>{



/*
* Metodo Post
*/

app.post('/api/task/create',tasksController.create);




/*
*Metodo GET
*/

app.get('/api/task/findByClientAndStatus/:user_id/:status',authenticateToken,tasksController.findByClientAndStatus);
app.get('/api/task/findTaskById/:id',authenticateToken,tasksController.findTaskById);
app.get('/api/task/findByDeliveryAndStatus/:user_id/:status',authenticateToken,tasksController.findByDeliveryAndStatus);



/*
*Metodo PUT
*/


app.patch('/api/task/:id',authenticateToken, tasksController.updateTask);
app.patch('/api/task/updateTaskByIdAndStatus/:id/:rating',authenticateToken,tasksController.updateTaskAndRating);
app.patch('/api/task/updateFinishTaskById/:id',authenticateToken,tasksController.updateTaskDelivery);
}


