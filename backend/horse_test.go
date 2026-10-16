package main

import "testing"

func TestNormalize(t *testing.T) {
	in := horseInput{Name: "  Star ", Breed: "Arabian", Age: 5, Coat: "Grey", Location: "Here", Bio: "hi", Interests: []string{"Hay", " hay ", "", "Apples"}}
	if err := in.normalize(); err != nil {
		t.Fatal(err)
	}
	if in.Name != "Star" || in.Coat != "grey" {
		t.Fatalf("not trimmed: %+v", in)
	}
	if len(in.Interests) != 2 {
		t.Fatalf("interests not deduped: %v", in.Interests)
	}

	bad := in
	bad.Coat = "purple"
	if bad.normalize() == nil {
		t.Fatal("expected unknown coat to fail")
	}
	bad = in
	bad.Age = 0
	if bad.normalize() == nil {
		t.Fatal("expected age 0 to fail")
	}
}

func TestSeedHorsesValid(t *testing.T) {
	for _, h := range seedHorses {
		if err := h.normalize(); err != nil {
			t.Errorf("%s: %v", h.Name, err)
		}
	}
}

func TestLikesBack(t *testing.T) {
	yes, no := 0, 0
	for i := int64(1); i <= 40; i++ {
		if likesBack(7, i) != likesBack(7, i) {
			t.Fatal("not deterministic")
		}
		if likesBack(7, i) {
			yes++
		} else {
			no++
		}
	}
	if yes == 0 || no == 0 {
		t.Fatalf("expected a mix, got yes=%d no=%d", yes, no)
	}
}
