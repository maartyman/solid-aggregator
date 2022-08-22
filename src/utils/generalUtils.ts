export function resolveUndefinedString(string: String | undefined) : String {
  return string? string : "";
}
