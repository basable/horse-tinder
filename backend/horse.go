package main

import (
	"errors"
	"strings"
	"unicode/utf8"

	"github.com/jackc/pgx/v5"
)

// Horse is a public profile.
type Horse struct {
	ID        int64    `json:"id"`
	Name      string   `json:"name"`
	Breed     string   `json:"breed"`
	Age       int      `json:"age"`
	Coat      string   `json:"coat"`
	Location  string   `json:"location"`
	Bio       string   `json:"bio"`
	Interests []string `json:"interests"`
}

type horseInput struct {
	Name      string   `json:"name"`
	Breed     string   `json:"breed"`
	Age       int      `json:"age"`
	Coat      string   `json:"coat"`
	Location  string   `json:"location"`
	Bio       string   `json:"bio"`
	Interests []string `json:"interests"`
}

var coats = map[string]bool{
	"bay": true, "chestnut": true, "black": true, "grey": true,
	"palomino": true, "buckskin": true, "dun": true, "roan": true,
}

const horseCols = `id, name, breed, age, coat, location, bio, interests`

func runes(s string) int { return utf8.RuneCountInString(s) }

func (in *horseInput) normalize() error {
	in.Name = strings.TrimSpace(in.Name)
	in.Breed = strings.TrimSpace(in.Breed)
	in.Coat = strings.ToLower(strings.TrimSpace(in.Coat))
	in.Location = strings.TrimSpace(in.Location)
	in.Bio = strings.TrimSpace(in.Bio)

	switch {
	case in.Name == "" || runes(in.Name) > 40:
		return errors.New("name must be 1-40 characters")
	case in.Breed == "" || runes(in.Breed) > 40:
		return errors.New("breed must be 1-40 characters")
	case in.Age < 1 || in.Age > 40:
		return errors.New("age must be between 1 and 40")
	case !coats[in.Coat]:
		return errors.New("unknown coat color")
	case in.Location == "" || runes(in.Location) > 60:
		return errors.New("location must be 1-60 characters")
	case runes(in.Bio) > 280:
		return errors.New("bio must be at most 280 characters")
	}

	seen := map[string]bool{}
	out := make([]string, 0, len(in.Interests))
	for _, it := range in.Interests {
		it = strings.TrimSpace(it)
		if it == "" {
			continue
		}
		if runes(it) > 24 {
			return errors.New("each interest must be at most 24 characters")
		}
		key := strings.ToLower(it)
		if seen[key] {
			continue
		}
		seen[key] = true
		out = append(out, it)
	}
	if len(out) > 6 {
		return errors.New("at most 6 interests")
	}
	in.Interests = out
	return nil
}

func scanHorse(row pgx.Row) (Horse, error) {
	var h Horse
	err := row.Scan(&h.ID, &h.Name, &h.Breed, &h.Age, &h.Coat, &h.Location, &h.Bio, &h.Interests)
	if h.Interests == nil {
		h.Interests = []string{}
	}
	return h, err
}
