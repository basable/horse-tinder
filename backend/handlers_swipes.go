package main

import (
	"errors"
	"net/http"
	"time"

	"github.com/jackc/pgx/v5"
)

type swipeInput struct {
	TargetID int64 `json:"targetId"`
	Liked    bool  `json:"liked"`
}

type match struct {
	Horse
	MatchedAt time.Time `json:"matchedAt"`
}

// likesBack decides whether a seeded horse returns a like (about 75%).
func likesBack(swiper, target int64) bool {
	return (swiper*31+target)%4 != 0
}

func (s *server) swipe(w http.ResponseWriter, r *http.Request, me int64) {
	var in swipeInput
	if err := decodeJSON(w, r, &in); err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	if in.TargetID <= 0 || in.TargetID == me {
		writeError(w, http.StatusBadRequest, "invalid target")
		return
	}
	ctx := r.Context()
	tx, err := s.db.Begin(ctx)
	if err != nil {
		internalError(w, err)
		return
	}
	defer func() { _ = tx.Rollback(ctx) }()

	var seeded bool
	err = tx.QueryRow(ctx, `SELECT token_hash IS NULL FROM horses WHERE id = $1`, in.TargetID).Scan(&seeded)
	if errors.Is(err, pgx.ErrNoRows) {
		writeError(w, http.StatusNotFound, "that horse has left the stable")
		return
	}
	if err != nil {
		internalError(w, err)
		return
	}
	if _, err = tx.Exec(ctx,
		`INSERT INTO swipes (swiper_id, target_id, liked) VALUES ($1, $2, $3)
		 ON CONFLICT (swiper_id, target_id) DO UPDATE SET liked = EXCLUDED.liked, created_at = now()`,
		me, in.TargetID, in.Liked); err != nil {
		internalError(w, err)
		return
	}
	if in.Liked && seeded && likesBack(me, in.TargetID) {
		if _, err = tx.Exec(ctx,
			`INSERT INTO swipes (swiper_id, target_id, liked) VALUES ($1, $2, true) ON CONFLICT DO NOTHING`,
			in.TargetID, me); err != nil {
			internalError(w, err)
			return
		}
	}

	resp := map[string]any{"match": false}
	if in.Liked {
		var matched bool
		if err = tx.QueryRow(ctx,
			`SELECT EXISTS (SELECT 1 FROM swipes WHERE swiper_id = $1 AND target_id = $2 AND liked)`,
			in.TargetID, me).Scan(&matched); err != nil {
			internalError(w, err)
			return
		}
		if matched {
			h, err := scanHorse(tx.QueryRow(ctx, `SELECT `+horseCols+` FROM horses WHERE id = $1`, in.TargetID))
			if err != nil {
				internalError(w, err)
				return
			}
			resp = map[string]any{"match": true, "horse": h}
		}
	}
	if err := tx.Commit(ctx); err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, resp)
}

func (s *server) matches(w http.ResponseWriter, r *http.Request, me int64) {
	rows, err := s.db.Query(r.Context(), `
		SELECT h.id, h.name, h.breed, h.age, h.coat, h.location, h.bio, h.interests,
		       GREATEST(a.created_at, b.created_at) AS matched_at
		FROM swipes a
		JOIN swipes b ON b.swiper_id = a.target_id AND b.target_id = a.swiper_id AND b.liked
		JOIN horses h ON h.id = a.target_id
		WHERE a.swiper_id = $1 AND a.liked
		ORDER BY matched_at DESC`, me)
	if err != nil {
		internalError(w, err)
		return
	}
	defer rows.Close()
	out := []match{}
	for rows.Next() {
		var m match
		if err := rows.Scan(&m.ID, &m.Name, &m.Breed, &m.Age, &m.Coat, &m.Location, &m.Bio, &m.Interests, &m.MatchedAt); err != nil {
			internalError(w, err)
			return
		}
		if m.Interests == nil {
			m.Interests = []string{}
		}
		out = append(out, m)
	}
	if err := rows.Err(); err != nil {
		internalError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, out)
}
