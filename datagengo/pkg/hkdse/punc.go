package hkdse

var punctuations = map[rune]struct{}{
	',': {},
	'.': {},
	'，': {},
	'！': {},
	'。': {},
}

func IsPunctuation(c rune) bool {
	_, ok := punctuations[c]
	return ok
}
