# 📧 Setup Notifikasi Email untuk Kalender Ujian

## Overview
Fitur Kalender Ujian di EduCalm Space sudah dilengkapi dengan sistem notifikasi email otomatis yang akan mengirimkan email pada waktu-waktu berikut:

### **1️⃣ Email Konfirmasi (Immediate)**
Dikirim **langsung** setelah jadwal ujian berhasil dibuat sebagai tanda bahwa jadwal sudah tersimpan.

**Subject:** `📅 Ujian {subject} Telah Didaftarkan`

**Content:**
```
Halo!

Ujian {subject} telah berhasil didaftarkan pada EduCalm Space. Berikut detailnya:
• Tanggal: {date}
• Waktu: {time}
• Email: {email}

Kamu akan menerima pengingat 7 hari, 3 hari, 1 hari sebelum ujian, serta pengingat pada hari ujian itu sendiri.

Semoga berhasil! 🍀

Salam hangat,
EduCalm Space
```

### **2️⃣ Email Reminder (Scheduled)**
- **7 hari sebelum ujian**: Pengingat untuk mulai review materi
- **3 hari sebelum ujian**: Pengingat untuk latihan relaksasi
- **1 hari sebelum ujian**: Pengingat untuk latihan napas & istirahat
- **Hari H ujian**: Pengingat motivasi untuk menghadapi ujian

## Status Implementasi ✅

### ✅ Yang Sudah Selesai:
1. **Frontend UI** - Form tambah ujian dengan field email ✅
2. **Backend API** - Endpoints untuk CRUD exam ✅
3. **Database Storage** - Menyimpan jadwal ujian dan notifikasi ✅
4. **Notification Scheduler** - Sistem penjadwalan notifikasi ✅
5. **Email Template** - Template email dengan konten yang personal ✅

### ⏳ Yang Perlu Diselesaikan:
1. **Integrasi Gmail API** - Untuk mengirim email sebenarnya (saat ini hanya log)

## Cara Kerja Sistem

### 1. User Menambah Jadwal Ujian
```typescript
// User mengisi form:
- Mata Pelajaran: "Matematika"
- Tanggal: "2025-12-01"
- Waktu: "08:00"
- Email: "user@example.com"
```

### 2. Backend Menyimpan dan Menjadwalkan
```typescript
// Backend akan:
1. Menyimpan exam ke database
2. Menghitung tanggal reminder (7 hari, 3 hari, 1 hari, hari H)
3. Menyimpan notification schedule ke database
4. Mengirim email immediate jika sudah dalam window notifikasi
```

### 3. Cron Job Mengecek Notifikasi Pending
```typescript
// Endpoint: POST /make-server-ca759b54/check-notifications
// Akan mengecek semua notifikasi yang belum terkirim
// Dan mengirim email jika sudah waktunya
```

## Setup Gmail API (Opsional)

Untuk mengaktifkan pengiriman email sebenarnya, ikuti langkah berikut:

### Opsi 1: Gmail API (Recommended)

1. **Buat Project di Google Cloud Console**
   - Kunjungi: https://console.cloud.google.com
   - Buat project baru "EduCalm Email Service"

2. **Enable Gmail API**
   - Di dashboard, cari "Gmail API"
   - Klik "Enable"

3. **Buat Service Account**
   - Navigation menu → IAM & Admin → Service Accounts
   - Klik "Create Service Account"
   - Beri nama: "educalm-email-service"
   - Download JSON key file

4. **Setup Domain-Wide Delegation** (untuk mengirim email atas nama user)
   - Di Service Account, klik "Enable G Suite Domain-wide Delegation"
   - Catat Client ID

5. **Add Environment Variable**
   ```bash
   GMAIL_SERVICE_ACCOUNT_KEY=<isi dari JSON key file>
   ```

6. **Update Backend Code**
   ```typescript
   // Di sendExamReminder function, ganti console.log dengan:
   import { google } from 'npm:googleapis@122.0.0';
   
   const auth = new google.auth.GoogleAuth({
     credentials: JSON.parse(Deno.env.get('GMAIL_SERVICE_ACCOUNT_KEY')),
     scopes: ['https://www.googleapis.com/auth/gmail.send']
   });
   
   const gmail = google.gmail({ version: 'v1', auth });
   
   const email = [
     `To: ${exam.email}`,
     `Subject: ${subject}`,
     'Content-Type: text/plain; charset=utf-8',
     '',
     message
   ].join('\n');
   
   const encodedEmail = Buffer.from(email).toString('base64').replace(/\+/g, '-').replace(/\//g, '_');
   
   await gmail.users.messages.send({
     userId: 'me',
     requestBody: {
       raw: encodedEmail
     }
   });
   ```

