import { useState, useCallback } from "react";

const SOFTWARE = [
  {
    category: "Офисный пакет",
    icon: "📄",
    items: [
      {
        id: "libreoffice",
        name: "LibreOffice",
        desc: "Writer, Calc, Impress — замена MS Office. Обязателен для ОГЭ/ЕГЭ 2026",
        winget: "TheDocumentFoundation.LibreOffice",
        manualUrl: "https://ru.libreoffice.org/download/",
        required: true,
        tags: ["ОГЭ", "ЕГЭ"],
      },
    ],
  },
  {
    category: "Python",
    icon: "🐍",
    items: [
      {
        id: "python3",
        name: "Python 3.12",
        desc: "Интерпретатор Python + IDLE. Основной язык для экзамена",
        winget: "Python.Python.3.12",
        manualUrl: "https://www.python.org/downloads/",
        required: true,
        tags: ["ОГЭ", "ЕГЭ"],
      },
      {
        id: "pycharm",
        name: "PyCharm Community",
        desc: "Удобная среда разработки для Python",
        winget: "JetBrains.PyCharm.Community",
        manualUrl: "https://www.jetbrains.com/pycharm/download/",
        required: false,
        tags: ["ОГЭ", "ЕГЭ"],
      },
    ],
  },
  {
    category: "Pascal",
    icon: "📘",
    items: [
      {
        id: "pascalabc",
        name: "PascalABC.NET",
        desc: "Среда для Pascal, версия 3.7+",
        winget: "PascalABC.PascalABCNET",
        manualUrl: "http://pascalabc.net/ssyilki-dlya-skachivaniya",
        required: false,
        tags: ["ОГЭ", "ЕГЭ"],
      },
      {
        id: "freepascal",
        name: "Free Pascal 3.2+",
        desc: "Альтернативный компилятор Pascal, используется в некоторых школах",
        winget: "FreePascal.FreePascalCompiler",
        manualUrl: "https://www.freepascal.org/download.html",
        required: false,
        tags: ["ЕГЭ"],
      },
    ],
  },
  {
    category: "C++",
    icon: "⚙️",
    items: [
      {
        id: "codeblocks",
        name: "Code::Blocks",
        desc: "Среда разработки для C++ с компилятором MinGW",
        winget: "CodeBlocks.CodeBlocks",
        manualUrl: "https://www.codeblocks.org/downloads/",
        required: false,
        tags: ["ЕГЭ"],
      },
      {
        id: "devcpp",
        name: "Dev-C++",
        desc: "Альтернативная IDE для C++, лёгкая и простая",
        winget: "Embarcadero.Dev-Cpp",
        manualUrl: "https://github.com/Embarcadero/Dev-Cpp/releases",
        required: false,
        tags: ["ЕГЭ"],
      },
      {
        id: "vscommunity",
        name: "Visual Studio Community",
        desc: "Мощная IDE от Microsoft для C++ и C#. Тяжёлая, но бывает на экзамене",
        winget: "Microsoft.VisualStudio.2022.Community",
        manualUrl: "https://visualstudio.microsoft.com/vs/community/",
        required: false,
        tags: ["ЕГЭ"],
      },
    ],
  },
  {
    category: "Java",
    icon: "☕",
    items: [
      {
        id: "javajdk",
        name: "Java JDK 21",
        desc: "Среда выполнения и компилятор Java",
        winget: "Oracle.JDK.21",
        manualUrl: "https://www.oracle.com/java/technologies/downloads/",
        required: false,
        tags: ["ЕГЭ"],
      },
      {
        id: "intellij",
        name: "IntelliJ IDEA Community",
        desc: "IDE для Java от JetBrains",
        winget: "JetBrains.IntelliJIDEA.Community",
        manualUrl: "https://www.jetbrains.com/idea/download/",
        required: false,
        tags: ["ЕГЭ"],
      },
    ],
  },
  {
    category: "Текстовые редакторы",
    icon: "📝",
    items: [
      {
        id: "notepadpp",
        name: "Notepad++",
        desc: "Продвинутый текстовый редактор",
        winget: "Notepad++.Notepad++",
        manualUrl: "https://notepad-plus-plus.org/downloads/",
        required: false,
        tags: ["ОГЭ", "ЕГЭ"],
      },
    ],
  },
  {
    category: "Алгоритмика",
    icon: "🤖",
    items: [
      {
        id: "kumir",
        name: "КуМир",
        desc: "Среда исполнителя «Робот» и школьный алгоритмический язык. Недоступен через winget, скачивается ТОЛЬКО вручную с сайта",
        winget: null,
        manualUrl: "https://www.niisi.ru/kumir/dl.htm",
        required: false,
        tags: ["ОГЭ"],
      },
    ],
  },
  {
    category: "Утилиты",
    icon: "🔧",
    items: [
      {
        id: "7zip",
        name: "7-Zip",
        desc: "Архиватор для распаковки материалов и вариантов",
        winget: "7zip.7zip",
        manualUrl: "https://www.7-zip.org/download.html",
        required: false,
        tags: ["ОГЭ", "ЕГЭ"],
      },
      {
        id: "chrome",
        name: "Google Chrome",
        desc: "Браузер для тренажёров и онлайн-вариантов",
        winget: "Google.Chrome",
        manualUrl: "https://www.google.com/chrome/",
        required: false,
        tags: ["ОГЭ", "ЕГЭ"],
      },
    ],
  },
];

