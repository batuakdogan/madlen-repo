

# Madlen Case Study 
Bu repository Madlen Case Study uygulaması için backend ve frontend kodlarını barındırır.

## Projenin Amacı

Uygulamanın temel amacı, kullanıcıların farklı yapay zeka modelleri arasından seçim yaparak sohbet edebileceği, modern ve performanslı bir altyapı oluşturmaktır. Proje, sohbet geçmişini yönetme ve sistem performansını izleme gibi temel özellikleri barındırır.

## Teknik Seçimler ve Nedenleri

*   **Backend (Express.js & TypeScript):** Bu projenin hızlı ve hafif olması hedeflendi. Büyük framework'ler yerine (Spring Boot, Django) Express.js'in minimalist yapısı tercih edildi. TypeScript kullanımı ise, özellikle frontend ile aynı dilde geliştirme yaparken uçtan uca tip güvenliği sağlayarak hata olasılığını azalttı.
*   Backend tarafında, Express.js'in temel yeteneklerini endüstri standardı kütüphanelerle zenginleştirdik. Harici API'lerle (OpenRouter gibi) iletişim kurmak için axios'u HTTP istemcisi olarak kullandık. Güvenlik katmanında, API anahtarı gibi hassas bilgileri koddan ayırmak için dotenv'den yararlanırken, frontend'den gelen isteklerin güvenli bir şekilde kabul edilmesi için cors middleware'ini entegre ettik. Geliştirici deneyimini ve test edilebilirliği artırmak amacıyla, swagger-ui-express ve swagger-jsdoc paketleriyle otomatik ve interaktif bir API dokümantasyon sayfası (/api-docs) oluşturduk. Uygulama mantığı tarafında, her sohbet oturumuna benzersiz kimlikler atamak için uuid kütüphanesini kullandık. Son olarak, projenin gözlemlenebilirliğini sağlamak için @opentelemetry/... paketlerini kullanarak tüm sistemin performansını izleyip bu verileri Jaeger'a gönderdik.
*   Projenin backend'i, temiz ve ölçeklenebilir bir Katmanlı Mimari kullanılarak tasarlanmıştır. Bu yapı, kodun bakımını, test edilebilirliğini ve anlaşılırlığını artırır.

İstek akışı aşağıdaki gibi işler:

**Rota Katmanı (`/routes`) → Controller Katmanı (`/controllers`) → Servis Katmanı (`/services`)**

*   **Frontend (React & Vite & TypeScript):** React, en popüler frontend frameworklerinden birisi olduğu için tercih edildi. Geliştirme sürecini hızlandırmak için Vite tercih edildi. Frontend'de state yönetimi için, projenin ölçeğine en uygun çözüm olan React'in kendi yerleşik hook'larını (useState, useEffect) kullandık. Harici bir kütüphaneye gerek duymadık.
*   Backend apimiz ile iletişim kurmak için Axios kullandık.
*   Open Routuer'dan seçtiğim modeller, Türkçe dilinde kararlı cevaplar veremedikleri için uygulamanın arayüzünü ingilizce olarak tasarladım. 

*   **Gözlemlenebilirlik (OpenTelemetry & Jaeger):** Uygulama performansını analiz edebilmek için case-study gereksinimlerinde OpenTelemetry istendi ve projeye entegre edildi. Jaeger ise, toplanan verileri görselleştirmek için bir arayüz sundu.

## Projeyi Yerel Makinede Çalıştırma

Projeyi çalıştırmak için makinenizde **Node.js**, **npm** ve **Docker Desktop** kurulu olmalıdır.

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/batuakdogan/madlen-repo.git
cd madlen-case-study
```

### 2. Jaeger'ı Başlatın (Docker ile)
Performans takibi için Jaeger servisini başlatın.
```bash
# Ana proje klasöründeyken çalıştırın
docker-compose up -d
```

### 3. Backend'i Başlatın (Yeni Terminalde)
```bash
# Backend klasörüne gidin
cd madlen-case-study-api

# Bağımlılıkları yükleyin
npm install

# .env dosyasını oluşturun ve kendi API anahtarınızı girin
# Bu dosyayı kopyalayıp .env olarak adlandırın (`cp .env.example .env`)
# ve ardından kendi OpenRouter API anahtarınızı girin.

# --- ZORUNLU ALANLAR ---

# OpenRouter.ai sitesinden alacağınız API anahtarınız.
OPENROUTER_API_KEY="YOUR_API_KEY_HERE"


# --- OPSİYONEL AYARLAR ---

# API sunucusunun çalışacağı port. Belirtilmezse 8000 kullanılır.
PORT=8000

# OpenRouter'da çalışan, test edilmiş modeller:
# - meta-llama/llama-3.2-3b-instruct:free (VARSAYILAN - Hızlı, genel sohbet)
# - google/gemma-2-9b-it:free (İleri düzey mantık, yaratıcı görevler)

# Arayüzden bir model seçilmediğinde varsayılan olarak kullanılacak model.
OPENROUTER_MODEL="meta-llama/llama-3.2-3b-instruct:free"
cp .env.example .env
# nano .env veya başka bir editörle dosyayı düzenleyin

# Sunucuyu başlatın
npm run dev
```
### 4. Örnek .env içeriği
```bash
OPENROUTER_API_KEY="KEY"
PORT=8000

# Available verified working models on OpenRouter:
# - meta-llama/llama-3.2-3b-instruct:free (DEFAULT - Fast, general conversation)
# - google/gemma-2-9b-it:free (Advanced reasoning, creative tasks)
OPENROUTER_MODEL="meta-llama/llama-3.2-3b-instruct:free"
```

Backend `http://localhost:8000` adresinde çalışmaya başlayacaktır.

### 5. Frontend'i Başlatın (Yeni Terminalde)
```bash
# Frontend klasörüne gidin
cd madlen-case-study-frontend

# Bağımlılıkları yükleyin
npm install

# Arayüzü başlatın
npm run dev
```
Frontend, terminalde belirtilen adreste (genellikle `http://localhost:5173`) açılacaktır.

## Jaeger Arayüzü ve Performans Takibi

Uygulama çalışırken performans verilerini (trace'leri) izleyebilirsiniz:

1.  **Arayüze Erişin:** Tarayıcınızda `http://localhost:16686` adresine gidin.
2.  **Servisi Seçin:** Sol menüdeki "Service" açılır listesinden `unknown_service:ts-node-dev` (veya benzeri) seçeneğini seçin.
3.  **İzleri Bulun:** "Find Traces" butonuna tıklayın.
4.  **Analiz Edin:** Ekranda, API'nize yapılan isteklerin bir listesini göreceksiniz. Bir isteğe tıklayarak, o isteğin ne kadar sürdüğünü ve hangi adımlarda ne kadar zaman harcadığını gösteren detaylı zaman çizelgesini inceleyebilirsiniz.
````
