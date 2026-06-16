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
    errorGeneric: "Beklenmeyen bir hata oluştu."
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
    errorGeneric: "An unexpected error occurred."
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
    errorGeneric: "Ein unerwarteter Fehler ist aufgetreten."
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
    errorGeneric: "Произошла непредвиденная ошибка."
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
