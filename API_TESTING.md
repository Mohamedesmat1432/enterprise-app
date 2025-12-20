# Enterprise App API Testing Guide

This guide provides `curl.exe` commands to test the various endpoints of the Enterprise Application.

## Environment Variables
The following variables are used in the examples:
- `BASE_URL`: `http://localhost:3000/v1`
- `TOKEN`: The JWT token obtained after login.

---

## 1. Public Endpoints

### Hello World
```bash
curl.exe -X GET "http://localhost:3000/v1"
```

---

## 2. Authentication

### User Registration
```bash
curl.exe -X POST "http://localhost:3000/v1/auth/register" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"John Doe\", \"email\": \"john@example.com\", \"age\": 25, \"password\": \"StrongP@ss123!\"}"
```

### Login (Obtain Token)
```bash
curl.exe -X POST "http://localhost:3000/v1/auth/login" ^
  -H "Content-Type: application/json" ^
  -d "{\"email\": \"admin@example.com\", \"password\": \"Admin@123!\"}"
```
> [!TIP]
> Copy the `access_token` from the response and use it in the following commands.

### Switch Company
```bash
curl.exe -X POST "http://localhost:3000/v1/auth/switch-company" ^
  -H "Authorization: Bearer <YOUR_TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"companyId\": \"<COMPANY_UUID>\"}"
```

---

## 3. User Management

### Get All Users
```bash
curl.exe -X GET "http://localhost:3000/v1/users" ^
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Get User by ID
```bash
curl.exe -X GET "http://localhost:3000/v1/users/<USER_ID>" ^
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Create User
```bash
curl.exe -X POST "http://localhost:3000/v1/users" ^
  -H "Authorization: Bearer <YOUR_TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"New User\", \"email\": \"newuser@example.com\", \"age\": 30, \"password\": \"User@123!\"}"
```

### Change Password
```bash
curl.exe -X POST "http://localhost:3000/v1/users/me/change-password" ^
  -H "Authorization: Bearer <YOUR_TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"oldPassword\": \"Admin@123!\", \"newPassword\": \"NewAdmin@123!\"}"
```

---

## 4. Roles & Permissions

### Get All Roles
```bash
curl.exe -X GET "http://localhost:3000/v1/roles" ^
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Create Role
```bash
curl.exe -X POST "http://localhost:3000/v1/roles" ^
  -H "Authorization: Bearer <YOUR_TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"name\": \"Manager\", \"description\": \"Manager Role\"}"
```

### Assign Permission to Role
```bash
curl.exe -X POST "http://localhost:3000/v1/roles/<ROLE_ID>/permissions" ^
  -H "Authorization: Bearer <YOUR_TOKEN>" ^
  -H "Content-Type: application/json" ^
  -d "{\"permissionSlug\": \"read.users\"}"
```

---

## 5. Inventory & Products

### Get All Warehouses
```bash
curl.exe -X GET "http://localhost:3000/v1/inventory/warehouses" ^
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Get Inventory Levels
```bash
curl.exe -X GET "http://localhost:3000/v1/inventory/quants" ^
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Get All Products
```bash
curl.exe -X GET "http://localhost:3000/v1/products" ^
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

---

## 6. Dashboard & Reports

### Get Dashboard Stats
```bash
curl.exe -X GET "http://localhost:3000/v1/dashboard/stats" ^
  -H "Authorization: Bearer <YOUR_TOKEN>"
```

### Get Profit & Loss Report
```bash
curl.exe -X GET "http://localhost:3000/v1/dashboard/reports/pl?startDate=2025-01-01&endDate=2025-12-31" ^
  -H "Authorization: Bearer <YOUR_TOKEN>"
```
