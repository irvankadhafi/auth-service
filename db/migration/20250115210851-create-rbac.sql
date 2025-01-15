-- +migrate Up
CREATE TYPE user_role AS ENUM ('ADMIN', 'MANAGER', 'EMPLOYEE');
CREATE TYPE resource_type AS ENUM ('user', 'employee', 'attendance', 'session', 'report');
CREATE TYPE action_type AS ENUM ('create', 'read', 'update', 'delete', 'approve', 'reject', 'submit');

CREATE TABLE IF NOT EXISTS "resources" (
    "id" resource_type PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS "actions" (
    "id" action_type PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS "role_resource_actions" (
    "role" user_role NOT NULL,
    "resource" resource_type NOT NULL REFERENCES "resources"("id"),
    "action" action_type NOT NULL REFERENCES "actions"("id"),
    PRIMARY KEY ("role", "resource", "action")
);

-- +migrate Down
DROP TABLE IF EXISTS "role_resource_actions";
DROP TABLE IF EXISTS "actions";
DROP TABLE IF EXISTS "resources";
DROP TYPE IF EXISTS action_type;
DROP TYPE IF EXISTS resource_type;
DROP TYPE IF EXISTS user_role;