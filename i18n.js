const SPEECH_LANG = {
  tr: "tr-TR",
  en: "en-US",
  de: "de-DE",
  ru: "ru-RU"
};

const translations = {
  tr: {
    languageLabel: "Dil",
    appSubtitle: "Otomasyon Paneli",
    helpHowTo: "Nasıl kullanılır?",
    helpClose: "Kapat",
    permissionChecking: "İzinler kontrol ediliyor...",
    permissionOpenSettings: "Erişilebilirlik Ayarlarını Aç",
    permissionDenied:
      "Erişilebilirlik izni gerekli. Devam etmek için ayarlardan roboMouse'a izin verin.",
    permissionRequired: "Mouse kontrolü için Erişilebilirlik izni gerekli.",
    statusInactive: "Pasif",
    statusActive: "Aktif",
    runtimeLabel: "Çalışma süresi",
    movementTitle: "Hareket ayarları",
    distanceLabel: "Mouse mesafesi",
    intervalLabel: "Döngü aralığı",
    unitSec: "sn",
    btnStart: "Başlat",
    btnStop: "Durdur",
    stepUp: "Artır",
    stepDown: "Azalt",
    helpTitle: "RoboMouse Nedir?",
    helpIntro:
      "Bilgisayarınızı aktif tutmak için fareyi otomatik hareket ettirir. İlk kullanımda macOS Erişilebilirlik izni gerekir.",
    helpDemoLabel: "Nasıl çalışır?",
    helpVoiceOn: "Seslendirmeyi kapat",
    helpVoiceOff: "Seslendirmeyi aç",
    helpPhaseStart: "Başlat butonuna basın — otomasyon başlar",
    helpPhaseActiveWait: "Durum Aktif olur, döngü aralığı kadar beklenir",
    helpPhaseMoveRight: "Fare belirlediğiniz px kadar sağa gider",
    helpPhaseWaitClick: "Tekrar beklenir, ardından sol tık yapılır",
    helpPhaseMoveLeft: "Fare aynı mesafe kadar sola geri döner",
    helpPhaseLoop: "Döngü tekrar eder — bilgisayar aktif kalır",
    helpPhaseStop: "Durdur butonu ile istediğiniz zaman kapatabilirsiniz",
    helpStep1:
      "<strong>Mouse mesafesi</strong> ve <strong>döngü aralığı</strong> değerlerini ayarlayın.",
    helpStep2: "<strong>Başlat</strong> ile fare otomatik hareket eder, tıklar ve geri döner.",
    helpStep3: "<strong>Durdur</strong> ile istediğiniz zaman otomasyonu kapatabilirsiniz.",
    errorAccessibilityDeniedReset:
      "Erişilebilirlik anahtarı açık görünse bile yeni sürüm için geçerli olmayabilir. Ayarlarda roboMouse anahtarını kapatıp tekrar açın, sonra uygulamayı yeniden başlatın.",
    errorAccessibilityRequired:
      "Erişilebilirlik izni gerekli. Sistem Ayarları > Gizlilik ve Güvenlik > Erişilebilirlik bölümünden roboMouse'a izin verin.",
    errorMouseLibLoad:
      "Mouse kütüphanesi yüklenemedi. Uygulamayı güncel macOS sürümünüzde yeniden paketleyin.",
    errorMouseControl:
      "Mouse kontrolü başarısız. macOS güncellemesinden sonra Erişilebilirlik iznini yeniden vermeniz gerekebilir.",
    errorGeneric: "Beklenmeyen bir hata oluştu.",
    scheduleTitle: "Otomatik durdurma",
    scheduleExpand: "Zamanlama bölümünü aç",
    scheduleCollapse: "Zamanlama bölümünü kapat",
    scheduleSummaryOff: "Kapalı",
    scheduleDuration: "Süre sonunda dur",
    scheduleDurationHint: "Başladıktan sonra belirlenen sürede otomatik durur",
    scheduleStopAt: "Saatte dur",
    scheduleWindow: "Yalnızca şu saatler arasında çalış",
    scheduleWindowHint: "Pencere dışında başlatılamaz; bitiş saatinde durur",
    scheduleCountdown: "Otomatik durma",
    scheduleCountdownIdle: "Zamanlama ayarlı — başlatınca geri sayım görünür",
    scheduleHours: "Saat",
    scheduleMinutes: "Dakika",
    scheduleFrom: "Başlangıç",
    scheduleTo: "Bitiş",
    scheduleStoppedDuration: "Süre doldu — otomasyon durduruldu.",
    scheduleStoppedTime: "Planlanan saatte otomasyon durduruldu.",
    scheduleStoppedWindow: "Çalışma penceresi kapandı — otomasyon durduruldu.",
    errorOutsideWindow: "Şu an çalışma penceresi dışında. Zamanlama ayarlarını kontrol edin.",
    btnStopping: "Durduruluyor…",
    helpPhaseSchedule: "İsteğe bağlı zamanlama ile süre, saat veya çalışma penceresi ayarlayabilirsiniz",
    helpStep4: "<strong>Zamanlama</strong> ile süre limiti, durma saati veya çalışma penceresi belirleyin.",
    settingsOpen: "Ayarlar",
    settingsTitle: "Ayarlar",
    settingsClose: "Kapat",
    settingsOptInHint: "Akıllı modlar kapalıdır — etkinleştirmek için aşağıdaki seçenekleri açın.",
    smartModesTitle: "Akıllı modlar",
    smartIdleLabel: "Sadece idle olunca çalış",
    smartIdleHint: "Aktifken fare oynamaz; belirlenen süre hareketsiz kalınca başlar",
    smartIdleThreshold: "Idle eşiği",
    smartMeetingLabel: "Toplantıda duraklat",
    smartMeetingHint: "Zoom ve Teams desteklenir; tarayıcı Meet best-effort",
    smartPresentationLabel: "Sunum modu",
    smartPresentationHint: "Açıkken otomasyon her zaman duraklatılır",
    hotkeyTitle: "Kısayol",
    hotkeyEnableLabel: "Global kısayol",
    hotkeyEnableHint: "Panel kapalıyken oturumu aç/kapa",
    hotkeyAccelerator: "Cmd+Shift+M / Ctrl+Shift+M",
    hotkeyRegisterFailed: "Kısayol kaydedilemedi — başka bir uygulama kullanıyor olabilir.",
    statusWaitingIdle: "Bekliyor — idle",
    statusPausedMeeting: "Toplantı — duraklatıldı",
    statusPausedPresentation: "Sunum — duraklatıldı",
    smartHintIdleRemaining: "kaldı"
  },
  en: {
    languageLabel: "Language",
    appSubtitle: "Automation Panel",
    helpHowTo: "How to use",
    helpClose: "Close",
    permissionChecking: "Checking permissions...",
    permissionOpenSettings: "Open Accessibility Settings",
    permissionDenied:
      "Accessibility permission is required. Allow roboMouse in System Settings to continue.",
    permissionRequired: "Accessibility permission is required for mouse control.",
    statusInactive: "Idle",
    statusActive: "Active",
    runtimeLabel: "Runtime",
    movementTitle: "Movement settings",
    distanceLabel: "Mouse distance",
    intervalLabel: "Loop interval",
    unitSec: "sec",
    btnStart: "Start",
    btnStop: "Stop",
    stepUp: "Increase",
    stepDown: "Decrease",
    helpTitle: "What is RoboMouse?",
    helpIntro:
      "Keeps your computer awake by moving the mouse automatically. macOS Accessibility permission is required on first use.",
    helpDemoLabel: "How it works",
    helpVoiceOn: "Turn voice off",
    helpVoiceOff: "Turn voice on",
    helpPhaseStart: "Press Start — automation begins",
    helpPhaseActiveWait: "Status becomes Active, then waits for the loop interval",
    helpPhaseMoveRight: "The mouse moves right by your chosen pixels",
    helpPhaseWaitClick: "It waits again, then performs a left click",
    helpPhaseMoveLeft: "The mouse moves back left by the same distance",
    helpPhaseLoop: "The loop repeats — your computer stays awake",
    helpPhaseStop: "Press Stop anytime to end automation",
    helpStep1: "Set the <strong>mouse distance</strong> and <strong>loop interval</strong>.",
    helpStep2: "With <strong>Start</strong>, the mouse moves, clicks, and returns automatically.",
    helpStep3: "Use <strong>Stop</strong> whenever you want to end automation.",
    errorAccessibilityDeniedReset:
      "Accessibility may look enabled but be invalid for the new build. Toggle roboMouse off and on in Settings, then restart the app.",
    errorAccessibilityRequired:
      "Accessibility permission is required. Enable roboMouse under System Settings > Privacy & Security > Accessibility.",
    errorMouseLibLoad:
      "Could not load the mouse library. Rebuild the app for your current macOS version.",
    errorMouseControl:
      "Mouse control failed. You may need to grant Accessibility permission again after a macOS update.",
    errorGeneric: "An unexpected error occurred.",
    scheduleTitle: "Auto-stop",
    scheduleExpand: "Expand schedule section",
    scheduleCollapse: "Collapse schedule section",
    scheduleSummaryOff: "Off",
    scheduleDuration: "Stop after duration",
    scheduleDurationHint: "Automatically stops after the set time from start",
    scheduleStopAt: "Stop at time",
    scheduleWindow: "Only run between",
    scheduleWindowHint: "Cannot start outside the window; stops at end time",
    scheduleCountdown: "Auto-stop in",
    scheduleCountdownIdle: "Schedule configured — countdown appears when running",
    scheduleHours: "Hours",
    scheduleMinutes: "Minutes",
    scheduleFrom: "From",
    scheduleTo: "To",
    scheduleStoppedDuration: "Duration reached — automation stopped.",
    scheduleStoppedTime: "Scheduled stop time reached — automation stopped.",
    scheduleStoppedWindow: "Working window ended — automation stopped.",
    errorOutsideWindow: "Outside the working window. Check your schedule settings.",
    btnStopping: "Stopping…",
    helpPhaseSchedule: "Optionally set duration, stop time, or a daily working window",
    helpStep4: "Use <strong>Schedule</strong> to set a duration limit, stop time, or working window.",
    settingsOpen: "Settings",
    settingsTitle: "Settings",
    settingsClose: "Close",
    settingsOptInHint: "Smart modes are off — enable the options below to activate them.",
    smartModesTitle: "Smart modes",
    smartIdleLabel: "Run only when idle",
    smartIdleHint: "No movement while active; starts after the idle threshold",
    smartIdleThreshold: "Idle threshold",
    smartMeetingLabel: "Pause in meetings",
    smartMeetingHint: "Zoom and Teams supported; browser Meet is best-effort",
    smartPresentationLabel: "Presentation mode",
    smartPresentationHint: "When on, automation is always paused",
    hotkeyTitle: "Shortcut",
    hotkeyEnableLabel: "Global shortcut",
    hotkeyEnableHint: "Toggle session when the panel is closed",
    hotkeyAccelerator: "Cmd+Shift+M / Ctrl+Shift+M",
    hotkeyRegisterFailed: "Could not register shortcut — another app may be using it.",
    statusWaitingIdle: "Waiting — idle",
    statusPausedMeeting: "Meeting — paused",
    statusPausedPresentation: "Presentation — paused",
    smartHintIdleRemaining: "remaining"
  },
  de: {
    languageLabel: "Sprache",
    appSubtitle: "Automatisierungs-Panel",
    helpHowTo: "Anleitung",
    helpClose: "Schließen",
    permissionChecking: "Berechtigungen werden geprüft...",
    permissionOpenSettings: "Bedienungshilfen öffnen",
    permissionDenied:
      "Bedienungshilfen-Berechtigung erforderlich. Erlauben Sie roboMouse in den Systemeinstellungen.",
    permissionRequired: "Für die Maussteuerung ist die Bedienungshilfen-Berechtigung erforderlich.",
    statusInactive: "Inaktiv",
    statusActive: "Aktiv",
    runtimeLabel: "Laufzeit",
    movementTitle: "Bewegungseinstellungen",
    distanceLabel: "Mausbewegung",
    intervalLabel: "Schleifenintervall",
    unitSec: "Sek",
    btnStart: "Start",
    btnStop: "Stopp",
    stepUp: "Erhöhen",
    stepDown: "Verringern",
    helpTitle: "Was ist RoboMouse?",
    helpIntro:
      "Hält Ihren Computer wach, indem die Maus automatisch bewegt wird. Beim ersten Start ist die macOS-Berechtigung für Bedienungshilfen nötig.",
    helpDemoLabel: "So funktioniert es",
    helpVoiceOn: "Sprache ausschalten",
    helpVoiceOff: "Sprache einschalten",
    helpPhaseStart: "Start drücken — Automatisierung beginnt",
    helpPhaseActiveWait: "Status wird Aktiv, dann wartet das Intervall ab",
    helpPhaseMoveRight: "Die Maus bewegt sich um die eingestellten Pixel nach rechts",
    helpPhaseWaitClick: "Es wartet erneut und führt dann einen Linksklick aus",
    helpPhaseMoveLeft: "Die Maus bewegt sich um dieselbe Distanz nach links zurück",
    helpPhaseLoop: "Die Schleife wiederholt sich — der Computer bleibt aktiv",
    helpPhaseStop: "Mit Stopp können Sie die Automatisierung jederzeit beenden",
    helpStep1:
      "Stellen Sie <strong>Mausbewegung</strong> und <strong>Schleifenintervall</strong> ein.",
    helpStep2: "Mit <strong>Start</strong> bewegt sich die Maus automatisch, klickt und kehrt zurück.",
    helpStep3: "Mit <strong>Stopp</strong> beenden Sie die Automatisierung jederzeit.",
    errorAccessibilityDeniedReset:
      "Bedienungshilfen können aktiv wirken, aber für die neue Version ungültig sein. roboMouse in den Einstellungen aus- und wieder einschalten, dann die App neu starten.",
    errorAccessibilityRequired:
      "Bedienungshilfen-Berechtigung erforderlich. Aktivieren Sie roboMouse unter Systemeinstellungen > Datenschutz & Sicherheit > Bedienungshilfen.",
    errorMouseLibLoad:
      "Mausbibliothek konnte nicht geladen werden. App für Ihre macOS-Version neu erstellen.",
    errorMouseControl:
      "Maussteuerung fehlgeschlagen. Nach einem macOS-Update ggf. Bedienungshilfen-Berechtigung erneut erteilen.",
    errorGeneric: "Ein unerwarteter Fehler ist aufgetreten.",
    scheduleTitle: "Auto-Stopp",
    scheduleExpand: "Zeitplan-Bereich öffnen",
    scheduleCollapse: "Zeitplan-Bereich schließen",
    scheduleSummaryOff: "Aus",
    scheduleDuration: "Nach Dauer stoppen",
    scheduleDurationHint: "Stoppt automatisch nach der eingestellten Zeit ab Start",
    scheduleStopAt: "Um Uhrzeit stoppen",
    scheduleWindow: "Nur zwischen",
    scheduleWindowHint: "Start außerhalb des Fensters nicht möglich; stoppt zur Endzeit",
    scheduleCountdown: "Auto-Stopp in",
    scheduleCountdownIdle: "Zeitplan aktiv — Countdown beim Start sichtbar",
    scheduleHours: "Stunden",
    scheduleMinutes: "Minuten",
    scheduleFrom: "Von",
    scheduleTo: "Bis",
    scheduleStoppedDuration: "Dauer erreicht — Automatisierung gestoppt.",
    scheduleStoppedTime: "Geplante Stoppzeit erreicht — Automatisierung gestoppt.",
    scheduleStoppedWindow: "Arbeitsfenster beendet — Automatisierung gestoppt.",
    errorOutsideWindow: "Außerhalb des Arbeitsfensters. Zeitplan-Einstellungen prüfen.",
    btnStopping: "Stoppe…",
    helpPhaseSchedule: "Optional Dauer, Stoppzeit oder tägliches Arbeitsfenster festlegen",
    helpStep4: "Mit <strong>Zeitplan</strong> Dauer, Stoppzeit oder Arbeitsfenster einstellen.",
    settingsOpen: "Einstellungen",
    settingsTitle: "Einstellungen",
    settingsClose: "Schließen",
    settingsOptInHint: "Smart-Modi sind aus — aktivieren Sie die Optionen unten.",
    smartModesTitle: "Smart-Modi",
    smartIdleLabel: "Nur bei Inaktivität",
    smartIdleHint: "Keine Bewegung bei Aktivität; startet nach der Idle-Schwelle",
    smartIdleThreshold: "Idle-Schwelle",
    smartMeetingLabel: "Bei Meetings pausieren",
    smartMeetingHint: "Zoom und Teams unterstützt; Browser-Meet best-effort",
    smartPresentationLabel: "Präsentationsmodus",
    smartPresentationHint: "Bei Aktivierung immer pausiert",
    hotkeyTitle: "Tastenkürzel",
    hotkeyEnableLabel: "Globales Kürzel",
    hotkeyEnableHint: "Sitzung umschalten, wenn Panel geschlossen",
    hotkeyAccelerator: "Cmd+Shift+M / Ctrl+Shift+M",
    hotkeyRegisterFailed: "Kürzel konnte nicht registriert werden.",
    statusWaitingIdle: "Wartet — idle",
    statusPausedMeeting: "Meeting — pausiert",
    statusPausedPresentation: "Präsentation — pausiert",
    smartHintIdleRemaining: "verbleibend"
  },
  ru: {
    languageLabel: "Язык",
    appSubtitle: "Панель автоматизации",
    helpHowTo: "Как пользоваться",
    helpClose: "Закрыть",
    permissionChecking: "Проверка разрешений...",
    permissionOpenSettings: "Открыть настройки Универсального доступа",
    permissionDenied:
      "Требуется разрешение Универсального доступа. Разрешите roboMouse в настройках системы.",
    permissionRequired: "Для управления мышью нужно разрешение Универсального доступа.",
    statusInactive: "Неактивно",
    statusActive: "Активно",
    runtimeLabel: "Время работы",
    movementTitle: "Настройки движения",
    distanceLabel: "Расстояние мыши",
    intervalLabel: "Интервал цикла",
    unitSec: "сек",
    btnStart: "Старт",
    btnStop: "Стоп",
    stepUp: "Увеличить",
    stepDown: "Уменьшить",
    helpTitle: "Что такое RoboMouse?",
    helpIntro:
      "Не даёт компьютеру уснуть, автоматически двигая мышь. При первом запуске нужно разрешение Универсального доступа macOS.",
    helpDemoLabel: "Как это работает",
    helpVoiceOn: "Выключить озвучку",
    helpVoiceOff: "Включить озвучку",
    helpPhaseStart: "Нажмите Старт — автоматизация начинается",
    helpPhaseActiveWait: "Статус становится Активно, затем ожидание интервала",
    helpPhaseMoveRight: "Мышь смещается вправо на заданное число пикселей",
    helpPhaseWaitClick: "Снова ожидание, затем левый клик",
    helpPhaseMoveLeft: "Мышь возвращается влево на то же расстояние",
    helpPhaseLoop: "Цикл повторяется — компьютер остаётся активным",
    helpPhaseStop: "Нажмите Стоп, чтобы остановить автоматизацию",
    helpStep1:
      "Задайте <strong>расстояние мыши</strong> и <strong>интервал цикла</strong>.",
    helpStep2: "По <strong>Старт</strong> мышь двигается, кликает и возвращается автоматически.",
    helpStep3: "По <strong>Стоп</strong> можно остановить автоматизацию в любой момент.",
    errorAccessibilityDeniedReset:
      "Разрешение может быть включено, но недействительно для новой версии. Выключите и включите roboMouse в настройках, затем перезапустите приложение.",
    errorAccessibilityRequired:
      "Нужно разрешение Универсального доступа. Включите roboMouse: Системные настройки > Конфиденциальность и безопасность > Универсальный доступ.",
    errorMouseLibLoad:
      "Не удалось загрузить библиотеку мыши. Пересоберите приложение для вашей версии macOS.",
    errorMouseControl:
      "Не удалось управлять мышью. После обновления macOS может понадобиться снова выдать разрешение.",
    errorGeneric: "Произошла непредвиденная ошибка.",
    scheduleTitle: "Автоостановка",
    scheduleExpand: "Развернуть раздел расписания",
    scheduleCollapse: "Свернуть раздел расписания",
    scheduleSummaryOff: "Выкл.",
    scheduleDuration: "Остановить через",
    scheduleDurationHint: "Автоматически останавливается через заданное время после старта",
    scheduleStopAt: "Остановить в",
    scheduleWindow: "Работать только между",
    scheduleWindowHint: "Вне окна запуск невозможен; остановка в конце окна",
    scheduleCountdown: "Автоостановка через",
    scheduleCountdownIdle: "Расписание настроено — отсчёт при запуске",
    scheduleHours: "Часы",
    scheduleMinutes: "Минуты",
    scheduleFrom: "С",
    scheduleTo: "До",
    scheduleStoppedDuration: "Время истекло — автоматизация остановлена.",
    scheduleStoppedTime: "Наступило запланированное время — автоматизация остановлена.",
    scheduleStoppedWindow: "Рабочее окно закончилось — автоматизация остановлена.",
    errorOutsideWindow: "Сейчас вне рабочего окна. Проверьте настройки расписания.",
    btnStopping: "Остановка…",
    helpPhaseSchedule: "При желании задайте длительность, время остановки или рабочее окно",
    helpStep4: "В разделе <strong>Расписание</strong> задайте лимит, время остановки или окно работы.",
    settingsOpen: "Настройки",
    settingsTitle: "Настройки",
    settingsClose: "Закрыть",
    settingsOptInHint: "Умные режимы выключены — включите опции ниже.",
    smartModesTitle: "Умные режимы",
    smartIdleLabel: "Только при простое",
    smartIdleHint: "Без движения при активности; старт после порога простоя",
    smartIdleThreshold: "Порог простоя",
    smartMeetingLabel: "Пауза на встречах",
    smartMeetingHint: "Zoom и Teams; браузер Meet — best-effort",
    smartPresentationLabel: "Режим презентации",
    smartPresentationHint: "При включении всегда на паузе",
    hotkeyTitle: "Горячая клавиша",
    hotkeyEnableLabel: "Глобальная клавиша",
    hotkeyEnableHint: "Переключить сессию при закрытой панели",
    hotkeyAccelerator: "Cmd+Shift+M / Ctrl+Shift+M",
    hotkeyRegisterFailed: "Не удалось зарегистрировать клавишу.",
    statusWaitingIdle: "Ожидание — простой",
    statusPausedMeeting: "Встреча — пауза",
    statusPausedPresentation: "Презентация — пауза",
    smartHintIdleRemaining: "осталось"
  }
};

