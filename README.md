# roboMouse

**Bilgisayarınızı aktif tutmak için fareyi otomatik hareket ettiren hafif bir macOS uygulaması.**

Electron + [nut-js](https://github.com/nut-tree/nut.js) ile geliştirilmiştir. Menü çubuğundan veya panelden kontrol edilir; döngü aralığı ve hareket mesafesi ayarlanabilir.

> **English:** A lightweight macOS utility that keeps your computer awake by moving the mouse on a loop — right, click, left, repeat.

---

## Özellikler

- **Otomatik fare döngüsü** — Belirlediğiniz mesafe kadar sağa gider, sol tıklar, aynı mesafe kadar sola döner
- **Ayarlanabilir parametreler** — Hareket mesafesi (px) ve döngü aralığı (sn)
- **macOS menü çubuğu (Tray)** — Start/Stop, mesafe & aralık preset'leri, panel açma, çıkış
- **Aktif durum göstergesi** — Tray ikonunda yeşil rozet; tooltip'te çalışma süresi
- **Erişilebilirlik kontrolü** — İzin yoksa Start devre dışı; ayarlara tek tıkla yönlendirme
- **Çoklu dil** — Türkçe, English, Deutsch, Русский
- **Yardım paneli** — Nasıl kullanılır animasyonu ve isteğe bağlı sesli anlatım
- **Arka planda çalışma** — Pencere kapatıldığında uygulama tray'de kalır (macOS)

---

## Nasıl çalışır?

```
Başlat → bekle (aralık) → sağa hareket → bekle → sol tık → sola dön → tekrar
```

| Ayar | Açıklama | Varsayılan |
|------|----------|------------|
| Mouse mesafesi | Her adımda yatay hareket (px) | 5 px |
| Döngü aralığı | Adımlar arası bekleme süresi | 5 sn |

Tray preset'leri: mesafe **5 / 10 / 15 / 20 px**, aralık **5 / 10 / 30 sn**.

---

## Gereksinimler

| Ortam | Minimum |
|-------|---------|
| macOS | 12.0 (Monterey) ve üzeri |
| Node.js | 18+ (geliştirme için) |
| ImageMagick | Tray ikonları üretmek için (`magick` komutu) |

> Tray menüsü ve menü çubuğu ikonu yalnızca **macOS**'ta kullanılabilir. Windows hedefi `package.json` içinde tanımlıdır; ana geliştirme macOS odaklıdır.

---

## Kurulum

### DMG ile (son kullanıcı)

1. `dist/roboMouse-1.0.2-arm64.dmg` dosyasını açın *(build sonrası)*.
2. Uygulamayı **Applications** klasörüne sürükleyin.
3. İlk açılışta **Sistem Ayarları → Gizlilik ve Güvenlik → Erişilebilirlik** bölümünden roboMouse'a izin verin.
4. Ad-hoc imzalı build'lerde Gatekeeper uyarısı çıkabilir — **Sağ tık → Aç** ile geçebilirsiniz.

### Kaynak koddan

```bash
git clone https://github.com/<kullanici>/roboMouse.git
cd roboMouse
npm install
npm start
```

---

## Geliştirme

### Komutlar

| Komut | Açıklama |
|-------|----------|
| `npm start` | Geliştirme modunda Electron uygulamasını çalıştırır |
| `npm run generate:tray-icons` | Menü çubuğu tray ikonlarını üretir (ImageMagick gerekir) |
| `npm run build:mac` | İmzalı macOS DMG build *(Apple Developer sertifikası gerekir)* |
| `npm run build:mac:local` | Yerel ad-hoc imzalı DMG build |

### macOS DMG oluşturma

```bash
npm run generate:tray-icons   # tray-icon-idle.png & tray-icon-active.png
npm run build:mac:local       # → dist/roboMouse-1.0.2-arm64.dmg
```

### Erişilebilirlik izni

Uygulama fareyi kontrol edebilmek için macOS **Erişilebilirlik** iznine ihtiyaç duyar. İzin verilmeden Start butonu pasif kalır. Güncelleme veya yeniden kurulum sonrası izni kapatıp tekrar açmanız gerekebilir.

---

## Proje yapısı

```
roboMouse/
├── roboMouse.js          # Electron main process, bot & tray
├── index.html            # UI paneli
├── preload.js            # IPC köprüsü
├── i18n.js               # Panel çevirileri (TR / EN / DE / RU)
├── tray-i18n.js          # Tray menü çevirileri
├── icon.png              # Uygulama logosu
├── tray-icon-*.png       # Menü çubuğu ikonları (üretilmiş)
├── build/
│   ├── icon.icns         # macOS uygulama ikonu
│   └── entitlements.*.plist
└── scripts/
    └── generate-tray-icons.sh
```

---

## Teknolojiler

- [Electron](https://www.electronjs.org/) 40
- [@nut-tree-fork/nut-js](https://www.npmjs.com/package/@nut-tree-fork/nut-js) — fare otomasyonu
- [@nut-tree-fork/node-mac-permissions](https://www.npmjs.com/package/@nut-tree-fork/node-mac-permissions) — macOS izin API'si
- [electron-builder](https://www.electron.build/) — paketleme

---

## Lisans

ISC — ayrıntılar için `package.json`.

---

## Katkı

Issue açabilir veya pull request gönderebilirsiniz. Geliştirme öncesi `npm start` ile test etmeniz yeterli.
