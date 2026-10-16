package main

import (
	"context"

	"github.com/jackc/pgx/v5/pgxpool"
)

const schema = `
CREATE TABLE IF NOT EXISTS horses (
  id          BIGSERIAL PRIMARY KEY,
  name        TEXT NOT NULL,
  breed       TEXT NOT NULL,
  age         INT NOT NULL,
  coat        TEXT NOT NULL,
  location    TEXT NOT NULL,
  bio         TEXT NOT NULL DEFAULT '',
  interests   TEXT[] NOT NULL DEFAULT '{}',
  token_hash  TEXT UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS swipes (
  swiper_id  BIGINT NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
  target_id  BIGINT NOT NULL REFERENCES horses(id) ON DELETE CASCADE,
  liked      BOOLEAN NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (swiper_id, target_id)
);

CREATE INDEX IF NOT EXISTS swipes_target_idx ON swipes (target_id, swiper_id);
`

func migrate(ctx context.Context, db *pgxpool.Pool) error {
	_, err := db.Exec(ctx, schema)
	return err
}
