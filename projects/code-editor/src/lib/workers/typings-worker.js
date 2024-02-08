// This worker resolves typings (.d.ts files) for the given list of dependencies.

self.importScripts([
  'https://cdnjs.cloudflare.com/ajax/libs/typescript/5.3.3/typescript.min.js'
]);

const PACKAGES_SOURCE = 'https://unpkg.com';

const resolved = {};
const downloaded = {};

function normalizeUrl(url) {
  if (url && url.startsWith('node:')) {
    return url.replace('node:', 'https://unpkg.com/@types/node/');
  }

  return url;
}

const loadContent = async (url) => {
  try {
    url = normalizeUrl(url);
    const existing = downloaded[url];
    if (existing) {
      return existing;
    }

    console.info('loading', url);
    const response = await fetch(url);

    if (response.status >= 200 && response.status < 300) {
      const text = await response.text();
      downloaded[url] = text;
      return text;
    }
  } catch (err) {
    console.log('Error:', err);
  }

  return null;
};

const getIndex = async (lib) => {
  let packageUrl = `${PACKAGES_SOURCE}/${lib}/package.json`;
  let content = await loadContent(packageUrl);

  if (content) {
    const json = JSON.parse(content);
    if (json.typings) {
      return getTypingsUrl(json.typings, packageUrl);
    }

    packageUrl = `${PACKAGES_SOURCE}/${lib}/index.d.ts`;
    content = await loadContent(packageUrl);
    if (content) {
      return getTypingsUrl(packageUrl);
    }
  }

  return null;
};

function getTypingsUrl(url, base) {
  return new URL(normalizeUrl(url), normalizeUrl(base)).href;
}

const findReferences = (sourceFile) => {
  const result = [];

  /**
   * Resolve referenced files like:
   * /// <reference path="./inspector.d.ts" />
   */
  if (sourceFile.referencedFiles.length > 0) {
    result.push(...sourceFile.referencedFiles.map((ref) => ref.fileName));
  }

  function scanNode(node) {
    if (
      node.kind === ts.SyntaxKind.ImportDeclaration ||
      node.kind === ts.SyntaxKind.ExportDeclaration
    ) {
      if (node.moduleSpecifier && node.moduleSpecifier.text) {
        result.push(node.moduleSpecifier.text);
      }
    }
    ts.forEachChild(node, scanNode);
  }

  ts.forEachChild(sourceFile, scanNode);
  return result;
};

const resolveLibs = async (url, cache = {}) => {
  if (cache[url]) {
    return [];
  }
  cache[url] = true;

  const result = [];
  const content = await loadContent(url);

  if (content) {
    result.push({
      url: url,
      path: url.replace(PACKAGES_SOURCE, 'node_modules')
    });

    const sourceFile = ts.createSourceFile(
      'main.ts',
      content,
      ts.ScriptTarget.Latest,
      true,
      ts.ScriptKind.TS
    );
    const references = findReferences(sourceFile);

    for (const ref of references) {
      const fileName = ref.endsWith('.d.ts') ? ref : `${ref}.d.ts`;

      try {
        const fileUrl = getTypingsUrl(fileName, url);
        const refLibs = await resolveLibs(fileUrl, cache);

        if (refLibs && refLibs.length > 0) {
          result.push(...refLibs);
        }
      } catch (err) {
        console.log('Oops');
        console.error(err);
      }
    }
  }

  return result;
};

const getPackageTypings = async (lib, entryPoints) => {
  const libUrl = `${PACKAGES_SOURCE}/${lib}`;

  const existing = resolved[libUrl];
  if (existing) {
    return existing.files || [];
  }

  const indexUrl = await getIndex(lib);
  if (indexUrl) {
    entryPoints[lib] = indexUrl.replace(PACKAGES_SOURCE, 'node_modules');

    const files = await resolveLibs(indexUrl);

    resolved[libUrl] = { files };
    return files;
  }

  return [];
};

self.addEventListener('message', async (e) => {
  const { dependencies } = e.data;

  if (dependencies && dependencies.length > 0) {
    const entryPoints = {};

    const result = await Promise.all(
      dependencies.map((libName) => {
        return getPackageTypings(libName, entryPoints);
      })
    );

    const files = result
      .reduce((prev, curr) => prev.concat(curr), [])
      .map((t) => {
        return {
          ...t,
          content: downloaded[t.url]
        };
      });

    self.postMessage({
      entryPoints: entryPoints,
      files: files
    });
  }
});
