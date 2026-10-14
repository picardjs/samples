import { cp, mkdir, readdir, rm, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const feedUrl = 'https://feed.piral.cloud/api/v1/microfrontends/picard-demos';
const root = fileURLToPath(new URL('..', import.meta.url));
const dist = join(root, 'dist');

// relative references in the downloaded code, e.g., chunks or (static / dynamic) imports
const relativeReference = /["'](\.{1,2}\/[^"'\s]+\.(?:m?js|css))["']/g;

async function download(url) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error(`Could not download "${url}" (${res.status}).`);
  }

  return res.text();
}

/**
 * Downloads the given files of a micro frontend (and everything they reference relatively)
 * into the target directory, keeping the paths relative to the base URL.
 */
async function bundleFiles(urls, base, target) {
  const queue = [...urls];
  const done = new Set();

  while (queue.length > 0) {
    const url = queue.shift();

    if (done.has(url)) {
      continue;
    }

    if (!url.startsWith(base)) {
      throw new Error(`The file "${url}" is outside of "${base}".`);
    }

    done.add(url);
    const content = await download(url);
    const file = join(target, url.substring(base.length));
    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, content);

    if (url.endsWith('.js') || url.endsWith('.mjs')) {
      for (const [, path] of content.matchAll(relativeReference)) {
        queue.push(new URL(path, url).href);
      }
    }
  }
}

/**
 * Gets the files to bundle for a micro frontend of the feed.
 */
async function getEntryFiles(definition) {
  const { url, extras = {} } = definition;
  const spec = extras.pilet?.spec;

  if (spec === 'nf') {
    // Native Federation: the remote entry and its exposed / shared modules
    const manifest = JSON.parse(await download(url));
    const files = [...manifest.exposes, ...manifest.shared].map((item) => new URL(item.outFileName, url).href);
    return [url, ...files];
  } else if (spec === 'mf') {
    // Module Federation containers load their chunks by computed names - these are only known from a manifest
    throw new Error('Module Federation containers without an mf-manifest.json cannot be bundled.');
  } else {
    // pilets: the entry module (and its chunks)
    return [url];
  }
}

async function bundleMicrofrontends() {
  const feed = JSON.parse(await download(feedUrl));
  const microFrontends = {};

  for (const [name, [definition]] of Object.entries(feed.microFrontends)) {
    try {
      const base = new URL('./', definition.url).href;
      const files = await getEntryFiles(definition);
      await bundleFiles(files, base, join(dist, 'mfs', name));
      // the feed is placed next to the page, so the micro frontends are referenced relatively
      microFrontends[name] = [{ ...definition, url: `./mfs/${name}/${definition.url.substring(base.length)}` }];
      console.log(`Bundled "${name}".`);
    } catch (error) {
      console.warn(`Skipped "${name}": ${error.message}`);
    }
  }

  await writeFile(join(dist, 'feed.json'), JSON.stringify({ ...feed, microFrontends }, undefined, 2));
}

async function copyPicard() {
  // the browser variant of Picard.js (without source maps and typings)
  const source = join(root, 'node_modules', 'picard-js', 'dist', 'browser');
  const target = join(dist, 'picard');
  await mkdir(target, { recursive: true });

  for (const file of await readdir(source)) {
    if (file.endsWith('.js')) {
      await cp(join(source, file), join(target, file));
    }
  }
}

await rm(dist, { recursive: true, force: true });
await cp(join(root, 'src'), dist, { recursive: true });
await copyPicard();
await bundleMicrofrontends();
