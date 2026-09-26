export function publicApiTag(path: string) {
  const resource = path.split("?")[0].split("/").filter(Boolean);
  return "bmt:" + (resource[0] === "pages" ? resource[1] : resource[0]);
}
