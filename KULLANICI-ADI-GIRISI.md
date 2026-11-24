# Kullanıcı adıyla (e-postasız) giriş ve site içi duyurular

## 1. Firebase'de bir kez açman gerekenler
1. Firebase Console → Authentication → Sign-in method → **E-posta/Şifre**'yi etkinleştir ("E-posta bağlantısı" kapalı kalsın).
2. Firestore → Kurallar: `firestore.rules` dosyasındaki güncel kuralları yapıştırıp yayımla (yalnızca `announcements` bölümü yeni).
3. Dosyaları GitHub'a yükle: `index.html`, `sw.js`, `gizlilik.html`, `data/ankara.json`.

## 2. Nasıl çalışır
- Girişte Google düğmesinin altında "Google'sız devam et" bağlantısı çıkar: kullanıcı adı + şifre ile hesap açılır (e-posta istenmez).
- Kullanıcı adı arka planda hiçbir zaman posta gönderilmeyen sahte bir adrese çevrilir (`ad@ak-kullanici.invalid`).
- Şifre sıfırlama ŞU AN YOKTUR: şifresini unutan kullanıcı hesabını kurtaramaz (ekranda uyarı yazar).
- Bu hesaplar yönetici olamaz, e-posta listesine girmez.

## 3. Duyurular
- E-posta (yönetici panelindeki "Duyuru / e-posta gönder"): yalnızca e-postası olan (Google) hesaplara gider.
- Site içi duyuru (yönetici panelindeki "Site içi duyuru yayınla"): HERKESE ulaşır, kullanıcı adıyla açılan hesaplara da. Kullanıcı menüsünde "Duyurular" ve avatarda kırmızı nokta görünür. Rozete göre alıcı seçilebilir.
- Duyuruları giriş yapan herkes okuyabilir (kural böyle); rozet seçimi yalnızca kimlerin göreceğini belirler, gizli bilgi yazma.