let currentLang = localStorage.getItem("roboMouse.lang") || "tr";

function t(key) {
  const pack = translations[currentLang] || translations.tr;
  return pack[key] || translations.tr[key] || key;
}

function getSpeechLang() {
  return SPEECH_LANG[currentLang] || SPEECH_LANG.tr;
}

function setLanguage(lang) {
  if (!translations[lang]) return;
  currentLang = lang;
  localStorage.setItem("roboMouse.lang", lang);
  document.documentElement.lang = lang;
  applyTranslations();
}

function applyTranslations() {
  document.querySelectorAll("[data-i18n]").forEach(el => {
    el.textContent = t(el.getAttribute("data-i18n"));
  });

  document.querySelectorAll("[data-i18n-html]").forEach(el => {
    el.innerHTML = t(el.getAttribute("data-i18n-html"));
  });

  document.querySelectorAll("[data-i18n-aria]").forEach(el => {
    el.setAttribute("aria-label", t(el.getAttribute("data-i18n-aria")));
  });

  const langSelect = document.getElementById("langSelect");
  if (langSelect && langSelect.value !== currentLang) {
    langSelect.value = currentLang;
  }
}

function translateError(data) {
  if (data && data.code) {
    return t(data.code) || t("errorGeneric");
  }
  return t("errorGeneric");
}
