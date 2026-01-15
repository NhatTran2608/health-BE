# Health Management System - Backend API

## 📋 Giới thiệu
Hệ thống Backend API cho ứng dụng Tư vấn & Quản lý Sức khỏe, được xây dựng với NodeJS, Express và MongoDB.

## 🛠 Công nghệ sử dụng
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB với Mongoose ODM
- **Authentication**: JWT (JSON Web Token)
- **Validation**: express-validator

## 📁 Cấu trúc thư mục

```
backend/
├── src/
│   ├── config/
│   │   └── db.js              # Cấu hình kết nối MongoDB
│   ├── models/
│   │   ├── User.js            # Model người dùng
│   │   ├── HealthRecord.js    # Model hồ sơ sức khỏe
│   │   ├── ChatHistory.js     # Model lịch sử chat
│   │   ├── Reminder.js        # Model nhắc nhở
│   │   └── index.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── healthRecordController.js
│   │   ├── chatbotController.js
│   │   ├── reminderController.js
│   │   ├── reportController.js
│   │   ├── searchController.js
│   │   └── index.js
│   ├── services/
│   │   ├── authService.js
│   │   ├── userService.js
│   │   ├── healthRecordService.js
│   │   ├── chatbotService.js
│   │   ├── reminderService.js
│   │   ├── reportService.js
│   │   ├── searchService.js
│   │   └── index.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   ├── healthRecordRoutes.js
│   │   ├── chatbotRoutes.js
│   │   ├── reminderRoutes.js
│   │   ├── reportRoutes.js
│   │   ├── searchRoutes.js
│   │   └── index.js
│   ├── middlewares/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js    # Xử lý lỗi
│   │   ├── validator.js       # Validation rules
│   │   └── index.js
│   ├── utils/
│   │   ├── jwtHelper.js       # Helpers cho JWT
│   │   ├── responseHelper.js  # Format response
│   │   ├── healthChecker.js   # Kiểm tra chỉ số sức khỏe
│   │   ├── chatbotResponses.js # Câu trả lời chatbot
│   │   └── index.js
│   ├── app.js                 # Cấu hình Express app
│   └── server.js              # Entry point
├── .env                       # Biến môi trường
├── .env.example               # Mẫu biến môi trường
├── package.json
└── README.md
```

## 🚀 Cài đặt và Chạy

### 1. Yêu cầu
- Node.js >= 14.x
- MongoDB >= 4.x
- npm hoặc yarn

### 2. Cài đặt dependencies
```bash
cd backend
npm install
```

### 3. Cấu hình môi trường
Tạo file `.env` từ `.env.example`:
```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/health_management
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development

# Gemini AI API Key (bắt buộc cho tính năng tư vấn sức khỏe)
# Lấy API key từ: https://ai.google.dev/ hoặc https://makersuite.google.com/app/apikey
GEMINI_API_KEY=your_gemini_api_key_here
```

### 4. Chạy ứng dụng
```bash
# Chạy môi trường development (với nodemon)
npm run dev

# Chạy môi trường production
npm start
```

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Tất cả các API (trừ login/register) đều yêu cầu header:
```
Authorization: Bearer <token>
```

---

### 🔐 AUTH APIs

#### Đăng ký
```http
POST /api/auth/register
Content-Type: application/json

{
    "name": "Nguyễn Văn A",
    "email": "nguyenvana@email.com",
    "password": "123456"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Đăng ký thành công",
    "data": {
        "user": {
            "_id": "...",
            "name": "Nguyễn Văn A",
            "email": "nguyenvana@email.com",
            "role": "user"
        },
        "token": "eyJhbGciOiJI..."
    }
}
```

#### Đăng nhập
```http
POST /api/auth/login
Content-Type: application/json

{
    "email": "nguyenvana@email.com",
    "password": "123456"
}
```

#### Lấy thông tin user hiện tại
```http
GET /api/auth/me
Authorization: Bearer <token>
```

---

### 👤 USER APIs

#### Cập nhật profile
```http
PUT /api/users/profile
Authorization: Bearer <token>
Content-Type: application/json

{
    "name": "Nguyễn Văn B",
    "age": 25,
    "gender": "male",
    "height": 170,
    "weight": 65,
    "medicalHistory": "Không có bệnh nền",
    "lifestyle": {
        "diet": "healthy",
        "exercise": "regular",
        "sleep": "good",
        "smoking": false,
        "alcohol": false
    }
}
```

