import { localesConst } from '../assets/data/locales';
import path from 'path';
import { promises as fsp } from 'fs';

export async function genCSVDefsSet() {
    // get all locales
    const localeFilePaths = localesConst.map(locale => path.resolve(import.meta.dirname, `../locales/${locale.files[0]}`));

    const locales = await Promise.all(localeFilePaths.map((localeFilePath) => fsp.readFile(localeFilePath, 'utf-8').then(JSON.parse)));

    const csvHeaders = locales.map((locale) => {
        return locale.csvSyntax?.headerIdentifier as string ?? null;
    }).filter((header) => header !== null);

    const outString = `export const csvDefsSet = ${JSON.stringify(csvHeaders)};`;

    await fsp.writeFile(path.resolve(import.meta.dirname, '../assets/data/csvDefsSet.ts'), outString);
}
