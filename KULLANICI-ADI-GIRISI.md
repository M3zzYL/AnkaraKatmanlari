# Giriş: hesapla giriş, kayıt ol, Google ve e-posta bağlama

## Giriş ekranı (sıra)
1. Kullanıcı adı veya e-posta + şifre ile **Giriş yap** (ilk görünen bölüm).
2. Altında yazı olarak "Hesabın yok mu? **Kayıt ol**": tıklayınca kayıt formu açılır (kullanıcı adı + şifre + şifre tekrar; e-posta istenmez).
3. En altta "veya" ayracından sonra **Google ile giriş yap**.

## Firebase'de bir kez yapılacaklar
1. Authentication → Sign-in method → **E-posta/Şifre** etkin olsun ("E-posta bağlantısı" kapalı kalabilir).
2. Authentication → Settings → **Authorized domains** içinde `m3zzyl.github.io` bulunsun (Google girişi çalışıyorsa zaten vardır; e-posta bağlama bağlantısı için de gerekir).
3. İsteğe bağlı: Authentication → Templates bölümünde doğrulama ve şifre sıfırlama e-postalarının dilini/metnini Türkçeleştir.
4. Firestore kuralları: `firestore.rules` (announcements bölümü yeni).
5. Dosyaları GitHub'a yükle: index.html, sw.js, gizlilik.html, data/ankara.json.

## E-posta bağlama (kullanıcı adıyla açılan hesaplar)
- Kullanıcı menüsünde yalnızca bu hesaplarda "E-posta bağla" görünür.
- Kullanıcı e-postasını yazar → adresine doğrulama bağlantısı gider → bağlantıya tıklayınca hesabın e-postası o adrese geçer.
- Bundan sonra kullanıcı adı yerine **e-posta + aynı şifreyle** giriş yapılır (giriş kutusu "kullanıcı adı veya e-posta" kabul eder). Veriler, rozetler, anılar korunur.
- E-postası bağlanan hesapta "Şifremi unuttum" çalışır ve hesap e-posta duyuru listesine girebilir.
- Kullanıcı adıyla açılıp e-postası bağlanmamış hesaplarda şifre kurtarılamaz (ekranda uyarı yazar).

## Duyurular
- E-posta duyurusu: yalnızca e-postası olan hesaplara gider.
- Site içi duyuru (yönetici paneli): tüm hesaplara ulaşır; rozete göre seçilebilir.
