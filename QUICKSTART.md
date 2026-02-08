# 🚀 Quick Start Guide

Panduan cepat untuk menjalankan Finance System dalam 5 menit!

## Prerequisites

- ✅ Docker Desktop installed
- ✅ Git installed
- ✅ 4GB RAM minimum
- ✅ 5GB disk space

## Step-by-Step Setup

### 1️⃣ Clone Repository

```bash
git clone <your-repository-url>
cd finance-system
```

### 2️⃣ Run Setup Script

**Linux/Mac:**
```bash
chmod +x setup.sh
./setup.sh
```

**Windows (Git Bash):**
```bash
bash setup.sh
```

**Manual Setup (jika script tidak jalan):**
```bash
# Copy environment file
cp backend/.env.example backend/.env

# Start Docker containers
docker-compose up -d

# Wait 10 seconds for PostgreSQL to initialize
sleep 10

# Install backend dependencies
docker exec -it finance_backend composer install

# Generate Laravel key
docker exec -it finance_backend php artisan key:generate

# Run migrations
docker exec -it finance_backend php artisan migrate
```

### 3️⃣ Access Application

- 🌐 **Frontend**: http://localhost:5173
- 🔧 **Backend API**: http://localhost:8000
- 🗄️ **Database**: localhost:5432

### 4️⃣ Create First Account

1. Open http://localhost:5173
2. Click "Sign up" (or "Register")
3. Fill in your details:
   - Name: Your Name
   - Email: you@example.com
   - Password: password123
   - Confirm Password: password123
4. Click "Sign Up"

You'll be automatically logged in!

### 5️⃣ Test the System

#### Create Accounts

1. Go to "Accounts" menu
2. Click "Add Account"
3. Create these accounts:

**Asset Accounts:**
- Name: "Cash", Type: Asset
- Name: "Bank", Type: Asset

**Equity Account:**
- Name: "Capital", Type: Equity

**Revenue Account:**
- Name: "Sales", Type: Revenue

**Expense Account:**
- Name: "Rent Expense", Type: Expense

#### Create Journal Entry (Double-Entry)

1. Go to "Journal" menu
2. Click "New Entry"
3. Fill in:
   - Date: Today
   - Description: "Initial capital investment"
   
4. Add Lines:
   - **Line 1 (Debit):**
     - Account: Cash
     - Type: Debit
     - Amount: 10000000
   
   - **Line 2 (Credit):**
     - Account: Capital
     - Type: Credit
     - Amount: 10000000

5. Click "Save"

✅ You'll see the entry is balanced and accounts are updated!

#### View Financial Summary

1. Go to "Dashboard"
2. See your financial summary:
   - Total Assets: Rp 10,000,000
   - Total Equity: Rp 10,000,000
   - Net Income: Rp 0

## 🎯 Understanding the System

### Account Types

| Type | Normal Balance | Examples |
|------|----------------|----------|
| Asset | Debit | Cash, Bank, Inventory |
| Expense | Debit | Rent, Salary, Utilities |
| Liability | Credit | Accounts Payable, Loan |
| Equity | Credit | Capital, Retained Earnings |
| Revenue | Credit | Sales, Service Income |

### Double-Entry Rules

**Every transaction must have:**
- ✅ At least 2 lines (minimum 1 debit + 1 credit)
- ✅ Total debits = Total credits
- ✅ Valid account selection

**Example Transactions:**

1. **Receive Cash Investment**
   - Debit: Cash (Asset) +10M
   - Credit: Capital (Equity) +10M

2. **Pay Rent**
   - Debit: Rent Expense (Expense) +1M
   - Credit: Cash (Asset) -1M

3. **Make Sale**
   - Debit: Cash (Asset) +5M
   - Credit: Sales (Revenue) +5M

### Account Code Generation

Codes are auto-generated based on type:
- **1xxxx**: Asset accounts
- **2xxxx**: Liability accounts
- **3xxxx**: Equity accounts
- **4xxxx**: Revenue accounts
- **5xxxx**: Expense accounts

**Hierarchy Example:**
```
10001 - Current Assets (parent)
  └─ 10001-001 - Cash (child)
  └─ 10001-002 - Bank (child)
```

## 🔧 Useful Commands

### Docker Management

