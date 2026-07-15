## 🏗️ โครงสร้างโปรเจกต์ (Project Structure)

```text
├── README.md                           # คู่มือการติดตั้งและอธิบายการทำงานของระบบ
├── docker-compose.yml                  # คอนฟิกูเรชันสำหรับรัน MS SQL Server 2022 คอนเทนเนอร์
│
├── clientApp/                          # [หน้าบ้าน - Angular Application]
│   ├── src/
│   │   ├── app/                        # โฟลเดอร์หลักสำหรับส่วนประกอบของแอป
│   │   │   ├── app.ts                  # Root Component Logic (ตัวควบคุมการทำงาน)
│   │   │   ├── app.html                # Root Component Template (หน้าตาของเว็บ)
│   │   │   ├── app.css                 # สไตล์ชีตของ Root Component
│   │   │   ├── app.config.ts           # การตั้งค่าแอปพลิเคชัน (เช่น การเปิดใช้งาน HttpClient, Router)
│   │   │   ├── app.routes.ts           # หน้าเส้นทางของแอปพลิเคชัน (Routing)
│   │   │   └── app.spec.ts             # ไฟล์ทดสอบย่อยสำหรับ Component
│   │   ├── public/                     # ที่เก็บไฟล์ Static Assets (เช่น favicon, รูปภาพ)
│   │   ├── index.html                  # ไฟล์ HTML หลักที่เป็นจุดเริ่มต้นการแสดงผล
│   │   ├── main.ts                     # จุดเริ่มต้นของการรันแอปพลิเคชัน Angular
│   │   └── styles.css                  # ไฟล์ CSS หลักสำหรับตกแต่งแอปพลิเคชันทั่วทั้งระบบ (Global Styles)
│   ├── angular.json                    # ไฟล์ตั้งค่าสำหรับ Angular CLI (เช่น สไตล์, สคริปต์, การ Build)
│   ├── package.json                    # รายชื่อไลบรารี Dependencies และสคริปต์สั่งรันระบบ
│   └── tsconfig.json                   # การกำหนดค่าสำหรับคอมไพเลอร์ TypeScript
│
└── webApi/                             # [หลังบ้าน - .NET 8 Web API Solution]
    ├── ApprovalTask.sln                # ไฟล์ Solution สำหรับมัดรวมทุกโปรเจกต์ของระบบเข้าด้วยกัน
    │
    ├── ApprovalTask.API/               # [Presentation Layer] ทำหน้าที่คอยรับส่งข้อมูลทาง HTTP
    │   ├── Controllers/                # โฟลเดอร์เก็บไฟล์ Controller เพื่อรับคำร้องเรียนจากภายนอก (API Endpoints)
    │   ├── Properties/
    │   │   └── launchSettings.json     # คอนฟิกการเปิดพอร์ตและการรันโปรเจกต์ยามพัฒนา (Development Settings)
    │   ├── appsettings.json            # ไฟล์ตั้งค่าคอนฟิก (Connection Strings, Logging)
    │   ├── appsettings.Development.json
    │   ├── Program.cs                  # จุดเริ่มต้นของการรัน API, ตั้งค่า Services (DI) และ Middlewares
    │   └── ApprovalTask.API.csproj
    │
    ├── ApprovalTask.Core/              # [Domain Layer] แกนกลางตรรกะทางธุรกิจ (ห้ามนำเข้าไลบรารีภายนอก)
    │   ├── Commands/                   # คลาสเก็บคำสั่งและตรรกะการทำงาน (ApprovalCommand, ApprovalCommandHandler)
    │   ├── Entities/                   # คลาสตัวแทนข้อมูลในระบบที่เกี่ยวข้องกับธุรกิจ (Domain Entities)
    │   ├── Enums/                      # ตัวแปรระบุประเภทสถานะการทำงาน (เช่น ApprovalStatus)
    │   ├── Interfaces/                 # อินเตอร์เฟซข้อตกลงในการเข้าถึงฐานข้อมูลและการทำงานอื่น ๆ (Repository Abstractions)
    │   └── ApprovalTask.Core.csproj
    │
    ├── ApprovalTask.Infrastructure/    # [Infrastructure Layer] ทำหน้าที่เชื่อมประสานฐานข้อมูลและบริการภายนอก
    │   ├── Data/
    │   │   └── AppDbContext.cs         # ตัวจัดการการเชื่อมต่อตารางของ EF Core
    │   ├── Repositories/               # ไฟล์อิมพลีเมนต์คำสั่งเข้าถึงฐานข้อมูล (Implementation of Repositories)
    │   └── ApprovalTask.Infrastructure.csproj
    │
    └── ApprovalTask.Tests/             # [Test Layer] รวบรวมเทสเคสเพื่อตรวจสอบความถูกต้องของระบบ
        ├── SampleTests.cs              # คลาสทดสอบการรันชุดเทสเคสเริ่มต้น (xUnit Tests)
        └── ApprovalTask.Tests.csproj
```