---

### 🏥 HEALTH RECORDS APIs

#### Tạo bản ghi sức khỏe
```http
POST /api/health-records
Authorization: Bearer <token>
Content-Type: application/json

{
    "height": 170,
    "weight": 65,
    "bloodPressure": {
        "systolic": 120,
        "diastolic": 80
    },
    "heartRate": 75,
    "bloodSugar": 95,
    "temperature": 36.5,
    "note": "Sức khỏe bình thường"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Tạo bản ghi sức khỏe thành công",
    "data": {
        "record": { ... },
        "analysis": {
            "bmi": {
                "bmi": 22.5,
                "status": "normal",
                "advice": "Chỉ số BMI của bạn bình thường..."
            },
            "bloodPressure": {
                "status": "normal",
                "advice": "Huyết áp bình thường..."
            },
            "warnings": []
        }
    }
}
```

#### Lấy danh sách bản ghi
```http
GET /api/health-records?page=1&limit=10
Authorization: Bearer <token>
```

#### Lấy bản ghi mới nhất
```http
GET /api/health-records/latest
Authorization: Bearer <token>
```

---

### 🤖 CHATBOT APIs

#### Hỏi chatbot
```http
POST /api/chatbot/ask
Authorization: Bearer <token>
Content-Type: application/json

{
    "question": "Tôi bị stress phải làm sao?"
}
```

**Response:**
```json
{
    "success": true,
    "message": "Thành công",
    "data": {
        "_id": "...",
        "question": "Tôi bị stress phải làm sao?",
        "answer": "Căng thẳng kéo dài có thể ảnh hưởng đến sức khỏe...",
        "category": "stress",
        "detectedKeywords": ["stress"],
        "createdAt": "2024-01-15T10:30:00.000Z"
    }
}
```

#### Lấy lịch sử chat
```http
GET /api/chatbot/history?page=1&limit=20
Authorization: Bearer <token>
```

---

### ⏰ REMINDER APIs

#### Tạo nhắc nhở
```http
POST /api/reminders
Authorization: Bearer <token>
Content-Type: application/json

{
    "title": "Uống thuốc huyết áp",
    "description": "Uống 1 viên sau bữa sáng",
    "type": "medicine",
    "time": "07:30",
    "daysOfWeek": [1, 2, 3, 4, 5],
    "isActive": true
}
```

#### Lấy danh sách nhắc nhở
```http
GET /api/reminders?isActive=true
Authorization: Bearer <token>
```

#### Bật/tắt nhắc nhở
```http
PUT /api/reminders/:id/toggle
Authorization: Bearer <token>
Content-Type: application/json

{
    "isActive": false
}
```

---

### 📊 REPORT APIs

#### Báo cáo sức khỏe (dữ liệu biểu đồ)
```http
GET /api/reports/health?startDate=2024-01-01&endDate=2024-12-31
Authorization: Bearer <token>
```

**Response:**
```json
{
    "success": true,
    "data": {
        "chartData": {
            "weight": [
                { "date": "2024-01-15", "value": 65 },
                { "date": "2024-01-22", "value": 64.5 }
            ],
            "bmi": [...],
            "bloodPressure": [...],
            "heartRate": [...]
        },
        "stats": {
            "totalRecords": 10,
            "weight": { "min": 64, "max": 66, "avg": 65 }
        }
    }
}
```

#### Báo cáo chatbot
```http
GET /api/reports/chatbot
Authorization: Bearer <token>
```

#### Dashboard tổng quan
```http
GET /api/reports/dashboard
Authorization: Bearer <token>
```

---

### 🔍 SEARCH APIs

#### Tìm kiếm
```http
GET /api/search?keyword=stress&type=all
Authorization: Bearer <token>
```

---

## 🔒 Error Responses

Tất cả lỗi đều có format:
```json
{
    "success": false,
    "message": "Mô tả lỗi"
}
```

Các HTTP Status Code phổ biến:
- `200` - Thành công
- `201` - Tạo mới thành công
- `400` - Bad Request (dữ liệu không hợp lệ)
- `401` - Unauthorized (chưa đăng nhập hoặc token hết hạn)
- `403` - Forbidden (không có quyền)
- `404` - Not Found
- `500` - Server Error

---

## 👨‍💻 Tác giả
Đồ án sinh viên - Hệ thống Tư vấn & Quản lý Sức khỏe

## 📝 License
ISC
#   h e a l t h - B E 
 
 