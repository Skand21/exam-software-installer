import { getInstallerDownloadUrl, getSelectedInstallerApps } from './setup-core.mjs';

const examTabs = [...document.querySelectorAll('[data-exam]')];
const examPanels = [...document.querySelectorAll('[data-exam-panel]')];
const osChoice = document.querySelector('#os-choice');
const examTitle = document.querySelector('#program-title');
const examKicker = document.querySelector('#exam-kicker');
const examDescription = document.querySelector('#exam-description');
const nextStepText = document.querySelector('#next-step-text');
const downloadInstallerButton = document.querySelector('#download-installer');
const installerSummary = document.querySelector('#installer-summary');
const installNote = document.querySelector('#install-note');
const installerUnavailable = document.querySelector('#installer-unavailable');
const installAction = document.querySelector('#install-action');
const windowsHints = {
  python: 'Python и IDLE установятся из выбранного файла ниже.',
  pycharm: 'PyCharm войдёт в выбранный файл установки ниже.',
  libreoffice: 'LibreOffice войдёт в выбранный файл установки ниже.',
  kumir: 'КуМир загрузится внутри установщика; файл проверяется перед запуском.',
};

const copy = {
  oge: {
    title: 'Программы для ОГЭ',
    kicker: '9 класс',
    description: 'Python, офисные программы и среда для алгоритмов.',
  },
  ege: {
    title: 'Программы для ЕГЭ',
    kicker: '11 класс',
    description: 'Python для задач, PyCharm и офисные программы по желанию.',
  },
};

const downloads = {
  windows: {
    python: {
      href: 'https://www.python.org/ftp/python/3.13.16/python-3.13.16-amd64.exe',
      label: 'Скачать Python для Windows',
      hint: 'Открой скачанный .exe и нажми Install. IDLE установится вместе с Python.',
      file: true,
    },
    libreoffice: {
      href: 'https://download.documentfoundation.org/libreoffice/stable/26.8.0/win/x86_64/LibreOffice_26.8.0_Win_x86-64.msi',
      label: 'Скачать LibreOffice для Windows',
      hint: 'Открой скачанный .msi и следуй шагам установщика.',
      file: true,
    },
    kumir: {
      href: 'https://www.niisi.ru/kumir/kumir2-2.1.0-rc11-install.exe',
      label: 'Скачать КуМир для Windows',
      hint: 'Открой скачанный .exe и заверши установку.',
      file: true,
    },
    pycharm: {
      href: 'https://www.jetbrains.com/pycharm/download/',
      label: 'Скачать PyCharm',
      hint: 'На странице нажми Download, затем открой установщик.',
    },
    next: '<strong>После загрузки:</strong> открой файл из папки «Загрузки» и пройди установку. Python и IDLE устанавливаются вместе.',
  },
  macos: {
    python: {
      href: 'https://www.python.org/ftp/python/3.13.16/python-3.13.16-macos11.pkg',
      label: 'Скачать Python для macOS',
      hint: 'Открой .pkg и пройди установку. IDLE устанавливается вместе с Python.',
      file: true,
    },
    libreoffice: {
      href: 'https://www.libreoffice.org/download/',
      label: 'Скачать LibreOffice для macOS',
      hint: 'На странице выбери Apple Silicon или Intel, затем открой .dmg.',
    },
    kumir: {
      href: 'https://www.niisi.ru/kumir/Kumir-2.dmg',
      label: 'Скачать КуМир для macOS',
      hint: 'Открой .dmg и перемести приложение в папку Applications.',
      file: true,
    },
    pycharm: {
      href: 'https://www.jetbrains.com/pycharm/download/',
      label: 'Скачать PyCharm',
      hint: 'На странице выбери Apple Silicon или Intel, нажми Download и открой .dmg.',
    },
    next: '<strong>После загрузки:</strong> открой файл из папки «Загрузки» и следуй окну установки.',
  },
  linux: {
    python: {
      href: 'https://docs.python.org/3/using/unix.html',
      label: 'Инструкция для Linux',
      hint: 'Установи Python и IDLE через менеджер пакетов своего дистрибутива.',
    },
    libreoffice: {
      href: 'https://www.libreoffice.org/download/',
      label: 'Скачать LibreOffice для Linux',
      hint: 'Выбери пакет .deb или .rpm для своего дистрибутива.',
    },
    kumir: {
      href: 'https://www.niisi.ru/kumir/dl.htm',
      label: 'Загрузки КуМир для Linux',
      hint: 'Выбери сборку для своего дистрибутива на странице НИИСИ.',
    },
    pycharm: {
      href: 'https://www.jetbrains.com/pycharm/download/',
      label: 'Скачать PyCharm для Linux',
      hint: 'На странице выбери Linux, нажми Download и следуй инструкции JetBrains.',
    },
    next: '<strong>Для Linux:</strong> Debian/Ubuntu: <code>sudo apt install python3 idle3</code>. Fedora: <code>sudo dnf install python3 python3-idle</code>.',
  },
};