### Opsi 2: SMTP dengan Nodemailer (Lebih Mudah)

1. **Setup Gmail App Password**
   - Kunjungi: https://myaccount.google.com/apppasswords
   - Generate app password untuk aplikasi

2. **Add Environment Variables**
   ```bash
   GMAIL_USER=your-email@gmail.com
   GMAIL_APP_PASSWORD=<16-digit app password>
   ```

3. **Update Backend Code**
   ```typescript
   // Install nodemailer
   import nodemailer from 'npm:nodemailer';
   
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: Deno.env.get('GMAIL_USER'),
       pass: Deno.env.get('GMAIL_APP_PASSWORD')
     }
   });
   
   await transporter.sendMail({
     from: Deno.env.get('GMAIL_USER'),
     to: exam.email,
     subject: subject,
     text: message
   });
   ```

## Testing

### 1. Test Menambah Ujian
```bash
# Buka EduCalm Space
# Navigate ke "Kalender Ujian"
# Klik "Tambah Ujian"
# Isi form dan submit
```

### 2. Test Notifikasi (Manual Trigger)
```bash
# Call endpoint check-notifications
curl -X POST https://your-project.supabase.co/functions/v1/make-server-ca759b54/check-notifications \
  -H "Authorization: Bearer YOUR_ANON_KEY"
```

### 3. Setup Cron Job (Production)
```bash
# Gunakan layanan cron seperti:
# - GitHub Actions (schedule workflow)
# - Supabase Cron (jika tersedia)
# - External cron service (cron-job.org)

# Schedule: Setiap 1 jam sekali
# Endpoint: POST /make-server-ca759b54/check-notifications
```

## API Endpoints

### GET /exams
Mendapatkan semua jadwal ujian
```json
Response: [
  {
    "id": 1234567890,
    "subject": "Matematika",
    "date": "2025-12-01",
    "time": "08:00",
    "email": "user@example.com",
    "color": "bg-blue-500",
    "createdAt": "2025-11-21T10:00:00.000Z"
  }
]
```

### POST /exams
Menambah jadwal ujian baru
```json
Request Body:
{
  "subject": "Matematika",
  "date": "2025-12-01",
  "time": "08:00",
  "email": "user@example.com",
  "color": "bg-blue-500"
}

Response: { exam object }
```

### DELETE /exams/:id
Menghapus jadwal ujian
```json
Response: { "success": true }
```

### POST /check-notifications
Mengecek dan mengirim notifikasi pending
```json
Response: { 
  "success": true, 
  "sentCount": 3 
}
```

## Database Schema

### Exam Collection
```typescript
Key: exam:{id}
Value: {
  id: number
  subject: string
  date: string
  time: string
  email: string
  color: string
  createdAt: string
}
```

### Notification Collection
```typescript
Key: notification:{examId}-{type}
Value: {
  id: string
  examId: number
  sendAt: string (ISO)
  type: '7days' | '3days' | '1day' | 'today'
  sent: boolean
}
```

## Troubleshooting

### Email tidak terkirim?
1. Cek environment variables sudah diset dengan benar
2. Cek logs di Supabase Function Dashboard
3. Pastikan Gmail API sudah enabled
4. Cek quota Gmail API (max 100 emails/day untuk free tier)

### Notifikasi terlambat?
1. Pastikan cron job berjalan dengan benar
2. Reduce cron interval (dari 1 jam ke 30 menit)
3. Cek timezone server vs timezone user

### Email masuk ke spam?
1. Gunakan domain email yang terverifikasi
2. Setup SPF dan DKIM records
3. Tambahkan "Unsubscribe" link
4. Jangan kirim terlalu banyak email dalam waktu singkat

## Next Steps

1. ✅ **Setup SMTP/Gmail API** - Aktifkan pengiriman email sebenarnya
2. ✅ **Setup Cron Job** - Otomasi pengecekan notifikasi
3. ✅ **Testing** - Test dengan email asli
4. ✅ **Production Deploy** - Deploy ke production dengan environment variables

## Support

Jika ada pertanyaan atau masalah:
1. Cek logs di Supabase Function Dashboard
2. Cek browser console untuk error frontend
3. Test API endpoints dengan Postman/curl

---

**Created by**: EduCalm Space Development Team  
**Last Updated**: November 21, 2025