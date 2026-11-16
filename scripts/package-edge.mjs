import { cp, mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = fileURLToPath(new URL("../", import.meta.url));

// Keep the shared Chrome source intact and create an unpacked Edge extension.
export async function packageEdge(destination = resolve(root, "dist/edge")) {
  const manifest = JSON.parse(
    await readFile(resolve(root, "manifest.json"), "utf8")
  );
  delete manifest.mime_types_handler;
  await mkdir(destination, { recursive: true });
  const directories = ["lib", "fonts", "icons", "LICENSES", "docs"];
  const files = (await readdir(root)).filter(
    (name) => /\.(js|html|css)$/.test(name) || name === "README.md"
  );
  for (const name of [...directories, ...files])
    await cp(resolve(root, name), resolve(destination, name), {
      recursive: true,
    });
  await writeFile(
    resolve(destination, "manifest.json"),
    JSON.stringify(manifest, null, 2) + "\n"
  );
  return destination;
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(resolve(process.argv[1])).href
) {
  const destination = await packageEdge();
  console.log(`Edge用拡張機能を生成しました: ${destination}`);
  console.log(
    "edge://extensions の「展開して読み込み」でこのフォルダを選んでください。"
  );
}
