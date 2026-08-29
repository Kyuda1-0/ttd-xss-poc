// Persistence demo. Sets the cookie that feeds the same sink, then the parameter
// is no longer needed. Remove with: document.cookie = "cdnPath=; path=/; max-age=0"
document.cookie = "cdnPath=" + new URL(import.meta.url).origin + "; path=/; max-age=31536000";
console.log("PoC persistence armed on", location.origin, "- reload without any parameter");
export const versions = ["9.9.9"];
export const Component = () => null;
export default {};
