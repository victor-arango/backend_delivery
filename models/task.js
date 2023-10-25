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

module.exports = Task;