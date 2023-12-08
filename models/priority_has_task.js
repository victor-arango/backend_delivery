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
        VALUES($1,$2,$3,$4,$5) RETURNING task_id, delivery_id, rating;
    `;

    return db.oneOrNone(sql,[
        
        task_id,
        delivery_id,
        rating,
        new Date(),
        new Date()
    ])
}


PriorityHasTask.updateRating = (task_id, rating) => {
    const sql = `
     
    UPDATE task_ratings
    SET rating = $2,
      updated_at = $3
    WHERE task_id = 48
    RETURNING task_id, delivery_id, rating;
    `;
  
    return db.oneOrNone(sql, [task_id, rating, new Date()]);
  };

module.exports = PriorityHasTask;