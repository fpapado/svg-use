import path from 'node:path';
import fs from 'node:fs/promises';
import {
  createJsModule,
  transformSvgForUseHref,
  defaultComponentFactory,
  defaultGetSvgIdAttribute,
  defaultThemeSubstitution,
} from '@svg-use/core';
import { globby } from 'globby';
import { pascalCase } from 'change-case';

// Output everything in the same directory
const INDEX_FILEPATH = 'src/index.ts';
const INPUT_DIR = 'iconSources';
const OUT_DIR = 'src/icons';

/**
 * Hacky way to ensure that we never resolve package module specifiers, when
 * the relative paths are in the same directory
 */
const ensureLeadingDotSlash = (str: string) =>
  str.startsWith('./') ? str : `./${str}`;

async function processFile(filePath: string) {
  const parsedPath = path.parse(filePath);

  // Write to the output directory in a flat structure, and colocate JS modules
  // alongside the SVG. There are many other alternatives here.
  const svgOutputPath = path.join(OUT_DIR, parsedPath.base);
  const jsOutputName = pascalCase(parsedPath.name) + '.ts';
  const jsOutputPath = path.join(OUT_DIR, jsOutputName);
  const pathFromJsToSvg = ensureLeadingDotSlash(
    path.posix.relative(path.dirname(jsOutputPath), svgOutputPath),
  );

  const initialContent = await fs.readFile(filePath, 'utf-8');

  const transformResult = transformSvgForUseHref(initialContent, {
    getSvgIdAttribute: defaultGetSvgIdAttribute,
    getThemeSubstitutions: defaultThemeSubstitution,
  });

  if (transformResult.type === 'failure') {
    throw new Error(transformResult.error);
  }

  const {
    data: { content: transformedSvg, id, viewBox },
  } = transformResult;

  const jsModule = createJsModule(
    {
      // Current bundlers resolve this construct as syntax for asset references (as URLs)
      url: `new URL(${JSON.stringify(pathFromJsToSvg)}, import.meta.url).href`,
      id: JSON.stringify(id),
      viewBox: JSON.stringify(viewBox),
    },
    {
      componentFactory: defaultComponentFactory,
    },
  );

  await Promise.all([
    fs.writeFile(jsOutputPath, jsModule),
    fs.writeFile(svgOutputPath, transformedSvg),
  ]);

  console.log(
    `Processed ${filePath}, writing ${jsOutputPath} and ${svgOutputPath}.`,
  );

  return {
    jsOutputPath,
    svgOutputPath,
  };
}

async function writeIndexFile(indexPath: string, paths: Array<string>) {
  const content = paths
    .map((p) => {
      const parsedPath = path.parse(p);
      const pathFromIndexToComponent = ensureLeadingDotSlash(
        path.posix.relative(path.dirname(indexPath), p),
      );
      const withJsExtension = pathFromIndexToComponent.replace(/\.ts/, '.js');

      return `export {Component as ${parsedPath.name}} from ${JSON.stringify(withJsExtension)}`;
    })
    .join('\n');

  fs.writeFile(indexPath, content);
}

async function main() {
  const svgFilePaths = await globby(`${INPUT_DIR}/**/*.svg`);

  const paths = await Promise.all(svgFilePaths.map(processFile));

  await writeIndexFile(
    INDEX_FILEPATH,
    paths.map((p) => p.jsOutputPath),
  );

  console.log(`Wrote index file at ${INDEX_FILEPATH}.`);
}

main();
