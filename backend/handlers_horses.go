package main

import (
	"errors"
	"net/http"

	"github.com/jackc/pgx/v5"
)

func (s *server) createHorse(w http.ResponseWriter, r *http.Request) {
	var in horseInput
	if err := decodeJSON(w, r, &in); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if err := in.normalize(); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	token, hash, err := newToken()
	if err != nil {
		internalError(w, err)
		return
	}
	h, err := scanHorse(s.db.QueryRow(r.Context(),
		`INSERT INTO horses (name, breed, age, coat, location, bio, interests, token_hash)
		 VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING `+horseCols,
		in.Name, in.Breed, in.Age, in.Coat, in.Location, in.Bio, in.Interests, hash))
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, map[string]any{"token": token, "horse": h})
}

func (s *server) me(w http.ResponseWriter, r *http.Request, me int64) {
	h, err := scanHorse(s.db.QueryRow(r.Context(), `SELECT `+horseCols+` FROM horses WHERE id = $1`, me))
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(w, http.StatusUnauthorized, "profile not found")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, h)
}

func (s *server) feed(w http.ResponseWriter, r *http.Request, me int64) {
	rows, err := s.db.Query(r.Context(),
		`SELECT `+horseCols+` FROM horses h
		 WHERE h.id <> $1
		   AND NOT EXISTS (SELECT 1 FROM swipes s WHERE s.swiper_id = $1 AND s.target_id = h.id)
		 ORDER BY h.created_at DESC, h.id DESC
		 LIMIT 20`, me)
	if err != nil {
		internalError(w, err)
		return
	}
	defer rows.Close()
	out := []Horse{}
	for rows.Next() {
		h, err := scanHorse(rows)
		if err != nil {
			internalError(w, err)
			return
		}
		out = append(out, h)
	}
	if err := rows.Err(); err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}
