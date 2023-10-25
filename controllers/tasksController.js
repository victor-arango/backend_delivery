const Task = require('../models/task');
const PriorityHasTask = require('../models/priority_has_task');




module.exports = {


        async create(req, res, next){

            try {

                let task = req.body;
                task.status = 'ASIGNADO';

                console.log(task);
                const data = await Task.create(task);

                const rating = 0;

                await PriorityHasTask.create(data.id, data.delivery_id, rating);


                return res.status(201).json({
                    message:'se creo correctamente la tarea',
                    succes: true,
                    data: data
                })



            }catch(error){
                console.log(`Error ${error}`);
                return res.status(501).json({
                    message:'No se puedieron cargar las ordenes',
                    error: error,
                    success: false
                })
    
            }
        }
}