function detectOS() {
  const platform = `${navigator.userAgentData?.platform || ''} ${navigator.platform || ''} ${navigator.userAgent || ''}`.toLowerCase();
  if (platform.includes('win')) return 'windows';
  if (platform.includes('mac')) return 'macos';
  if (platform.includes('linux')) return 'linux';
  return 'windows';
}

function updateDownloads() {
  const selectedDownloads = downloads[osChoice.value];
  document.querySelectorAll('.download-link').forEach((link) => {
    const item = selectedDownloads[link.dataset.app];
    link.href = item.href;
    link.innerHTML = `${item.label} <span aria-hidden="true">${item.file ? '↓' : '↗'}</span>`;
    link.target = item.file ? '_self' : '_blank';
    if (item.file) link.setAttribute('download', '');
    else link.removeAttribute('download');
    link.closest('.program-card').querySelector('.card-hint').textContent = osChoice.value === 'windows'
      ? windowsHints[link.dataset.app]
      : item.hint;
    link.hidden = osChoice.value === 'windows';
  });
  const windows = osChoice.value === 'windows';
  nextStepText.innerHTML = windows
    ? '<strong>Дальше:</strong> скачай .exe ниже, открой файл и подтверди установку. Python и IDLE устанавливаются вместе.'
    : selectedDownloads.next;
  installAction.hidden = !windows;
  installerUnavailable.hidden = windows;
  if (windows) updateInstallerSummary();
}

function currentExam() {
  return document.querySelector('[data-exam][aria-selected="true"]').dataset.exam;
}

function updateInstallerSummary() {
  const apps = getSelectedInstallerApps(currentExam(), [...document.querySelectorAll('[data-exam-panel]:not([hidden]) [data-select-app]:checked')]
    .map((input) => input.dataset.selectApp));
  const labels = { python: 'Python + IDLE', pycharm: 'PyCharm', libreoffice: 'LibreOffice', kumir: 'КуМир' };
  installerSummary.textContent = apps.map((app) => labels[app]).join(' · ');
  const hasKumir = apps.includes('kumir');
  installNote.textContent = hasKumir
    ? 'Файл установит выбранные программы. КуМир 2.1.0 RC11 загрузится с сайта НИИСИ и проверится по подписи и контрольной сумме. Windows может запросить подтверждение администратора.'
    : 'Файл установит выбранные программы с серверов разработчиков. IDLE входит в установку Python. Windows может запросить подтверждение администратора.';
  installNote.textContent += ' Файл установщика пока не подписан; возможна проверка SmartScreen.';
  installNote.textContent += ' Нужны Windows 10/11 x64 и App Installer с WinGet.';
}

function downloadSelectedInstaller() {
  if (osChoice.value !== 'windows') return;
  const exam = currentExam();
  const selected = [...document.querySelectorAll('[data-exam-panel]:not([hidden]) [data-select-app]:checked')]
    .map((input) => input.dataset.selectApp);
  window.location.assign(getInstallerDownloadUrl(exam, selected));
}

function selectExam(exam, focus = false, updateHash = true) {
  examTabs.forEach((tab) => {
    const selected = tab.dataset.exam === exam;
    tab.setAttribute('aria-selected', String(selected));
    tab.tabIndex = selected ? 0 : -1;
    if (selected && focus) tab.focus();
  });
  examPanels.forEach((panel) => { panel.hidden = panel.dataset.examPanel !== exam; });
  examTitle.textContent = copy[exam].title;
  examKicker.textContent = copy[exam].kicker;
  examDescription.textContent = copy[exam].description;
  if (updateHash && location.hash !== `#${exam}`) history.replaceState(null, '', `#${exam}`);
}

examTabs.forEach((tab, index) => {
  tab.addEventListener('click', () => { selectExam(tab.dataset.exam); updateDownloads(); });
  tab.addEventListener('keydown', (event) => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const nextIndex = event.key === 'Home' ? 0 : event.key === 'End' ? examTabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : examTabs.length - 1)) % examTabs.length;
    selectExam(examTabs[nextIndex].dataset.exam, true);
    updateDownloads();
  });
});

document.querySelectorAll('[data-select-app]:not(:disabled)').forEach((input) => {
  input.addEventListener('change', updateInstallerSummary);
});
downloadInstallerButton.addEventListener('click', downloadSelectedInstaller);

osChoice.value = detectOS();
osChoice.addEventListener('change', updateDownloads);
const startingExam = location.hash === '#ege' ? 'ege' : 'oge';
selectExam(startingExam);
updateDownloads();
window.addEventListener('hashchange', () => {
  if (location.hash === '#oge') { selectExam('oge', false, false); updateDownloads(); }
  if (location.hash === '#ege') { selectExam('ege', false, false); updateDownloads(); }
});