const LINKS = [
  {
    name: "kompege.ru",
    desc: "Эмулятор станции КЕГЭ — тренировка в формате реального экзамена",
    url: "https://kompege.ru/",
    tags: ["ЕГЭ"],
  },
  {
    name: "inf-oge.sdamgia.ru",
    desc: "«Решу ОГЭ» — варианты и задания по информатике",
    url: "https://inf-oge.sdamgia.ru/",
    tags: ["ОГЭ"],
  },
  {
    name: "inf-ege.sdamgia.ru",
    desc: "«Решу ЕГЭ» — варианты и задания по информатике",
    url: "https://inf-ege.sdamgia.ru/",
    tags: ["ЕГЭ"],
  },
  {
    name: "kpolyakov.spb.ru",
    desc: "К.Ю. Поляков — разборы заданий, теория, генератор вариантов",
    url: "https://kpolyakov.spb.ru/school/ege.htm",
    tags: ["ОГЭ", "ЕГЭ"],
  },
  {
    name: "ФИПИ",
    desc: "Демоверсии, спецификации, кодификаторы — официальные материалы",
    url: "https://fipi.ru/oge/demoversii-specifikacii-kodifikatory",
    tags: ["ОГЭ", "ЕГЭ"],
  },
];

const PRESETS = {
  oge: {
    label: "ОГЭ информатика",
    ids: ["libreoffice", "python3", "pycharm", "notepadpp", "kumir"],
  },
  ege: {
    label: "ЕГЭ информатика",
    ids: ["libreoffice", "python3", "pycharm", "notepadpp"],
  },
  all: {
    label: "Всё сразу",
    ids: SOFTWARE.flatMap((c) => c.items.map((i) => i.id)),
  },
};

