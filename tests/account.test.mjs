import assert from 'node:assert/strict';
import test from 'node:test';
import ts from 'typescript';
import vm from 'node:vm';
import { readFileSync } from 'node:fs';
import { URL } from 'node:url';

const source = readFileSync(new URL('../src/features/account/helpers.ts', import.meta.url), 'utf8');
const compiled = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const module = { exports: {} };
vm.runInNewContext(compiled, { module, exports: module.exports });
const { isValidIranianMobile, isValidOtp, normalizeIranianMobile, toEnglishDigits } = module.exports;

test('converts Persian and Arabic numerals', () => {
    assert.equal(toEnglishDigits('۰۹١۲'), '0912');
});

test('normalizes local and country-code mobile numbers', () => {
    assert.equal(normalizeIranianMobile('+98 912 123 4567'), '09121234567');
    assert.equal(normalizeIranianMobile('۰۹۱۲ ۱۲۳ ۴۵۶۷'), '09121234567');
});

test('validates Iranian mobile numbers', () => {
    assert.equal(isValidIranianMobile('09121234567'), true);
    assert.equal(isValidIranianMobile('02112345678'), false);
});

test('accepts only complete five-digit verification codes', () => {
    assert.equal(isValidOtp('۱۲۳۴۵'), true);
    assert.equal(isValidOtp('1234'), false);
});
