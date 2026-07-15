## 🏗️ โครงสร้างโปรเจกต์ (Project Structure)

```text
├── README.md                           # คู่มือการติดตั้งและอธิบายการทำงานของระบบ
├── HOW_TO_CREATE.md                    # คู่มือขั้นตอนการเขียนโค้ดและพัฒนาฟีเจอร์อย่างละเอียด
├── docker-compose.yml                  # คอนฟิกสำหรับรัน MS SQL Server 2022 ใน Docker
│
├── clientApp/                          # [หน้าบ้าน - Angular Application]
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/
│   │   │   │   └── approval-task-list/ # โฟลเดอร์เก็บโค้ด HTML, CSS, TS ของตารางอนุมัติ
│   │   │   ├── models/                 # โมเดลประเภทข้อมูล (Data models & interfaces)
│   │   │   ├── services/               # คลาสดึงข้อมูลผ่าน HTTP (ApprovalService)
│   │   │   ├── app.ts                  # Root Component Logic
│   │   │   ├── app.html                # Root Component Template
│   │   │   ├── app.css                 # สไตล์ชีตหลักของ Root Component
│   │   │   ├── app.routes.ts           # เส้นทาง Routing ของแอปพลิเคชัน
│   │   │   └── app.config.ts           # การตั้งค่าแอปพลิเคชัน (HttpClient, Routing)
│   │   ├── public/
│   │   ├── index.html                  # HTML หลักของ Angular
│   │   ├── main.ts                     # จุดเริ่มรัน Angular
│   │   └── styles.css                  # CSS ตกแต่งหลักและดีไซน์ธีมระบบ (Global Styles)
│   ├── angular.json                    # ไฟล์ตั้งค่า Angular CLI (ขยาย Style Budget เพื่อรองรับ UI)
│   ├── package.json                    # Dependencies ของแอป
│   └── tsconfig.json                   # การตั้งค่าคอมไพเลอร์ TypeScript
│
└── webApi/                             # [หลังบ้าน - .NET 8 Web API Solution]
    ├── ApprovalTask.sln                # ไฟล์ Solution สำหรับมัดรวมทุกโปรเจกต์
    │
    ├── ApprovalTask.API/               # [Presentation Layer] จัดการส่วน Http Controller & Routing
    │   ├── Controllers/                # Controllers สำหรับคอยรับคำขอ API
    │   ├── Program.cs                  # จุดเริ่มต้น API, ลงทะเบียน DI และวางสแต็ค Middleware
    │   └── appsettings.json            # ไฟล์ตั้งค่าระบบ (SQL Connection String)
    │
    ├── ApprovalTask.Core/              # [Domain Layer] เก็บแกนหลัก business logic & entity
    │   ├── Commands/                   # Command & Handlers (ApprovalCommand, Handler)
    │   ├── Entities/                   # Model ตัวแทนข้อมูลใน DB (ApprovalRequest)
    │   └── Enums/                      # Enums สถานะคำขอ (ApprovalStatus)
    │
    └── ApprovalTask.Infrastructure/    # [Infrastructure Layer] การเข้าถึงข้อมูลจริง
        ├── Data/
        │   └── AppDbContext.cs         # EF Core Database Context
        └── Repositories/               # คลาสเข้าถึงตารางฐานข้อมูลจริง
```

---

## 🛠️ สิ่งที่จำเป็นต้องมีก่อนเริ่มใช้งาน (Prerequisites)

* [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
* [Node.js (v18+)](https://nodejs.org/) & [npm](https://www.npmjs.com/)
* [Docker Desktop](https://www.docker.com/) สำหรับรัน MS SQL Server

---

## 🚀 วิธีเปิดรันระบบ (How to Run)

โปรเจกต์นี้รองรับการรัน 2 รูปแบบ คุณสามารถเลือกวิธีที่สะดวกที่สุดได้เลยครับ:

### วิธีที่ 1: รันด้วย Docker Compose (แนะนำ 🌟)
วิธีที่ง่ายและรวดเร็วที่สุด ระบบจะเตรียมฐานข้อมูล, สร้างตาราง, เติมข้อมูลจำลอง (Make Data) และรันทั้ง Frontend / Backend ให้อัตโนมัติในคำสั่งเดียว

1. เปิด Terminal ที่โฟลเดอร์หลักของโปรเจกต์
2. รันคำสั่งนี้:
   ```bash
   docker compose up -d --build
   ```
3. เข้าใช้งานได้ทันที:
   * 🌐 **หน้าเว็บหลัก (Frontend):** [http://localhost](http://localhost)
   * ⚙️ **API Backend (Swagger):** [http://localhost:9002/swagger](http://localhost:9002/swagger)

*(ดูรายละเอียดเพิ่มเติมเกี่ยวกับการทำงานของ Docker ได้ที่ไฟล์ [how_to_run_with_docker.md](how_to_run_with_docker.md))*

---

### วิธีที่ 2: รันแบบนักพัฒนา (Local Development)
สำหรับกรณีที่คุณต้องการแก้ไขโค้ดและรันแบบปกติ

#### 1. เปิดเฉพาะ Database (MS SQL Server)
```bash
docker compose up -d sqlserver
```
*(รหัสผ่านบัญชี `sa` คือ `myApp@Pass123`)*

#### 2. เปิดระบบหลังบ้าน (Backend API)
```bash
cd webApi
dotnet run --project ApprovalTask.API/
```
*(หมายเหตุ: ระบบจะทำการสร้างฐานข้อมูลและเพิ่มข้อมูลจำลองให้โดยอัตโนมัติเมื่อเริ่มรันโปรแกรมครั้งแรก)*
* ทดสอบ API (Swagger): [http://localhost:9002/swagger](http://localhost:9002/swagger)

#### 3. เปิดระบบหน้าบ้าน (Frontend Angular)
เปิด Terminal แท็บใหม่แล้วรันคำสั่ง:
```bash
cd clientApp
npm install
npm start
```
* เข้าใช้งานหน้าเว็บสำหรับพัฒนาที่: **[http://localhost:4200](http://localhost:4200)**

---

## 🧪 การตรวจสอบด้วย Unit Tests

คำสั่งสำหรับตรวจสอบตรรกะระบบในชุด xUnit Tests ของฝั่ง Backend:
```bash
cd webApi
dotnet test ApprovalTask.sln
```