---

## 🛠️ สิ่งที่จำเป็นต้องมีก่อนเริ่มใช้งาน (Prerequisites)

ตรวจสอบการติดตั้งเครื่องมือต่าง ๆ บนเครื่องคอมพิวเตอร์ของคุณดังนี้:
- [.NET 8.0 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)
- [Node.js (v18+)](https://nodejs.org/) & [npm](https://www.npmjs.com/)
- [Docker & Docker Compose](https://www.docker.com/)

---

## 🚀 วิธีรันระบบ (How to Run)

ทำตามขั้นตอนด้านล่างนี้เพื่อเปิดใช้งานระบบทั้งหมด:

### 1. รันฐานข้อมูล (SQL Server)
เปิด Terminal ที่โฟลเดอร์หลักนอกสุดของโปรเจกต์ แล้วใช้คำสั่งนี้เพื่อเปิดคอนเทนเนอร์ SQL Server:
```bash
docker compose up -d
```
*ระบบจะเปิดฐานข้อมูลด้วยพอร์ต `1433` (รหัสผ่านของบัญชี `sa` คือ `myApp@Pass123` ตามที่ระบุไว้ใน `docker-compose.yml`)*

---

### 2. รันระบบหลังบ้าน Backend API (`webApi/`)

#### การทำ Migrations และสั่งอัปเดตตารางใน SQL Server
```bash
# 1. ย้ายเข้าโฟลเดอร์หลังบ้าน
cd webApi

# 2. สั่งอัปเดตและสร้างตารางฐานข้อมูลจริง (หากสร้างตารางใหม่)
dotnet ef database update --project ApprovalTask.Infrastructure/ --startup-project ApprovalTask.API/
```

#### สั่งรัน Backend Web API
```bash
dotnet run --project ApprovalTask.API/
```
ระบบจะเปิดให้บริการผ่านพอร์ต:
- **HTTP**: [http://localhost:9002](http://localhost:9002)
- **HTTPS**: [https://localhost:9003](https://localhost:9003)
- **Swagger UI (สำหรับทดสอบ Endpoint)**: [http://localhost:9002/swagger](http://localhost:9002/swagger)

---

### 3. รันระบบหน้าบ้าน Frontend Client (`clientApp/`)
เปิด Terminal เพิ่มอีก 1 แท็บเพื่อรันโปรแกรมหน้าบ้าน:

```bash
# ย้ายเข้าโฟลเดอร์หน้าบ้าน
cd clientApp

# ติดตั้งแพ็กเกจย่อยที่จำเป็น (หากดึงโค้ดลงเครื่องใหม่)
npm install

# รันระบบเซิร์ฟเวอร์จำลอง
npm start
```
แอปพลิเคชันของฝั่ง Angular จะเปิดใช้งานที่หน้าเว็บ [http://localhost:4200](http://localhost:4200)

---

## 🧪 การรันชุดทดสอบ (Running Tests)

คำสั่งสำหรับสั่งรัน Unit Tests ในระบบหลังบ้านทั้งหมด:
```bash
cd webApi
dotnet test ApprovalTask.sln
```