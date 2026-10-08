package main

import (
	"reflect"
	"testing"
)

func TestParseExamProfiles(t *testing.T) {
	tests := []struct {
		name string
		exam string
		apps string
		want []string
	}{
		{name: "oge python only", exam: "oge", apps: "python", want: []string{"python"}},
		{name: "oge all", exam: "oge", apps: "python,kumir,libreoffice", want: []string{"python", "kumir", "libreoffice"}},
		{name: "ege python only", exam: "ege", apps: "python", want: []string{"python"}},
		{name: "ege all", exam: "ege", apps: "python,pycharm,libreoffice", want: []string{"python", "pycharm", "libreoffice"}},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			got, err := parseProfile(tt.exam, tt.apps)
			if err != nil {
				t.Fatalf("parseProfile returned error: %v", err)
			}
			keys := make([]string, len(got))
			for i, app := range got {
				keys[i] = app.key
			}
			if !reflect.DeepEqual(keys, tt.want) {
				t.Fatalf("got %v, want %v", keys, tt.want)
			}
		})
	}
}

func TestParseProfileRejectsCrossExamPrograms(t *testing.T) {
	for _, tt := range []struct{ exam, apps string }{
		{exam: "oge", apps: "python,pycharm"},
		{exam: "ege", apps: "python,kumir"},
		{exam: "other", apps: "python"},
	} {
		if _, err := parseProfile(tt.exam, tt.apps); err == nil {
			t.Fatalf("parseProfile(%q, %q) unexpectedly succeeded", tt.exam, tt.apps)
		}
	}
}
