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
                    message:'No se puedieron cargar las tareas',
                    error: error,
                    success: false
                })
    
            }
        },



        async findByClientAndStatus(req, res, next) {
            try {
                const user_id = req.params.user_id;
                const status = req.params.status;
                const data = await Task.findByClientAndStatus(user_id, status);
                console.log(data);
                return res.status(201).json(data);
            } catch(error) {
                console.log(`Error ${error}`);
                return res.status(501).json({
                    message:'No se pudieron cargar las tareas',
                    error: error,
                    success: false
                });
            }
        },
        async findTaskById(req, res, next) {
            try {
                const id = req.params.id;
                const data = await Task.findTaskById(id);
        
                if (!data) {
                    return res.status(404).json({
                        message: 'No se encontró la tarea',
                        error: 'No encontrado',
                        success: false
                    });
                }
        
                return res.status(201).json(data);
            } catch (error) {
                console.log(`Error ${error}`);
                return res.status(501).json({
                    message: 'Error en el servidor',
                    error: error,
                    success: false
                });
            }
        },

        async updateTask(req, res, next) {
            try {
                let task = req.body;
        
        
                const updatedTask = await Task.update(task);
        
                return res.status(201).json({
                    message: 'La tarea se actualizó correctamente',
                    success: true,
                    data: updatedTask,
                });
        
            } catch (error) {
                console.log(`Error ${error}`);
                return res.status(501).json({
                    message: 'Se produjo un error al actualizar la orden',
                    error: error,
                    success: false
                });
            }
        }
        
        
        
}