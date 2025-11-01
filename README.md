
# Madlen Case Study
Bu repository Madlen Case Study uygulaması için backend ve frontend kodlarını barındırır.

## Projenin Amacı

Uygulamanın temel amacı, kullanıcıların farklı yapay zeka modelleri arasından seçim yaparak sohbet edebileceği, modern ve performanslı bir altyapı oluşturmaktır. Proje, sohbet geçmişini yönetme ve sistem performansını izleme gibi temel özellikleri barındırır.

## Teknik Seçimler ve Nedenleri

*   **Backend (Express.js & TypeScript):** Bu projenin hızlı ve hafif olması hedeflendi. Büyük framework'ler yerine (Spring Boot, Django) Express.js'in minimalist yapısı tercih edildi. TypeScript kullanımı, uçtan uca tip güvenliği sağlayarak hata olasılığını azalttı.
    *   **Mimari:** Projenin backend'i, temiz ve ölçeklenebilir bir **Katmanlı Mimari** (`Rota → Controller → Servis`) kullanılarak tasarlanmıştır. Bu yapı, kodun bakımını ve test edilebilirliğini artırır.
    *   **Kütüphaneler:** Express'in temel yetenekleri; `axios` (API iletişimi), `dotenv` (güvenlik), `cors` (güvenlik), `swagger` (dokümantasyon), `uuid` (ID yönetimi) ve `@opentelemetry` (performans takibi) gibi endüstri standardı kütüphanelerle zenginleştirildi.

*   **Frontend (React & Vite & TypeScript):** React, en popüler frontend kütüphanelerinden biri olduğu için tercih edildi. Geliştirme sürecini hızlandırmak için **Vite** kullanıldı. State yönetimi için React'in kendi yerleşik hook'ları (`useState`, `useEffect`) yeterli görüldü. Backend API'si ile iletişim için **Axios** kullanıldı.

*   **Gözlemlenebilirlik (OpenTelemetry & Jaeger):** Case study gereksinimleri doğrultusunda, uygulama performansı **OpenTelemetry** ile izlenip, **Docker** üzerinde çalışan **Jaeger** arayüzünde görselleştirildi.

## Projeyi Yerel Makinede Çalıştırma

Projeyi çalıştırmak için makinenizde **Node.js**, **npm** ve **Docker Desktop** kurulu olmalıdır.

### 1. Projeyi Klonlayın
```bash
git clone https://github.com/batuakdogan/madlen-repo.git
cd madlen-case-study
```

### 2. Jaeger'ı Başlatın (Docker ile)
Performans takibi için Jaeger servisini başlatın. Bu komut, `api` klasörü içindeki `docker-compose.yml` dosyasını kullanır.
```bash
# Backend (api) klasörüne girin
cd madlen-case-study-api

# Jaeger servisini arka planda başlatın
docker-compose up -d
```

### 3. Backend'i Başlatın (Yeni Bir Terminalde)

**a. Kurulum:**
```bash
# Backend klasörüne gidin
cd madlen-case-study-api

# Bağımlılıkları yükleyin
npm install
```

**b. API Anahtarını Ayarlama:**
Backend'in çalışması için bir `.env` dosyası oluşturmanız ve içine OpenRouter API anahtarınızı eklemeniz gerekmektedir.

Aşağıdaki komutla `api` klasörünün içinde boş bir `.env` dosyası oluşturun:
```bash
# macOS / Linux için
touch .env

# Windows için
echo. > .env
```
Şimdi, yeni oluşturduğunuz bu `.env` dosyasını bir metin editörü ile açın ve aşağıdaki içeriği içine yapıştırın. `YOUR_API_KEY_HERE` yazan yeri kendi OpenRouter API anahtarınızla değiştirmeyi unutmayın.

```ini
# --- .env dosyasının içeriği ---

OPENROUTER_API_KEY="YOUR_API_KEY_HERE"
PORT=8000
OPENROUTER_MODEL="meta-llama/llama-3.2-3b-instruct:free"
```

**c. Sunucuyu Başlatma:**
```bash
# Sunucuyu geliştirme modunda başlatın
npm run dev
```
Backend `http://localhost:8000` adresinde çalışmaya başlayacaktır.

### 4. Frontend'i Başlatın (Yeni Bir Terminalde)
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
```