export default function App() {
  const [selected, setSelected] = useState(new Set(["libreoffice", "python3"]));
  const [copied, setCopied] = useState(false);
  const [activePreset, setActivePreset] = useState(null);
  const [showInstructions, setShowInstructions] = useState(false);

  const toggle = useCallback((id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
    setActivePreset(null);
  }, []);

  const applyPreset = useCallback((key) => {
    setSelected(new Set(PRESETS[key].ids));
    setActivePreset(key);
  }, []);

  const wingetItems = SOFTWARE.flatMap((c) => c.items).filter(
    (i) => selected.has(i.id) && i.winget
  );

  const manualItems = SOFTWARE.flatMap((c) => c.items).filter(
    (i) => selected.has(i.id) && !i.winget
  );

  const command =
    wingetItems.length > 0
      ? `winget install ${wingetItems.map((i) => `--id ${i.winget}`).join(" ")} --accept-package-agreements --accept-source-agreements`
      : "";

  const copyCommand = async () => {
    if (!command) return;
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = command;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(145deg, #0a0e1a 0%, #111827 50%, #0f1729 100%)",
        fontFamily: "'Segoe UI', system-ui, sans-serif",
        color: "#e2e8f0",
        padding: "24px 16px",
      }}
    >
      <div style={{ maxWidth: 680, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div
            style={{
              display: "inline-block",
              background: "linear-gradient(135deg, #3b82f6, #8b5cf6)",
              borderRadius: 16,
              padding: "12px 16px",
              marginBottom: 16,
              fontSize: 32,
            }}
          >
            💻
          </div>
          <h1
            style={{
              fontSize: 26,
              fontWeight: 700,
              margin: "0 0 6px",
              background: "linear-gradient(to right, #60a5fa, #a78bfa)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Установка ПО для экзаменов
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
            Выбери программы, скопируй команду, вставь в терминал
          </p>
        </div>

        {/* Presets */}
        <div
          style={{
            display: "flex",
            gap: 8,
            marginBottom: 24,
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          {Object.entries(PRESETS).map(([key, preset]) => (
            <button
              key={key}
              onClick={() => applyPreset(key)}
              style={{
                padding: "8px 16px",
                borderRadius: 20,
                border: activePreset === key ? "2px solid #3b82f6" : "2px solid #1e293b",
                background: activePreset === key ? "rgba(59,130,246,0.15)" : "#1e293b",
                color: activePreset === key ? "#60a5fa" : "#94a3b8",
                cursor: "pointer",
                fontSize: 13,
                fontWeight: 600,
                transition: "all 0.2s",
              }}
            >
              {preset.label}
            </button>
          ))}
        </div>

        {/* Software List */}
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          {SOFTWARE.map((cat) => (
            <div key={cat.category}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  color: "#64748b",
                  textTransform: "uppercase",
                  letterSpacing: 1.2,
                  marginBottom: 8,
                  paddingLeft: 4,
                }}
              >
                {cat.icon} {cat.category}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                {cat.items.map((item) => {
                  const isSelected = selected.has(item.id);
                  return (
                    <div
                      key={item.id}
                      onClick={() => toggle(item.id)}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 12,
                        padding: "12px 16px",
                        borderRadius: 12,
                        background: isSelected
                          ? "linear-gradient(135deg, rgba(59,130,246,0.12), rgba(139,92,246,0.08))"
                          : "#1e293b",
                        border: isSelected ? "1.5px solid rgba(59,130,246,0.4)" : "1.5px solid #2d3748",
                        cursor: "pointer",
                        transition: "all 0.2s",
                        userSelect: "none",
                      }}
                    >
                      {/* Checkbox */}
                      <div
                        style={{
                          width: 22,
                          height: 22,
                          borderRadius: 6,
                          border: isSelected ? "none" : "2px solid #475569",
                          background: isSelected
                            ? "linear-gradient(135deg, #3b82f6, #8b5cf6)"
                            : "transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                          transition: "all 0.2s",
                        }}
                      >
                        {isSelected && (
                          <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
                            <path
                              d="M1.5 5L4.5 8L11.5 1"
                              stroke="white"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                          <span style={{ fontWeight: 600, fontSize: 15 }}>{item.name}</span>
                          {item.tags.map((t) => (
                            <span
                              key={t}
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: 4,
                                background:
                                  t === "ОГЭ" ? "rgba(34,197,94,0.15)" : "rgba(234,179,8,0.15)",
                                color: t === "ОГЭ" ? "#4ade80" : "#facc15",
                              }}
                            >
                              {t}
                            </span>
                          ))}
                          {item.required && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: 4,
                                background: "rgba(239,68,68,0.15)",
                                color: "#f87171",
                              }}
                            >
                              обязательно
                            </span>
                          )}
                          {!item.winget && (
                            <span
                              style={{
                                fontSize: 10,
                                fontWeight: 700,
                                padding: "2px 6px",
                                borderRadius: 4,
                                background: "rgba(251,146,60,0.15)",
                                color: "#fb923c",
                              }}
                            >
                              вручную
                            </span>
                          )}
                        </div>
                        <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{item.desc}</div>
                      </div>
                      {/* Download link */}
                      {item.manualUrl && (
                        <a
                          href={item.manualUrl}
                          target="_blank"
                          rel="noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          title="Скачать с сайта"
                          style={{
                            width: 32,
                            height: 32,
                            borderRadius: 8,
                            background: "rgba(14,165,233,0.1)",
                            border: "1px solid rgba(14,165,233,0.25)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            flexShrink: 0,
                            textDecoration: "none",
                            fontSize: 14,
                            transition: "all 0.2s",
                          }}
                        >
                          ↗
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Command Output */}
        {selected.size > 0 && (
          <div style={{ marginTop: 28 }}>
            <div
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: "#64748b",
                textTransform: "uppercase",
                letterSpacing: 1.2,
                marginBottom: 8,
                paddingLeft: 4,
              }}
            >
              📋 Команда для установки
            </div>

            {command && (
              <div
                style={{
                  background: "#0f172a",
                  border: "1.5px solid #1e293b",
                  borderRadius: 12,
                  padding: 16,
                  position: "relative",
                }}
              >
                <code
                  style={{
                    fontSize: 12,
                    color: "#67e8f9",
                    wordBreak: "break-all",
                    lineHeight: 1.6,
                    display: "block",
                    paddingRight: 60,
                    fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace",
                  }}
                >
                  {command}
                </code>
                <button
                  onClick={copyCommand}
                  style={{
                    position: "absolute",
                    top: 12,
                    right: 12,
                    padding: "6px 14px",
                    borderRadius: 8,
                    border: "none",
                    background: copied
                      ? "linear-gradient(135deg, #22c55e, #16a34a)"
                      : "linear-gradient(135deg, #3b82f6, #8b5cf6)",
                    color: "white",
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                >
                  {copied ? "✓" : "Копировать"}
                </button>
              </div>
            )}

            {manualItems.length > 0 && (
              <div
                style={{
                  background: "rgba(251,146,60,0.08)",
                  border: "1.5px solid rgba(251,146,60,0.25)",
                  borderRadius: 12,
                  padding: 14,
                  marginTop: 10,
                  fontSize: 13,
                  color: "#fbbf24",
                }}
              >
                ⚠️ {manualItems.map((i) => i.name).join(", ")} нельзя установить через команду winget. Скачай вручную:{" "}
                {manualItems.map((i, idx) => (
                  <span key={i.id}>
                    {idx > 0 && ", "}
                    <a
                      href={i.manualUrl}
                      target="_blank"
                      rel="noreferrer"
                      style={{ color: "#60a5fa", textDecoration: "underline" }}
                    >
                      {i.manualUrl}
                    </a>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Instructions Toggle */}
        <div style={{ marginTop: 24 }}>
          <button
            onClick={() => setShowInstructions(!showInstructions)}
            style={{
              width: "100%",
              padding: "14px 16px",
              borderRadius: 12,
              border: "1.5px solid #1e293b",
              background: "#1e293b",
              color: "#e2e8f0",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              textAlign: "left",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span>❓ Как установить?</span>
            <span
              style={{
                transform: showInstructions ? "rotate(180deg)" : "none",
                transition: "transform 0.2s",
              }}
            >
              ▼
            </span>
          </button>

          {showInstructions && (
            <div
              style={{
                background: "#1e293b",
                borderRadius: "0 0 12px 12px",
                padding: "16px 18px",
                marginTop: -2,
                border: "1.5px solid #1e293b",
                borderTop: "1px solid #2d3748",
              }}
            >
              <div style={{ fontSize: 14, lineHeight: 1.8, color: "#cbd5e1" }}>
                <p style={{ margin: "0 0 12px", fontWeight: 600, color: "#f1f5f9" }}>
                  3 простых шага:
                </p>
                <p style={{ margin: "0 0 8px" }}>
                  <span style={{ color: "#60a5fa", fontWeight: 700 }}>1.</span> Нажми{" "}
                  <kbd
                    style={{
                      background: "#0f172a",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      border: "1px solid #334155",
                    }}
                  >
                    Win
                  </kbd>{" "}
                  +{" "}
                  <kbd
                    style={{
                      background: "#0f172a",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      border: "1px solid #334155",
                    }}
                  >
                    X
                  </kbd>
                  , выбери{" "}
                  <strong style={{ color: "#f1f5f9" }}>
                    «Терминал (Администратор)»
                  </strong>{" "}
                  или{" "}
                  <strong style={{ color: "#f1f5f9" }}>
                    «PowerShell (Администратор)»
                  </strong>
                </p>
                <p style={{ margin: "0 0 8px" }}>
                  <span style={{ color: "#60a5fa", fontWeight: 700 }}>2.</span> Нажми{" "}
                  <strong style={{ color: "#f1f5f9" }}>«Копировать»</strong> выше, чтобы скопировать команду
                </p>
                <p style={{ margin: "0 0 8px" }}>
                  <span style={{ color: "#60a5fa", fontWeight: 700 }}>3.</span> Вставь в терминал (
                  <kbd
                    style={{
                      background: "#0f172a",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      border: "1px solid #334155",
                    }}
                  >
                    Ctrl+V
                  </kbd>
                  ) и нажми{" "}
                  <kbd
                    style={{
                      background: "#0f172a",
                      padding: "2px 8px",
                      borderRadius: 4,
                      fontSize: 12,
                      border: "1px solid #334155",
                    }}
                  >
                    Enter
                  </kbd>
                </p>
                <p
                  style={{
                    margin: "14px 0 0",
                    fontSize: 12,
                    color: "#94a3b8",
                    background: "#0f172a",
                    padding: "10px 14px",
                    borderRadius: 8,
                  }}
                >
                  💡 winget — встроенный менеджер пакетов Windows 10/11. Все программы скачиваются из
                  официальных источников. Если winget не найден, обнови «Установщик приложений» в
                  Microsoft Store.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Links & Resources */}
        <div style={{ marginTop: 28 }}>
          <div
            style={{
              fontSize: 13,
              fontWeight: 700,
              color: "#64748b",
              textTransform: "uppercase",
              letterSpacing: 1.2,
              marginBottom: 8,
              paddingLeft: 4,
            }}
          >
            🌐 Тренажёры и материалы
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            {LINKS.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "12px 16px",
                  borderRadius: 12,
                  background: "#1e293b",
                  border: "1.5px solid #2d3748",
                  textDecoration: "none",
                  transition: "all 0.2s",
                  cursor: "pointer",
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: 6,
                    background: "linear-gradient(135deg, #0ea5e9, #06b6d4)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    fontSize: 11,
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  ↗
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{ fontWeight: 600, fontSize: 15, color: "#e2e8f0" }}>
                      {link.name}
                    </span>
                    {link.tags.map((t) => (
                      <span
                        key={t}
                        style={{
                          fontSize: 10,
                          fontWeight: 700,
                          padding: "2px 6px",
                          borderRadius: 4,
                          background:
                            t === "ОГЭ" ? "rgba(34,197,94,0.15)" : "rgba(234,179,8,0.15)",
                          color: t === "ОГЭ" ? "#4ade80" : "#facc15",
                        }}
                      >
                        {t}
                      </span>
                    ))}
                  </div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{link.desc}</div>
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 28,
            paddingTop: 20,
            borderTop: "1px solid #1e293b",
            color: "#475569",
            fontSize: 12,
          }}
        >
          Подготовка к ОГЭ/ЕГЭ по информатике 2026 · @tutorartem
        </div>
      </div>
    </div>
  );
}
