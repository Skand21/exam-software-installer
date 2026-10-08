package main

import (
	"bufio"
	"bytes"
	"crypto/sha256"
	"errors"
	"fmt"
	"io"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
	"runtime"
	"strings"
	"time"
)

var (
	exam     = "oge"
	apps     = "python"
	testMode = "false"
)

const (
	kumirURL    = "https://www.niisi.ru/kumir/kumir2-2.1.0-rc11-install.exe"
	kumirSHA256 = "868402A80ACE8DF37345AFC8555676A003705A86BDA864D9D547CA0A5644280E"
)

type program struct {
	key       string
	name      string
	wingetID  string
	license   string
	installer string
}

var catalog = map[string]program{
	"python": {
		key: "python", name: "Python + IDLE", wingetID: "Python.Python.3.14",
		license: "https://docs.python.org/3/license.html",
	},
	"pycharm": {
		key: "pycharm", name: "PyCharm", wingetID: "JetBrains.PyCharm",
		license: "https://www.jetbrains.com/legal/docs/toolbox/user/",
	},
	"libreoffice": {
		key: "libreoffice", name: "LibreOffice", wingetID: "TheDocumentFoundation.LibreOffice",
		license: "https://www.libreoffice.org/about-us/licenses/",
	},
	"kumir": {
		key: "kumir", name: "КуМир 2.1.0 RC11", license: "https://www.niisi.ru/kumir/",
		installer: "https://www.niisi.ru/kumir/kumir2-2.1.0-rc11-install.exe",
	},
}

var appOrder = map[string][]string{
	"oge": {"python", "kumir", "libreoffice"},
	"ege": {"python", "pycharm", "libreoffice"},
}

var examTitle = map[string]string{
	"oge": "ОГЭ",
	"ege": "ЕГЭ",
}

func main() {
	if runtime.GOOS != "windows" {
		fail("Этот установщик предназначен для Windows.")
	}
	if runtime.GOARCH != "amd64" {
		fail("Этот установщик предназначен для Windows x64. Выберите загрузку для своей системы вручную.")
	}

	selection, err := parseProfile(exam, apps)
	if err != nil {
		fail(err.Error())
	}
	if hasArg("--list") || hasArg("--dry-run") {
		printPlan(exam, selection)
		return
	}

	printPlan(exam, selection)
	fmt.Println("\nНажмите Y или Д, чтобы установить выбранные программы. Другой ответ отменит установку.")
	fmt.Println("Продолжая, вы подтверждаете установку выбранных приложений и принятие условий их лицензий.")
	if !(testMode == "true" && hasArg("--yes")) && !confirm() {
		fmt.Println("Установка отменена.")
		return
	}

	needsWinget := false
	for _, app := range selection {
		if app.wingetID != "" {
			needsWinget = true
		}
	}
	if needsWinget {
		if _, err := exec.LookPath("winget.exe"); err != nil {
			fail("Не найден WinGet. Установите или обновите App Installer из Microsoft Store, затем запустите этот файл ещё раз.")
		}
	}

	failed := false
	for _, app := range selection {
		fmt.Printf("\nУстановка: %s\n", app.name)
		if app.wingetID != "" {
			err = installWinget(app)
		} else {
			err = installKumir(app)
		}
		if err != nil {
			failed = true
			fmt.Printf("Ошибка установки %s: %v\n", app.name, err)
			continue
		}
		fmt.Printf("Готово: %s\n", app.name)
	}

	if !failed {
		if hasProgram(selection, "python") {
			verifyPythonIdle()
		}
		fmt.Println("\nУстановка выбранных программ завершена.")
	} else {
		fmt.Println("\nУстановка завершилась частично. Проверьте сообщения выше и повторите только неудачный шаг.")
		os.Exit(1)
	}
	if !(testMode == "true" && hasArg("--yes")) {
		waitForExit()
	}
}

func parseProfile(examName, appList string) ([]program, error) {
	allowed, ok := appOrder[examName]
	if !ok {
		return nil, fmt.Errorf("Неизвестный экзамен в сборке установщика: %q", examName)
	}

	requested := map[string]bool{"python": true}
	for _, key := range strings.Split(appList, ",") {
		key = strings.TrimSpace(key)
		if key == "" {
			continue
		}
		if _, ok := catalog[key]; !ok {
			return nil, fmt.Errorf("Неизвестная программа в сборке установщика: %q", key)
		}
		requested[key] = true
	}

	result := make([]program, 0, len(requested))
	for _, key := range allowed {
		if requested[key] {
			result = append(result, catalog[key])
			delete(requested, key)
		}
	}
	if len(requested) > 0 {
		return nil, errors.New("В этой сборке есть программа, которая не относится к выбранному экзамену.")
	}
	return result, nil
}

func printPlan(examName string, selection []program) {
	fmt.Println("KITON · Установка программ для", examTitle[examName])
	fmt.Println("Выбрано:")
	for i, app := range selection {
		fmt.Printf("  %d. %s\n     Лицензия: %s\n", i+1, app.name, app.license)
	}
	fmt.Println("\nIDLE устанавливается вместе с Python. WinGet проверяет пакеты, КуМир проверяется по подписи и SHA-256.")
	fmt.Println("Установка существующих приложений не обновляется автоматически.")
}

