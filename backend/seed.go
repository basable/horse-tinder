package main

import (
	"context"
	"log"

	"github.com/jackc/pgx/v5/pgxpool"
)

var seedHorses = []horseInput{
	{"Clementine", "Haflinger", 7, "palomino", "Asheville, NC", "Golden mane, golden heart. Looking for someone to share a hay net and long trail rides with. Must tolerate my carrot obsession.", []string{"Trail rides", "Carrots", "Sunbathing"}},
	{"Duke", "Clydesdale", 11, "bay", "Lancaster, PA", "Gentle giant, 18 hands of pure romance. I pull carriages professionally, but I'd pull your heartstrings for free.", []string{"Carriage work", "Feathers", "Long naps"}},
	{"Juniper", "Arabian", 5, "grey", "Scottsdale, AZ", "Desert-born, dished face, opinions about everything. Swipe right if you can keep up at a gallop.", []string{"Endurance", "Sand rolls", "Drama"}},
	{"Biscuit", "Shetland Pony", 14, "chestnut", "Portland, OR", "Small but mighty. I have escaped every paddock I have ever lived in. Let's break out together.", []string{"Escapology", "Apples", "Kids' parties"}},
	{"Maverick", "Quarter Horse", 8, "buckskin", "Amarillo, TX", "Ranch hand by day, stargazer by night. Fastest quarter mile in the county and I won't let you forget it.", []string{"Barrel racing", "Cattle", "Sunsets"}},
	{"Odette", "Friesian", 9, "black", "Ocala, FL", "Classically trained in dressage, casually trained in stealing hats. Seeking an elegant partner for the passage of a lifetime.", []string{"Dressage", "Hat theft", "Classical music"}},
	{"Pepper", "Appaloosa", 6, "roan", "Missoula, MT", "Spotted in all the right places. I love mountain creeks and I'll always share the shade.", []string{"Creek crossings", "Mountain trails", "Mud"}},
	{"Sven", "Norwegian Fjord", 6, "dun", "Duluth, MN", "Two-tone mane, zero-tone worries. Snow is my love language.", []string{"Snow days", "Sleigh pulling", "Hay"}},
	{"Rosie", "Morgan", 10, "chestnut", "Burlington, VT", "Vermont girl with a maple-sugar sweet tooth. Looking for someone steady to share the fall foliage with.", []string{"Maple treats", "Leaf peeping", "Driving"}},
	{"Atlas", "Thoroughbred", 4, "bay", "Lexington, KY", "Retired from racing at four (long story). Now I'm learning to slow down and smell the clover.", []string{"Clover", "Second careers", "Zoomies"}},
	{"Willow", "Connemara", 12, "grey", "Half Moon Bay, CA", "Beach gallops at dawn, sea breeze in my forelock. Cross-country jumper ready to clear the next hurdle: love.", []string{"Beach gallops", "Jumping", "Seaweed"}},
	{"Hank", "Mustang", 9, "dun", "Reno, NV", "Born wild, raised by the high desert. I don't do fences, but for you I might try.", []string{"Freedom", "Sagebrush", "Night skies"}},
}

func seed(ctx context.Context, db *pgxpool.Pool) error {
	var n int
	if err := db.QueryRow(ctx, `SELECT count(*) FROM horses WHERE token_hash IS NULL`).Scan(&n); err != nil {
		return err
	}
	if n > 0 {
		return nil
	}
	tx, err := db.Begin(ctx)
	if err != nil {
		return err
	}
	defer func() { _ = tx.Rollback(ctx) }()
	for _, h := range seedHorses {
		if _, err := tx.Exec(ctx,
			`INSERT INTO horses (name, breed, age, coat, location, bio, interests) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
			h.Name, h.Breed, h.Age, h.Coat, h.Location, h.Bio, h.Interests); err != nil {
			return err
		}
	}
	if err := tx.Commit(ctx); err != nil {
		return err
	}
	log.Printf("seeded %d horses", len(seedHorses))
	return nil
}
