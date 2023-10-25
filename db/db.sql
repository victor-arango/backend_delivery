DROP TABLE IF EXISTS roles CASCADE;


CREATE TABLE roles(
	id BIGSERIAL PRIMARY KEY,
	name VARCHAR (180) NOT NULL UNIQUE,
	created_at TIMESTAMP(0) NOT NULL,
	update_at TIMESTAMP(0) NOT NULL
);


DROP TABLE IF EXISTS areas CASCADE;
CREATE TABLE areas (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL UNIQUE
);



DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users(
	id BIGSERIAL PRIMARY KEY,
	email VARCHAR(255) NOT NULL UNIQUE,
	fullname VARCHAR(255) NOT NULL,
	password VARCHAR(255) NOT NULL,
	is_available BOOLEAN NULL,
	session_token VARCHAR(255) NULL,
	created_at TIMESTAMP(0) NOT NULL,
	update_at TIMESTAMP(0) NOT NULL,
	area_id INT REFERENCES areas(id)
	
);



DROP TABLE IF EXISTS user_has_roles CASCADE;

CREATE TABLE user_has_roles(
	id_user BIGSERIAL NOT NULL,
	id_rol	BIGSERIAL NOT NULL,
	created_at TIMESTAMP(0) NOT NULL,
	update_at TIMESTAMP(0) NOT NULL,
	FOREIGN KEY(id_user)  REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
	FOREIGN KEY(id_rol)  REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
	 PRIMARY KEY(id_user, id_rol)
);

DROP TABLE IF EXISTS tasks CASCADE;
CREATE TABLE tasks (
  id BIGSERIAL PRIMARY KEY,
  user_id BIGINT NOT NULL,
  delivery_id BIGINT NOT NULL,
  descripcion TEXT NOT NULL,
  status VARCHAR(90) NOT NULL,
  priority VARCHAR(50) NOT NULL, 
  timestamp VARCHAR(60) NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
);

DROP TABLE IF EXISTS task_ratings CASCADE;

CREATE TABLE task_ratings (
  id BIGSERIAL PRIMARY KEY,
  task_id BIGINT NOT NULL,
  delivery_id BIGINT NOT NULL, 
  rating INT NOT NULL,
  created_at TIMESTAMP(0) NOT NULL,
  updated_at TIMESTAMP(0) NOT NULL,
  FOREIGN KEY (task_id) REFERENCES tasks (id) ON UPDATE CASCADE ON DELETE CASCADE,
  FOREIGN KEY (delivery_id) REFERENCES users (id) ON UPDATE CASCADE ON DELETE CASCADE
);




-- SELECT 
--     t.id,
--     t.user_id,
--     t.delivery_id,
--     t.descripcion,
--     t.status,
--     t.timestamp,
--     t.priority,
--     JSON_AGG(
--         JSON_BUILD_OBJECT(
--             'task_id', R.task_id,
--             'delivery_id', R.delivery_id,
--             'rating', R.rating
--         )
--     ) AS ratings
-- FROM 
--     tasks AS t
-- INNER JOIN 
--     users AS u 
-- ON
--     t.user_id = u.id
-- LEFT JOIN
--     users AS d
-- ON 
--     t.delivery_id = d.id
-- LEFT JOIN 
--     task_ratings AS r
-- ON
--     r.task_id = t.id
-- WHERE
--     t.user_id = 9
--     AND t.status = 'ASIGNADO'
-- GROUP BY 	
--     t.id, t.user_id, t.delivery_id, t.descripcion, t.status, t.timestamp, t.priority;
