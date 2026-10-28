// Static guard for UI copy. Run from either frontend repository.
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import ts from 'typescript';
const root = path.resolve(process.argv[2] || process.cwd());
const admin = fs.existsSync(path.join(root, 'components/admin/admin-language-provider.tsx'));
function readObject(relative, name) {
  const file = path.join(root, relative);
  const ast = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
  const statement = ast.statements.find((node) => ts.isVariableStatement(node) && node.declarationList.declarations.some((item) => item.name.getText(ast) === name));
  const initializer = statement.declarationList.declarations.find((item) => item.name.getText(ast) === name).initializer.getText(ast);
  return Function(ts.transpile(`return (${initializer});`))();
}
const translations = readObject(admin ? 'lib/translations.ts' : 'src/constants/translations.ts', 'translations');
const copy = readObject(admin ? 'lib/ui-copy.ts' : 'src/constants/ui-copy.ts', 'uiCopy');
const target = translations[admin ? 'vi' : 'vn'];
assert.deepEqual(Object.keys(translations.en).sort(), Object.keys(target).sort(), 'Translation key mismatch');
const fields = (text) => [...text.matchAll(/\{\w+\}/g)].map((match) => match[0]).sort();
for (const key of Object.keys(translations.en)) assert.deepEqual(fields(translations.en[key]), fields(target[key]), `Interpolation mismatch: ${key}`);
for (const [en, vi] of Object.entries(copy)) assert.deepEqual(fields(en), fields(vi), `Interpolation mismatch: ${en}`);
const known = new Set([...Object.keys(copy), ...Object.values(copy), ...Object.values(translations.en), ...Object.values(target)]);
// Proper names, language codes, sample contact data, identifiers and symbols
// intentionally remain unchanged in either language.
const invariant = /^(?:Mix Food(?: ·)?|MIX FOOD|\/ 04 · MIX FOOD|Tom Yum|EN|VI|ID:|&amp;|Nguyễn Văn An|[^\s@]+@[^\s@]+|MF-[A-Z0-9]+|[\d\s+().-]+|•+)$/;
const findings = [];
let count = 0;
function walk(directory) {
  for (const item of fs.readdirSync(directory, { withFileTypes: true })) {
    const file = path.join(directory, item.name);
    if (item.isDirectory()) { if (!['node_modules', '.git', 'dist', '.next'].includes(item.name)) walk(file); continue; }
    if (!/\.tsx?$/.test(file) || /(?:\.d|\.test|\.spec)\.tsx?$/.test(file)) continue;
    count++;
    const ast = ts.createSourceFile(file, fs.readFileSync(file, 'utf8'), ts.ScriptTarget.Latest, true);
    function report(node, message) {
      findings.push(`${path.relative(root, file)}:${ast.getLineAndCharacterOfPosition(node.getStart(ast)).line + 1}: ${message}`);
    }
    function visit(node) {
      if (ts.isJsxText(node)) {
        const text = node.text.trim();
        if (text && /[\p{L}]/u.test(text) && !['M', 'T'].includes(text) && !invariant.test(text)) report(node, `Unlocalized JSX text: ${text}`);
      }
      if (ts.isJsxAttribute(node) && /^(title|description|message|label|placeholder|alt|aria-label)$/.test(node.name.getText(ast)) && node.initializer && ts.isStringLiteral(node.initializer)) {
        const text = node.initializer.text;
        if (text && !invariant.test(text)) report(node, `Unlocalized ${node.name.getText(ast)}: ${text}`);
      }
      if (ts.isCallExpression(node) && ['ui', 'translateUi'].includes(node.expression.getText(ast)) && node.arguments[0] && ts.isStringLiteral(node.arguments[0]) && !known.has(node.arguments[0].text)) report(node, `Unknown copy key: ${node.arguments[0].text}`);
      ts.forEachChild(node, visit);
    }
    visit(ast);
  }
}
for (const directory of admin ? ['app', 'components', 'lib'] : ['src']) walk(path.join(root, directory));
if (findings.length) { console.error(findings.join('\n')); process.exitCode = 1; }
else console.log(`Localization audit passed: ${count} source files; ${Object.keys(translations.en).length} paired keys and ${Object.keys(copy).length} copy pairs. Proper names and user content are preserved. Dynamic and API content require runtime checks.`);
