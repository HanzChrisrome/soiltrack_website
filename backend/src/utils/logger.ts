export function infoLog(...args: any[]) {
  if (process.env.MODE === "DEBUGGING") {
    console.log("\x1b[34m%s\x1b[0m", "[INFO]", ...args); // Blue
  }
}

export function errorLog(...args: any[]) {
  if (process.env.MODE === "DEBUGGING") {
    console.error("\x1b[31m%s\x1b[0m", "[ERROR]", ...args); // Red
  }
}

export function debugLog(...args: any[]) {
  if (process.env.MODE === "DEBUGGING") {
    console.debug("\x1b[36m%s\x1b[0m", "[DEBUG]", ...args); // Cyan
  }
}
