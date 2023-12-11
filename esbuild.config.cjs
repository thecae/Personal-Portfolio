const esbuild = require("esbuild");
const path = require("path");
const chokidar = require("chokidar");

// Check if the script is running in watch mode
const isWatchMode = process.argv.includes("--watch");

const buildOptions = {
  entryPoints: [path.join(__dirname, "src/client/main.js")],
  bundle: true,
  outdir: path.join(__dirname, "public/js"),
  format: "esm",
  splitting: true,
  minify: true,
  sourcemap: "external",
  platform: "browser",
  loader: {
    ".js": "jsx",
    ".css": "css",
  },
  define: {
    "process.env.NODE_ENV": '"production"',
  },
};

function build() {
  return esbuild.build(buildOptions).catch(() => process.exit(1));
}

if (isWatchMode) {
  chokidar.watch("src/client", { ignoreInitial: true }).on("all", () => {
    console.log("Rebuilding...");
    build();
  });
  console.log("Watching for changes...");
} else {
  build();
}
