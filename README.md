# Finance System - Sistem Pencatatan Keuangan

Sistem pencatatan keuangan berbasis web dengan fitur double-entry accounting menggunakan Laravel 11 + React.

## 📋 Deskripsi

Sistem ini adalah aplikasi web untuk mencatat dan mengelola transaksi keuangan dengan konsep akuntansi double-entry. Sistem ini mencakup pengelolaan Chart of Accounts (CoA), pencatatan transaksi journal entry, dan laporan ringkasan keuangan.

## 🏗️ Arsitektur Sistem

### Backend (Laravel 11)

**Pola Desain Backend: Features Based Architecture**

- **Controller Pattern**: Menghandle Seluruh Request dan Response HTTP
- **Service Layer Pattern**: Memisahkan business logic dari controller
- **Repository Pattern**: Abstraksi data access melalui Eloquent
- **Resource Pattern**: Formatting response API yang konsisten
- **Form Request Validation**: Validasi input yang reusable

### Frontend (React)

**Pola Desain Frontend:**

- **Component Composition**: Komponen yang reusable dan composable
- **Custom Hooks**: Logic reusability
- **Service Layer**: Abstraksi API calls
- **React Query**

## 🚀 Cara Menjalankan Sistem

### Prerequisites

- Docker & Docker Compose
- Git

### Setup & Installation

1. **Clone Repository**

```bash
git clone <repository-url>
cd finance-system
```

2. **Setup Backend**

```bash
cd backend
cp .env.example .env
```

Edit seluruh `.env` dan sesuaikan

3. **Start Docker Containers**

### Cara Cepat

```bash
# Dari root directory
./setup.sh
```

### Cara Manual dari sini sampai kebawah

```bash
# Dari root directory
docker compose build

docker compose up
```

Tunggu hingga semua containers running (MySql, Backend, Frontend)

4. **Install Dependencies & Setup Database**

```bash
# Enter backend container
docker exec -it finance_backend bash

# Install dependencies
composer install

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate --seed

# Exit container
exit
```

5. **Access Aplikasi**

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000

## 📝 API Endpoints

### Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout      (protected)
GET    /api/auth/me          (protected)
```

### Accounts

```
GET    /api/accounts                    # List all accounts
POST   /api/accounts                    # Create account
GET    /api/accounts/{id}              # Get account detail
PUT    /api/accounts/{id}              # Update account
DELETE /api/accounts/{id}              # Delete account
GET    /api/accounts/tree              # Get hierarchy tree
GET    /api/accounts/search?q=keyword  # Search accounts
POST   /api/accounts/{id}/toggle       # Toggle active status
GET    /api/accounts/summary           # Get balance summary
```

### Transaction Entries

```
GET    /api/transactions               # List all transactions
POST   /api/transactions               # Create transaction
GET    /api/transactions/{id}          # Get transaction detail
PUT    /api/transactions/{id}          # Update transaction
DELETE /api/transactions/{id}          # Delete transaction
GET    /api/transactions/filter        # Filter transactions
  ?start_date=2024-01-01
  &end_date=2024-12-31
  &account_id=1
  &search=keyword
  &per_page=15
```

## 📄 License

This project is created for technical assignment purposes.

## 👤 Author

[Abdul Wahid]

---
