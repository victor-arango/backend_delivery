const db = require('../config/config');

const PriorityHasTask ={};





PriorityHasTask.create = (task_id,delivery_id, rating)=>{
    const sql = `
        INSERT INTO
        task_ratings(
                task_id,
                delivery_id,
                rating,
                created_at,
                updated_at
            )
        VALUES($1,$2,$3,$4,$5) 
    `;

    return db.none(sql,[
        
        task_id,
        delivery_id,
        rating,
        new Date(),
        new Date()
    ])
}


module.exports = PriorityHasTask;