func installWinget(app program) error {
	installed, err := wingetPackageInstalled(app.wingetID)
	if err != nil {
		return fmt.Errorf("не удалось проверить, установлена ли программа: %w", err)
	}
	if installed {
		fmt.Printf("Уже установлено: %s. Обновление не выполняется.\n", app.name)
		return nil
	}

	args := []string{
		"install", "--exact", "--id", app.wingetID,
		"--source", "winget", "--accept-source-agreements",
		"--accept-package-agreements", "--silent", "--disable-interactivity", "--no-upgrade",
	}
	cmd := exec.Command("winget.exe", args...)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	return cmd.Run()
}

func wingetPackageInstalled(packageID string) (bool, error) {
	cmd := exec.Command("winget.exe", "list", "--exact", "--id", packageID, "--source", "winget", "--accept-source-agreements", "--disable-interactivity")
	var output bytes.Buffer
	cmd.Stdout = &output
	cmd.Stderr = &output
	if err := cmd.Run(); err != nil {
		if isWingetNoApplicationsFound(err) {
			return false, nil
		}
		return false, fmt.Errorf("%w: %s", err, strings.TrimSpace(output.String()))
	}
	return wingetListContainsPackage(output.String(), packageID), nil
}

func isWingetNoApplicationsFound(err error) bool {
	return err != nil && strings.Contains(strings.ToLower(err.Error()), "0x8a150014")
}

func wingetListContainsPackage(output, packageID string) bool {
	for _, line := range strings.Split(output, "\n") {
		fields := strings.Fields(line)
		for _, field := range fields {
			if strings.EqualFold(strings.Trim(field, "│|"), packageID) {
				return true
			}
		}
	}
	return false
}

func installKumir(app program) error {
	setupPath := filepath.Join(os.TempDir(), "KITON-Kumir-2.1.0-RC11.exe")
	defer os.Remove(setupPath)

	request, err := http.NewRequest(http.MethodGet, app.installer, nil)
	if err != nil {
		return err
	}
	client := &http.Client{Timeout: 8 * time.Minute}
	response, err := client.Do(request)
	if err != nil {
		return fmt.Errorf("не удалось скачать установщик: %w", err)
	}
	defer response.Body.Close()
	if response.StatusCode != http.StatusOK {
		return fmt.Errorf("сайт НИИСИ ответил кодом %d", response.StatusCode)
	}

	file, err := os.Create(setupPath)
	if err != nil {
		return err
	}
	hasher := sha256.New()
	_, copyErr := io.Copy(io.MultiWriter(file, hasher), io.LimitReader(response.Body, 100*1024*1024))
	closeErr := file.Close()
	if copyErr != nil {
		return copyErr
	}
	if closeErr != nil {
		return closeErr
	}
	if got := strings.ToUpper(fmt.Sprintf("%x", hasher.Sum(nil))); got != kumirSHA256 {
		return fmt.Errorf("контрольная сумма не совпала; файл удалён (получено %s)", got)
	}
	if err := verifyKumirSignature(setupPath); err != nil {
		return err
	}
	cmd := exec.Command(setupPath, "/S")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	cmd.Stdin = os.Stdin
	return cmd.Run()
}

func verifyKumirSignature(path string) error {
	powershell := "Import-Module Microsoft.PowerShell.Security -ErrorAction Stop; $signature = Get-AuthenticodeSignature -LiteralPath '" + strings.ReplaceAll(path, "'", "''") + "'; if ($signature.Status -ne 'Valid' -or $signature.SignerCertificate.Subject -notmatch 'FGU FNTS NIISI RAN') { exit 1 }"
	ps := filepath.Join(os.Getenv("WINDIR"), "System32", "WindowsPowerShell", "v1.0", "powershell.exe")
	if _, err := os.Stat(ps); err != nil {
		ps = "powershell.exe"
	}
	cmd := exec.Command(ps, "-NoProfile", "-NonInteractive", "-Command", powershell)
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		return errors.New("подпись установщика КуМир не прошла проверку; запуск отменён")
	}
	return nil
}

func verifyPythonIdle() {
	cmd := exec.Command("py.exe", "-3.14", "-c", "import idlelib, tkinter; print('Python и IDLE доступны')")
	cmd.Stdout = os.Stdout
	cmd.Stderr = os.Stderr
	if err := cmd.Run(); err != nil {
		fmt.Println("Не удалось проверить IDLE автоматически. Проверьте Python в меню Пуск.")
	}
}

func confirm() bool {
	fmt.Print("Введите Y для продолжения: ")
	line, err := bufio.NewReader(os.Stdin).ReadString('\n')
	answer := strings.TrimSpace(line)
	return err == nil && (strings.EqualFold(answer, "y") || strings.EqualFold(answer, "д") || strings.EqualFold(answer, "да"))
}

func waitForExit() {
	fmt.Print("\nНажмите Enter, чтобы закрыть это окно.")
	_, _ = bufio.NewReader(os.Stdin).ReadString('\n')
}

func hasProgram(selection []program, key string) bool {
	for _, app := range selection {
		if app.key == key {
			return true
		}
	}
	return false
}

func hasArg(arg string) bool {
	for _, value := range os.Args[1:] {
		if value == arg {
			return true
		}
	}
	return false
}

func fail(message string) {
	fmt.Println(message)
	if !(testMode == "true" && hasArg("--yes")) && !hasArg("--dry-run") && !hasArg("--list") {
		waitForExit()
	}
	os.Exit(1)
}
