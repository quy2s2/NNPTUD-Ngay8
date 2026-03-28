# NNPTUD - Ngày 8

**Phạm Phú Quý - 24800600803**

## Mô tả
Bài tập thực hành Nhập môn phát triển ứng dụng - Buổi 8.  
Ứng dụng Node.js + Express + MongoDB với chức năng **import users hàng loạt** và **gửi email thông báo tài khoản qua Mailtrap**.

## Chức năng chính
- Import danh sách user từ file JSON (username, email)
- Tự động gán role `USER`
- Tự động gen password ngẫu nhiên 16 ký tự
- Gửi email thông báo tài khoản (username + password) qua **Mailtrap SMTP**

## Cài đặt

```bash
npm install
```

## Seed dữ liệu (tạo roles)

```bash
node seed.js
```

## Import users và gửi email

```bash
node cli_import.js users_import.json
```

Hoặc chỉ import 5 user để test:

```bash
node cli_import.js users_import_5.json
```

## Cấu trúc project

```
├── controllers/
│   └── users.js          # Logic import users, gen password, gửi email
├── schemas/
│   ├── users.js          # User model (username, password, email, role...)
│   └── roles.js          # Role model
├── utils/
│   └── mailHandler.js    # Gửi email qua Mailtrap SMTP
├── routes/
│   └── users.js          # API routes
├── cli_import.js          # Script CLI import users từ file JSON
├── seed.js                # Seed roles (ADMIN, USER)
├── users_import.json      # File import 100 users
├── users_import_5.json    # File import 5 users (test)
└── package.json
```

## Công nghệ sử dụng
- **Node.js** + **Express**
- **MongoDB** + **Mongoose**
- **Nodemailer** + **Mailtrap** (SMTP sandbox)
- **bcrypt** (hash password)
- **crypto** (gen random password)