```bash
# Start containers
docker-compose up -d

# Stop containers
docker-compose down

# View logs
docker-compose logs -f

# Restart specific service
docker-compose restart backend
```

### Backend Commands

```bash
# Enter backend container
docker exec -it finance_backend bash

# Run migrations
php artisan migrate

# Rollback last migration
php artisan migrate:rollback

# Fresh database
php artisan migrate:fresh

# Clear cache
php artisan cache:clear
php artisan config:clear
```

### Frontend Commands

```bash
# Enter frontend container
docker exec -it finance_frontend sh

# Install new package
npm install <package-name>

# Build for production
npm run build
```

### Database Access

```bash
# Access PostgreSQL
docker exec -it finance_postgres psql -U finance_user -d finance_db

# Useful SQL commands
\dt                    # List tables
\d accounts           # Describe accounts table
SELECT * FROM users;  # Query data
\q                    # Quit
```

## 🐛 Troubleshooting

### Containers won't start
```bash
docker-compose down -v
docker-compose up -d --build
```

### Database connection error
```bash
# Check if PostgreSQL is ready
docker-compose ps
docker-compose logs postgres
```

### Port already in use
```bash
# Check what's using the port
# Windows:
netstat -ano | findstr :5173

# Linux/Mac:
lsof -i :5173

# Kill the process or change port in docker-compose.yml
```

### Frontend can't connect to backend
1. Check `frontend/.env` - VITE_API_URL should be http://localhost:8000
2. Check backend CORS config
3. Clear browser cache

### Permission errors in Laravel
```bash
docker exec -it finance_backend bash
chmod -R 775 storage bootstrap/cache
chown -R www-data:www-data storage bootstrap/cache
```

## 📊 Test Scenarios

### Scenario 1: Starting a Business

```
1. Owner invests Rp 50,000,000 cash
   DR: Cash           50,000,000
   CR: Capital        50,000,000

2. Buy equipment for Rp 15,000,000
   DR: Equipment      15,000,000
   CR: Cash           15,000,000

3. Pay rent Rp 2,000,000
   DR: Rent Expense    2,000,000
   CR: Cash            2,000,000

4. Make sales Rp 10,000,000
   DR: Cash           10,000,000
   CR: Sales          10,000,000

Result:
- Cash: 43,000,000
- Equipment: 15,000,000
- Capital: 50,000,000
- Sales: 10,000,000
- Rent Expense: 2,000,000
- Net Income: 8,000,000
```

### Scenario 2: Monthly Operations

Try creating transactions for:
- Salary payment
- Utility bills
- Loan repayment
- Customer payments
- Supplier purchases

## 🎓 Learning Resources

### Accounting Basics
- [Double-Entry Bookkeeping](https://www.accountingtools.com/articles/what-is-double-entry-bookkeeping.html)
- [Chart of Accounts](https://www.investopedia.com/terms/c/chart-accounts.asp)
- [Debit vs Credit](https://www.accountingcoach.com/debits-and-credits/explanation)

### Technical Documentation
- [Laravel Docs](https://laravel.com/docs)
- [React Docs](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs)
- [Docker Docs](https://docs.docker.com)

## ✅ Checklist untuk Assignment

Sebelum submit, pastikan:
- [ ] Sistem bisa dijalankan dengan `./setup.sh`
- [ ] Bisa register user baru
- [ ] Bisa create semua tipe akun
- [ ] Bisa create journal entry (double-entry balanced)
- [ ] Bisa filter transaksi
- [ ] Bisa lihat financial summary
- [ ] Parent-child hierarchy berfungsi
- [ ] Auto-generated codes bekerja

## 🎉 Next Steps

Setelah sistem berjalan:

1. **Explore Features**
   - Create berbagai tipe akun
   - Buat transaksi kompleks
   - Gunakan filter
   - Lihat account hierarchy

2. **Understand Code**
   - Baca ARCHITECTURE.md
   - Explore service layer
   - Check validation rules
   - Review database transactions

3. **Customize**
   - Ubah theme/colors (Tailwind)
   - Add new features
   - Improve UI/UX
   - Add unit tests

---

**Selamat mencoba! Jika ada pertanyaan, baca dokumentasi lengkap di README.md dan ARCHITECTURE.md**

🚀 Happy Coding!
