CREATE TYPE role_enum AS ENUM ('administrator', 'moderator', 'user');
CREATE TYPE instruction_enum AS ENUM ('warm_up','body','cool_down');
CREATE TYPE warm_up_cool_down_mode_enum AS ENUM ('custom','preset');

CREATE TABLE "users" (
  "user_id" uuid PRIMARY KEY,
  "username" varchar,
  "email" VARCHAR(50),
  "hash" varchar,
  "role" role_enum,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE "lessons" (
  "lesson_id" uuid PRIMARY KEY,
  "title" varchar,
  "sport" varchar,
  "objective" varchar,
  "warm_up" warm_up_cool_down_mode_enum,
  "cool_down" warm_up_cool_down_mode_enum,
  "warm_up_preset_title" varchar,
  "cool_down_preset_title" varchar,
  "created_at" timestamp DEFAULT CURRENT_TIMESTAMP,
  "user_id" uuid NOT NULL,
  "is_public" boolean DEFAULT FALSE,
  FOREIGN KEY (user_id) REFERENCES users(user_id)

);

CREATE TABLE "instructions" (
  "instruction_id" uuid PRIMARY KEY,
  "text" jsonb,
  "type" instruction_enum,
  "min" integer,
  "sec" integer,
  "order" integer NOT NULL,
  "lesson_id" uuid NOT NULL,
  FOREIGN KEY (lesson_id) REFERENCES lessons(lesson_id) ON DELETE CASCADE
);
