import test from "node:test";
import assert from "node:assert/strict";
import { access, mkdtemp, readFile, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { packageEdge } from "../scripts/package-edge.mjs";

test("Edge package removes Chrome MIME registration and includes the complete extension", async (t) => {
  const destination = await mkdtemp(join(tmpdir(), "pdf-viewer-edge-"));
  t.after(() => rm(destination, { recursive: true, force: true }));
  const sourceManifest = await readFile(
    new URL("../manifest.json", import.meta.url),
    "utf8"
  );
  await packageEdge(destination);
  const manifest = JSON.parse(
    await readFile(join(destination, "manifest.json"), "utf8")
  );
  assert.equal(manifest.mime_types_handler, undefined);
  const expected = JSON.parse(sourceManifest);
  delete expected.mime_types_handler;
  assert.deepEqual(manifest, expected);
  assert.equal(
    await readFile(new URL("../manifest.json", import.meta.url), "utf8"),
    sourceManifest
  );

  const assets = [
    manifest.background.service_worker,
    manifest.action.default_popup,
    ...Object.values(manifest.icons),
    ...manifest.content_scripts.flatMap((entry) => entry.js),
    ...manifest.web_accessible_resources.flatMap((entry) => entry.resources),
    "fonts/BIZUDPGothic-Regular.ttf",
    "fonts/BIZUDPMincho-Regular.ttf",
    "lib/pdf.worker.min.mjs",
    "LICENSES/README.txt",
  ];
  for (const asset of assets) await access(join(destination, asset));
  for (const file of await readdir(destination)) {
    if (!/\.(js|html)$/.test(file)) continue;
    const source = await readFile(join(destination, file), "utf8");
    for (const match of source.matchAll(
      /(?:from\s*|import\s*\(\s*)["'](\.\/[^"']+)["']|(?:src|href)="([^"#]+\.(?:js|css))"/g
    ))
      await access(join(destination, match[1] || match[2]));
  }
  assert.equal((await readdir(destination)).includes("tests"), false);
});
