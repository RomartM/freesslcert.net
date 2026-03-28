#!/usr/bin/env python3
"""Submit freesslcert.net URLs to IndexNow for Bing, Yandex, and Seznam indexing."""

import json
import urllib.request
import urllib.error

KEY = "ff301284-b496-4a6b-b188-85209424c75b"
HOST = "freesslcert.net"
KEY_LOCATION = f"https://{HOST}/{KEY}.txt"

URLS = [
    f"https://{HOST}/",
    f"https://{HOST}/about",
    f"https://{HOST}/faq",
    f"https://{HOST}/guides/nginx-ssl",
    f"https://{HOST}/guides/apache-ssl",
    f"https://{HOST}/privacy",
    f"https://{HOST}/terms",
]

PAYLOAD = {
    "host": HOST,
    "key": KEY,
    "keyLocation": KEY_LOCATION,
    "urlList": URLS,
}

ENDPOINTS = [
    ("IndexNow (api.indexnow.org)", "https://api.indexnow.org/indexnow"),
    ("Bing", "https://www.bing.com/indexnow"),
    ("Yandex", "https://yandex.com/indexnow"),
    ("Seznam", "https://search.seznam.cz/indexnow"),
]


def submit(name: str, url: str) -> None:
    data = json.dumps(PAYLOAD).encode("utf-8")
    req = urllib.request.Request(
        url,
        data=data,
        headers={"Content-Type": "application/json; charset=utf-8"},
        method="POST",
    )
    print(f"\n{'='*60}")
    print(f"Submitting to: {name}")
    print(f"Endpoint:      {url}")
    print(f"Payload:       {json.dumps(PAYLOAD, indent=2)}")
    try:
        with urllib.request.urlopen(req, timeout=15) as resp:
            body = resp.read().decode("utf-8", errors="replace")
            print(f"Status:        {resp.status} {resp.reason}")
            print(f"Headers:       {dict(resp.headers)}")
            print(f"Response body: {body if body else '(empty)'}")
    except urllib.error.HTTPError as e:
        body = e.read().decode("utf-8", errors="replace")
        print(f"HTTP Error:    {e.code} {e.reason}")
        print(f"Headers:       {dict(e.headers)}")
        print(f"Response body: {body if body else '(empty)'}")
    except Exception as e:
        print(f"Error:         {e}")


def main():
    print("IndexNow Submission for freesslcert.net")
    print(f"API Key:       {KEY}")
    print(f"Key File:      /Users/dev/freesslcert.net/frontend/public/{KEY}.txt")
    print(f"Key Location:  {KEY_LOCATION}")
    print(f"URLs:          {len(URLS)} pages")
    for u in URLS:
        print(f"  - {u}")

    for name, endpoint in ENDPOINTS:
        submit(name, endpoint)

    print(f"\n{'='*60}")
    print("DONE. Summary:")
    print(f"  Key:            {KEY}")
    print(f"  Key file:       /Users/dev/freesslcert.net/frontend/public/{KEY}.txt")
    print(f"  Reference file: /Users/dev/freesslcert.net/frontend/public/indexnow-key.txt")
    print()
    print("NOTE: The key verification file must be deployed to")
    print(f"  https://{HOST}/{KEY}.txt")
    print("before IndexNow can fully verify submissions.")
    print("Some endpoints may accept submissions before verification.")


if __name__ == "__main__":
    main()
