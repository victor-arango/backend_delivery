const db = require('../config/config');

const Task = {};

Task.create = (task) => {
  const sql = `
    INSERT INTO
      tasks(
        user_id,
        delivery_id,
          descripcion,
        status,
        priority,
        timestamp,
        created_at,
        updated_at
      )
    VALUES($1, $2, $3, $4, $5, $6, $7,$8)  RETURNING id, user_id, delivery_id, descripcion, status, priority, timestamp

  `;

  return db.oneOrNone(sql, [
    task.user_id,
    task.delivery_id,
    task.descripcion,
    task.status,
    task.priority,
    task.timestamp,
    new Date(),
    new Date()
  ]);
};



Task.findByClientAndStatus = (user_id, status) =>{
    const sql = `      
    SELECT 
    t.id,
    t.user_id,
    t.delivery_id,
    t.descripcion,
    t.status,
    t.timestamp,
    t.priority,
    (
        SELECT JSON_BUILD_OBJECT(
            'task_id', R.task_id,
            'delivery_id', R.delivery_id,
            'rating', R.rating
        )
        FROM task_ratings AS R
        WHERE R.task_id = t.id
        LIMIT 1
    ) AS ratings
FROM 
    tasks AS t
INNER JOIN 
    users AS u 
ON
    t.user_id = u.id
LEFT JOIN
    users AS d
ON 
    t.delivery_id = d.id
WHERE
    t.user_id = $1
    AND t.status = $2;

    `;

    return db.manyOrNone(sql,[user_id,status]);
},



Task.findTaskById = (id) =>{
  const sql = `
  SELECT 
  t.id,
  t.user_id,
  t.delivery_id,
  t.descripcion,
  t.status,
  t.timestamp,
  t.priority,
  JSON_BUILD_OBJECT(
      'task_id', R.task_id,
      'delivery_id', R.delivery_id,
      'rating', R.rating
  ) AS ratings
FROM 
  tasks AS t
INNER JOIN 
  users AS u 
  ON t.user_id = u.id
LEFT JOIN
  users AS d
  ON t.delivery_id = d.id
LEFT JOIN
  task_ratings AS R
  ON t.id = R.task_id
WHERE
  t.id = $1;

  `;
  return db.oneOrNone(sql,[id]);

}


Task.update = (task) => {
  const sql = `
      UPDATE
          tasks
      SET 
          descripcion=$2,
          timestamp=$3,
          delivery_id=$4,
          priority=$5,
          updated_at=$6
      WHERE 
          id=$1
          RETURNING id, user_id, delivery_id, descripcion, status, priority, timestamp
  `;

  return db.oneOrNone(sql, [
      task.id,
      task.descripcion,
      task.timestamp,
      task.delivery_id,
      task.priority,
      new Date(),
  ]);
};


Task.updateFinish = (id, status) => {
  const sql = `
    UPDATE tasks
    SET status = $2
    WHERE id = $1
    RETURNING id, user_id, delivery_id, descripcion, status, priority, timestamp
  `;

  return db.oneOrNone(sql, [id, status]);
};




Task.findRatingTaskById = (id) => {
  const sql = `
    SELECT 
        R.task_id,
        R.delivery_id,
        R.rating,
        R.created_at,
        R.updated_at
    FROM 
        tasks AS t
    LEFT JOIN 
        task_ratings AS R ON t.id = R.task_id
    WHERE 
        t.id = $1;
  `;
  return db.oneOrNone(sql, [id]);
};


Task.findTaskByDeliveryIdAndStatus = (id,status) =>{
  const sql = `
  SELECT 
  id,
  user_id,
  delivery_id,
  descripcion,
  status,
  timestamp,
  priority
FROM 
  tasks
  WHERE
    delivery_id = $1 AND status = $2
  ORDER BY
    CASE priority
      WHEN 'Alta' THEN 1
      WHEN 'Media' THEN 2
      WHEN 'Baja' THEN 3
      ELSE 4
    END;

`;

  return db.many(sql,[id,status]);

}


module.exports = Task;