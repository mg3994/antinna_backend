import { build, context } from "esbuild";
import { glob } from "glob";
import path from "node:path";
import fs from "node:fs/promises";

const isWatch = process.argv.includes("--watch");
const isProd = process.argv.includes("--prod");

const files = await glob("src/**/*.ts");

const buildOptions = (entry) => ({
	entryPoints: [entry],
	bundle: true,
	format: "iife",
	platform: "browser",
	target: "esnext",
	minify: isProd,
	outfile: path.join("dist", path.relative("src", entry).replace(/\.ts$/, ".js")),
	logLevel: "info",
});

await fs.mkdir("dist", { recursive: true });

if (isWatch) {
	const contexts = [];

	for (const file of files) {
		const ctx = await context(buildOptions(file));
		await ctx.watch();
		contexts.push(ctx);
	}

	console.log(`Watching ${contexts.length} files...`);
} else {
	await Promise.all(files.map((file) => build(buildOptions(file))));
	console.log(`Built ${files.length} files.`);
}
