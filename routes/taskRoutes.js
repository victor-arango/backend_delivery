const tasksController = require('../controllers/tasksController');



module.exports = (app) =>{



/*
* Metodo Post
*/

app.post('/api/task/create',tasksController.create);




/*
*Metodo GET
*/

app.get('/api/task/findByClientAndStatus/:user_id/:status',tasksController.findByClientAndStatus);
app.get('/api/task/findTaskById/:id',tasksController.findTaskById);
app.get('/api/task/findByDeliveryAndStatus/:user_id/:status',tasksController.findByDeliveryAndStatus);



/*
*Metodo PUT
*/


app.patch('/api/task/:id', tasksController.updateTask);
app.patch('/api/task/updateTaskByIdAndStatus/:id/:rating',tasksController.updateTaskAndRating);
app.patch('/api/task/updateFinishTaskById/:id',tasksController.updateTaskDelivery);
}


