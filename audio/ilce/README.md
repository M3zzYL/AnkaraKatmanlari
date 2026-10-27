# İlçe sesli anlatımları

Kayıtlı ses dosyası eklemek için:
1. MP3 dosyasını bu klasöre koyun (örn. `beypazari.mp3`).
2. `data/ankara.json` içinde ilgili ilçenin `anlatim.ses` alanına yolu yazın: `"ses": "audio/ilce/beypazari.mp3"`.

Ses alanı boşsa anlatım, cihazın Türkçe sesiyle `anlatim.metin` + sitedeki verilerden üretilen kapanış cümlesinden okunur.
Ses dosyası bulunamazsa oynatıcı yine otomatik olarak sesli okumaya geçer.
