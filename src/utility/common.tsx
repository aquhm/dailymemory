export function getFunctionCallerName() {
  // gets the text between whitespace for second part of stacktrace0
  return new Error().stack?.split("\n")[1];
}
