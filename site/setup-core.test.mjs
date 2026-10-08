import assert from 'node:assert/strict';
import test from 'node:test';
import { getInstallerDownloadUrl, getInstallerFilename, getSelectedInstallerApps } from './setup-core.mjs';

test('Python and IDLE are always selected together', () => {
  assert.deepEqual(getSelectedInstallerApps('oge', []), ['python']);
  assert.equal(getInstallerFilename('ege', []), 'KITON-Setup-EGE-Python.exe');
});

test('OGE selection maps to a dedicated executable name', () => {
  assert.equal(
    getInstallerFilename('oge', ['kumir', 'libreoffice']),
    'KITON-Setup-OGE-Python-Kumir-LibreOffice.exe',
  );
});

test('EGE selection maps to a dedicated executable and release URL', () => {
  const apps = getSelectedInstallerApps('ege', ['pycharm', 'libreoffice']);
  assert.deepEqual(apps, ['python', 'pycharm', 'libreoffice']);
  const file = 'KITON-Setup-EGE-Python-PyCharm-LibreOffice.exe';
  assert.equal(getInstallerFilename('ege', apps), file);
  assert.equal(
    getInstallerDownloadUrl('ege', apps),
    `https://github.com/Skand21/exam-software-installer/releases/download/windows-installer-current/${file}`,
  );
});

test('all eight Windows selections have stable executable names', () => {
  const cases = [
    ['oge', [], 'KITON-Setup-OGE-Python.exe'],
    ['oge', ['kumir'], 'KITON-Setup-OGE-Python-Kumir.exe'],
    ['oge', ['libreoffice'], 'KITON-Setup-OGE-Python-LibreOffice.exe'],
    ['oge', ['kumir', 'libreoffice'], 'KITON-Setup-OGE-Python-Kumir-LibreOffice.exe'],
    ['ege', [], 'KITON-Setup-EGE-Python.exe'],
    ['ege', ['pycharm'], 'KITON-Setup-EGE-Python-PyCharm.exe'],
    ['ege', ['libreoffice'], 'KITON-Setup-EGE-Python-LibreOffice.exe'],
    ['ege', ['pycharm', 'libreoffice'], 'KITON-Setup-EGE-Python-PyCharm-LibreOffice.exe'],
  ];
  for (const [exam, selectedApps, file] of cases) {
    assert.equal(getInstallerFilename(exam, selectedApps), file);
  }
});

test('rejects unknown exams and apps from another exam profile', () => {
  assert.throws(() => getSelectedInstallerApps('other', []), /Неизвестный экзамен/);
  assert.throws(() => getSelectedInstallerApps('oge', ['pycharm']), /недоступна/);
  assert.throws(() => getSelectedInstallerApps('ege', ['kumir']), /недоступна/);
});
