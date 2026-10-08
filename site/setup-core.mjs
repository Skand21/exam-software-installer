const EXAM_APPS = {
  oge: ['python', 'kumir', 'libreoffice'],
  ege: ['python', 'pycharm', 'libreoffice'],
};

const WINGET_IDS = {
  python: 'Python.Python.3.14',
  pycharm: 'JetBrains.PyCharm',
  libreoffice: 'TheDocumentFoundation.LibreOffice',
};

const DISPLAY_NAME = {
  python: 'Python',
  pycharm: 'PyCharm',
  libreoffice: 'LibreOffice',
  kumir: 'Kumir',
};
const WINDOWS_INSTALLER_RELEASE = 'https://github.com/Skand21/exam-software-installer/releases/download/windows-installer-current';

export function getSelectedInstallerApps(exam, selectedApps) {
  if (!(exam in EXAM_APPS)) throw new Error('Неизвестный экзамен');
  const allowed = EXAM_APPS[exam];
  const allowedSet = new Set(allowed);
  const selection = new Set(['python', ...selectedApps]);
  for (const app of selection) {
    if (!allowedSet.has(app)) throw new Error(`Программа ${app} недоступна для выбранного экзамена`);
  }
  return allowed.filter((app) => selection.has(app));
}

export function getInstallerFilename(exam, selectedApps) {
  const apps = getSelectedInstallerApps(exam, selectedApps);
  const name = apps.map((app) => DISPLAY_NAME[app]).join('-');
  return `KITON-Setup-${exam.toUpperCase()}-${name}.exe`;
}

export function getInstallerDownloadUrl(exam, selectedApps) {
  return `${WINDOWS_INSTALLER_RELEASE}/${encodeURIComponent(getInstallerFilename(exam, selectedApps))}`;
}
