package service

import (
	"errors"
	"testing"
)

func TestClassifyACMEError(t *testing.T) {
	t.Parallel()

	tests := []struct {
		name string
		err  error
		want string
	}{
		{
			name: "nil returns empty",
			err:  nil,
			want: "",
		},
		{
			name: "challenge timeout",
			err:  errors.New("challenge timeout after 5 attempts"),
			want: "challenge_timeout",
		},
		{
			name: "plain challenge",
			err:  errors.New("challenge failed for example.com"),
			want: "challenge_timeout",
		},
		{
			name: "dns propagation",
			err:  errors.New("dns record not propagated yet"),
			want: "dns_failed",
		},
		{
			name: "rate limit",
			err:  errors.New("acme: urn:ietf:params:acme:error:rateLimited"),
			want: "rate_limited",
		},
		{
			name: "too many requests",
			err:  errors.New("too many certificates already issued for example.com"),
			want: "rate_limited",
		},
		{
			name: "server error",
			err:  errors.New("acme server error 500 internal server error"),
			want: "acme_server_error",
		},
		{
			name: "invalid domain",
			err:  errors.New("domain invalid: contains underscore"),
			want: "invalid_domain",
		},
		{
			name: "unable to resolve",
			err:  errors.New("unable to resolve host example.notarealtld"),
			want: "invalid_domain",
		},
		{
			name: "no such host",
			err:  errors.New("lookup example.test: no such host"),
			want: "invalid_domain",
		},
		{
			name: "unknown error bucket",
			err:  errors.New("something completely different"),
			want: "other",
		},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			t.Parallel()
			if got := classifyACMEError(tc.err); got != tc.want {
				t.Errorf("classifyACMEError(%v) = %q, want %q", tc.err, got, tc.want)
			}
		})
	}
}
