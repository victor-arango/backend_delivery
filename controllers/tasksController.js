const Task = require('../models/task');
const PriorityHasTask = require('../models/priority_has_task');
const { json } = require('express');




module.exports = {


    async create(req, res, next) {
        try {
          const task = req.body;
          
          // Establece el estado de la tarea en 'ASIGNADO'
          task.status = 'ASIGNADO';
          
          // Crea la tarea en la base de datos
          const createdTask = await Task.create(task);
          
          const task_id = parseInt(createdTask.id); 
          const delivery_id = parseInt(createdTask.delivery_id);
      
          // Crea la prioridad para la tarea
          const rating = 0;
          const ratings = await PriorityHasTask.create(task_id,delivery_id, rating);
      
          // Construye la respuesta a enviar al cliente
          const responseData = {
            data: {
              ...createdTask, 
              ratings: ratings,
            },
          };
      
          console.log(responseData);
      
          // Envía la respuesta al cliente
          return res.status(201).json({
            message: 'Se creó correctamente la tarea',
            success: true,
            data: responseData.data,
          });
        } catch (error) {
          console.error(`Error: ${error.message}`);
          return res.status(500).json({
            message: 'No se pudieron cargar las tareas',
            error: error.message,
            success: false,
          });
        }
      },
      
      


        async findByClientAndStatus(req, res, next) {
            try {
                const user_id = req.params.user_id;
                const status = req.params.status;
                const data = await Task.findByClientAndStatus(user_id, status);
                const idTask = data.task_id; 
                const rating = await Task.findRatingTaskById(idTask);



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
              let task = { ...req.body };
          
              // Obtén el ID de los parámetros de la URL
              const taskId = req.params.id;
              task.id = taskId;
          
              // Actualiza la tarea utilizando el ID de la URL
              const updatedTask = await Task.update(task);
          
              // Utiliza el ID de la URL para buscar el rating
              const rating = await Task.findRatingTaskById(taskId);
          
              // Combina la información de updatedTask y rating en un solo objeto
              const responseData = {
                ...updatedTask,
                ratings: {
                  task_id: rating.task_id,
                  delivery_id: rating.delivery_id,
                  rating: rating.rating,
                },
              };
          
              console.log(JSON.stringify(responseData));
          
              return res.status(201).json({
                message: 'La tarea se actualizó correctamente',
                success: true,
                data: responseData,
              });
            } catch (error) {
              console.error(`Error en updateTask: ${error}`);
              return res.status(501).json({
                message: 'Se produjo un error al actualizar la orden',
                error: error,
                success: false,
              });
            }
          },


          async updateTaskAndRating(req, res, next) {
            try {
              let task = { ...req.body };
          
              // Obtén el ID de los parámetros de la URL
              const taskId = req.params.id;
              const valueRating = parseInt(req.params.rating, 10); // Convierte el valor a un entero
              const status = 'CERRADO';
          
              // Actualiza la tarea utilizando el ID de la URL
              const updatedTask = await Task.updateFinish(taskId, status);
          
              const rating = await PriorityHasTask.updateRating(taskId, valueRating);
          
              // Crear el objeto de respuesta con el formato deseado
              const responseData = {
                id: updatedTask.id,
                user_id: updatedTask.user_id,
                delivery_id: updatedTask.delivery_id,
                descripcion: updatedTask.descripcion,
                status: updatedTask.status,
                timestamp: updatedTask.timestamp,
                priority: updatedTask.priority,
                ratings: {
                  task_id: taskId,
                  delivery_id: updatedTask.delivery_id,
                  rating: valueRating,
                },
              };
          
              console.log(JSON.stringify(responseData));
          
              return res.status(201).json({
                message: 'Tarea Finalizada',
                success: true,
                data: responseData,
              });
            } catch (error) {
              console.error(`Error en updateTask: ${error}`);
              return res.status(501).json({
                message: 'Se produjo un error al finalizar la tarea',
                error: error.message, // Devolver solo el mensaje de error
                success: false,
              });
            }
          }
          
          
          
          
        
        
}