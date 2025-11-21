# 📧 Cara Melihat Email Notifikasi - Panduan Lengkap

## 🎯 Status Saat Ini

**Email BELUM benar-benar dikirim ke Gmail.** Email hanya **di-log ke console** Supabase (mode development).

Untuk melihat email dan mengaktifkan pengiriman sungguhan, ikuti panduan di bawah:

---

## 📱 CARA 1: Melihat Email di Console (Saat Ini)

### **Langkah 1: Buat Jadwal Ujian**

1. Buka website EduCalm Space
2. Klik menu **"Kalender Ujian"**
3. Klik tombol **"Tambah Ujian"**
4. Isi form:
   ```
   Mata Pelajaran: Matematika
   Tanggal: 2025-12-01
   Waktu: 08:00
   Email: test@gmail.com
   ```
5. Klik **"Simpan"**
6. Toast akan muncul: **"Ujian Matematika berhasil ditambahkan! Email konfirmasi telah dikirim ke test@gmail.com"**

### **Langkah 2: Lihat Email di Supabase Console**

1. **Buka Supabase Dashboard:**
   - Pergi ke: https://supabase.com/dashboard
   - Login dengan akun Anda

2. **Pilih Project:**
   - Klik project EduCalm Space Anda

3. **Buka Edge Functions:**
   ```
   Sidebar → Edge Functions
   ```

4. **Klik Function "server":**
   - Akan muncul list functions
   - Klik `server`

5. **Buka Tab "Logs":**
   - Di halaman function, klik tab **"Logs"**

6. **Lihat Email Log:**
   - Scroll ke bawah
   - Cari log dengan format:
   
   ```
   === EMAIL (Development Mode) ===
   To: test@gmail.com
   From: noreply@educalm.space
   Subject: 📅 Ujian Matematika Telah Didaftarkan
   ---
   Halo!
   
   Ujian Matematika telah berhasil didaftarkan pada EduCalm Space. 
   Berikut detailnya:
   
   📚 Mata Pelajaran: Matematika
   📅 Tanggal: Minggu, 1 Desember 2025
   🕐 Waktu: 08:00
   📧 Email: test@gmail.com
   
   Kamu akan menerima pengingat otomatis:
   • 7 hari sebelum ujian - Tips mulai review materi
   • 3 hari sebelum ujian - Tips latihan relaksasi
   • 1 hari sebelum ujian - Tips latihan napas & istirahat
   • Hari ujian - Motivasi dan semangat
   
   Jangan khawatir, kami akan mengingatkanmu di waktu yang tepat! 💙
   
   Semoga berhasil dan tetap tenang! 🍀
   
   Salam hangat,
   Tim EduCalm Space
   educalm.space
   ================================
   ```

### **Screenshot Path:**
```
Supabase Dashboard
└── Projects
    └── [Your EduCalm Project]
        └── Edge Functions (left sidebar)
            └── server (click)
                └── Logs (tab)
                    └── [Email logs appear here in real-time]
```

---

## ✉️ CARA 2: Aktifkan Pengiriman Email SUNGGUHAN ke Gmail

Untuk **menerima email di inbox Gmail sungguhan**, ikuti langkah berikut:

---

### **🔧 SETUP LANGKAH-LANGKAH:**

---

### **Step 1: Generate Gmail App Password**

1. **Buka Google Account:**
   - Pergi ke: https://myaccount.google.com/security
   - Login dengan Gmail yang ingin digunakan untuk mengirim email

2. **Enable 2-Step Verification** (jika belum aktif):
   - Scroll ke bagian **"2-Step Verification"**
   - Klik **"Get Started"**
   - Ikuti instruksi untuk verifikasi nomor HP
   - **Selesaikan setup 2-Step Verification**

3. **Generate App Password:**
   - Setelah 2-Step Verification aktif
   - Pergi ke: https://myaccount.google.com/apppasswords
   - Pilih app: **"Mail"**
   - Pilih device: **"Other (Custom name)"**
   - Ketik nama: **"EduCalm Space"**
   - Klik **"Generate"**
   - **SALIN 16-digit password** yang muncul
   - Contoh: `abcd efgh ijkl mnop`
   - **PENTING:** Simpan password ini, tidak akan muncul lagi!

**Visual:**
```
┌───────────────────────────────────────┐
│  Your app password for EduCalm Space │
│  ────────────────────────────────────│
│                                       │
│     abcd efgh ijkl mnop               │
│                                       │
│  This is the only time this password │
│  will be shown.                       │
└───────────────────────────────────────┘
```

---

### **Step 2: Tambahkan Environment Variables di Supabase**

1. **Buka Supabase Dashboard:**
   - https://supabase.com/dashboard
   - Pilih project EduCalm Space

2. **Pergi ke Settings → Edge Functions:**
   ```
   Settings (bottom left) → Edge Functions → Secrets
   ```

3. **Tambahkan Secret #1:**
   ```
   Name: GMAIL_USER
   Value: your-email@gmail.com
   ```
   - Ganti `your-email@gmail.com` dengan email Gmail Anda
   - Klik **"Add Secret"**

4. **Tambahkan Secret #2:**
   ```
   Name: GMAIL_APP_PASSWORD
   Value: abcdefghijklmnop
   ```
   - Ganti dengan 16-digit password dari Step 1
   - **HAPUS SPASI** (harus jadi satu string: `abcdefghijklmnop`)
   - Klik **"Add Secret"**

**Screenshot Path:**
```
Supabase Dashboard
└── Settings (bottom left sidebar)
    └── Edge Functions
        └── Secrets (tab)
            └── [Add secrets here]
```

**Hasil:**
```
✅ GMAIL_USER = your-email@gmail.com
✅ GMAIL_APP_PASSWORD = abcdefghijklmnop
```

---

### **Step 3: Enable Nodemailer di Backend Code**

1. **File yang perlu diedit:**
   ```
   /supabase/functions/server/email_service.tsx
   ```

2. **Uncomment baris ini di bagian atas:**
   ```typescript
   // Cari baris ini (line 7):
   // import nodemailer from 'npm:nodemailer';
   
   // HAPUS tanda // sehingga jadi:
   import nodemailer from 'npm:nodemailer';
   ```

3. **Uncomment kode pengiriman email:**
   - Cari baris `// Production mode: Send real email via SMTP` (sekitar line 36)
   - Uncomment semua kode di dalam comment block `/* ... */`
   - **Sebelum:**
   ```typescript
   /*
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: gmailUser,
       pass: gmailPassword
     }
   });
   ...
   */
   ```
   
   - **Sesudah:**
   ```typescript
   const transporter = nodemailer.createTransport({
     service: 'gmail',
     auth: {
       user: gmailUser,
       pass: gmailPassword
     }
   });
   
   const mailOptions = {
     from: `EduCalm Space <${gmailUser}>`,
     to: to,
     subject: subject,
     text: text
   };
   
   const info = await transporter.sendMail(mailOptions);
   
   console.log(`✅ Email sent successfully to ${to}`);
   console.log(`Message ID: ${info.messageId}`);
   
   return { 
     success: true, 
     message: `Email sent to ${to}` 
   };
   ```

4. **Comment atau hapus kode temporary logging:**
   - Cari baris `// Temporary: Log and return success` (sekitar line 58)
   - Comment atau hapus block kode setelahnya
   - **Sebelum:**
   ```typescript
   console.log('\n=== EMAIL (Gmail Configured but Sending Disabled) ===');
   // ...
   return { success: true, message: '...' };
   ```
   
   - **Sesudah:**
   ```typescript
   // Kode ini sudah tidak diperlukan karena email sudah benar-benar dikirim
   ```

---

### **Step 4: Deploy Perubahan**

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "Enable real email sending with Gmail SMTP"
   git push origin main
   ```

2. **Deploy di Supabase** (jika auto-deploy tidak aktif):
   - Buka Supabase Dashboard
   - Edge Functions → server
   - Klik **"Deploy"**
   - Tunggu hingga selesai

3. **Verifikasi Deployment:**
   - Check bahwa status deploy = **"Active"**
   - Check logs untuk memastikan tidak ada error

---

### **Step 5: TEST Email Sungguhan! 🎉**

1. **Buka EduCalm Space**

2. **Tambah Ujian Baru:**
   ```
   Mata Pelajaran: Test Email
   Tanggal: 2025-12-25
   Waktu: 10:00
   Email: your-real-email@gmail.com  ← Email Anda sendiri untuk testing
   ```

3. **Klik "Simpan"**

4. **CHECK INBOX GMAIL ANDA:**
   - Buka Gmail: https://mail.google.com
   - Refresh inbox
   - Cari email dengan subject: **"📅 Ujian Test Email Telah Didaftarkan"**
   - **Email seharusnya sudah masuk dalam 10-30 detik!** ✅

5. **Jika Tidak Masuk, Check:**
   - **Spam folder** - Email mungkin masuk ke spam pertama kali
   - **Supabase Logs** - Check error messages
   - **Environment Variables** - Pastikan GMAIL_USER dan GMAIL_APP_PASSWORD sudah benar

---

## 🧪 TESTING CHECKLIST

### **✅ Test 1: Email Konfirmasi (Immediate)**
```
Action: Create exam baru
Expected: Email dikirim LANGSUNG setelah create
Subject: 📅 Ujian {subject} Telah Didaftarkan
Timing: 10-30 detik setelah klik "Simpan"
```

### **✅ Test 2: Email Reminder (Scheduled)**
```
Action: Create exam dengan tanggal 7 hari dari sekarang
Expected: Email reminder akan dikirim sesuai jadwal
Note: Perlu setup cron job (lihat section berikutnya)
```

---

## ⏰ SETUP CRON JOB untuk Auto-Send Reminders

Email konfirmasi sudah otomatis, tapi **email reminder** perlu **cron job**.

### **Opsi 1: GitHub Actions (Free & Recommended)**

1. **Buat file `.github/workflows/send-reminders.yml`:**
   ```yaml
   name: Send Exam Reminders
   
   on:
     schedule:
       # Runs every hour at minute 0
       - cron: '0 * * * *'
     workflow_dispatch: # Manual trigger
   
   jobs:
     send-reminders:
       runs-on: ubuntu-latest
       steps:
         - name: Trigger Supabase Notification Check
           run: |
             curl -X POST https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ca759b54/check-notifications \
               -H "Authorization: Bearer ${{ secrets.SUPABASE_ANON_KEY }}"
   ```

2. **Add Secret di GitHub:**
   - Repo → Settings → Secrets and variables → Actions
   - Add secret: `SUPABASE_ANON_KEY`
   - Value: Your Supabase Anon Key

3. **Commit & Push:**
   ```bash
   git add .github/workflows/send-reminders.yml
   git commit -m "Add cron job for email reminders"
   git push origin main
   ```

4. **Verify:**
   - GitHub repo → Actions tab
   - Lihat workflow "Send Exam Reminders" running

### **Opsi 2: External Cron Service**

Gunakan service gratis seperti:
- **cron-job.org** (https://cron-job.org)
- **EasyCron** (https://www.easycron.com)

Setup:
```
URL: https://YOUR_PROJECT_ID.supabase.co/functions/v1/make-server-ca759b54/check-notifications
Method: POST
Headers: Authorization: Bearer YOUR_ANON_KEY
Schedule: Every 1 hour
```

---

## 📊 MONITORING EMAIL

### **Cara Monitor Email yang Terkirim:**

1. **Check Supabase Logs:**
   ```
   Dashboard → Edge Functions → server → Logs
   ```
   
   Log yang berhasil:
   ```
   ✅ Email sent successfully to user@gmail.com
   Message ID: <abc123@gmail.com>
   ```

2. **Check Gmail "Sent" Folder:**
   - Login ke Gmail yang digunakan untuk GMAIL_USER
   - Buka "Sent" folder
   - Semua email yang terkirim akan ada di sini

3. **Check Database:**
   - Check notification schedules:
   ```sql
   -- Check pending notifications
   SELECT * FROM kv_store WHERE key LIKE 'notification:%' AND value->>'sent' = 'false';
   
   -- Check sent notifications
   SELECT * FROM kv_store WHERE key LIKE 'notification:%' AND value->>'sent' = 'true';
   ```

---

## ❓ TROUBLESHOOTING

### **❌ Problem: Email tidak muncul di logs**

**Solution:**
1. Check apakah exam berhasil dibuat (check toast notification)
2. Check Supabase Function logs untuk error messages
3. Verify endpoint `/make-server-ca759b54/exams` dipanggil dengan success

---

### **❌ Problem: Email di-log tapi tidak terkirim**

**Solution:**
1. Verify GMAIL_USER dan GMAIL_APP_PASSWORD sudah diset di Supabase Secrets
2. Check apakah nodemailer code sudah di-uncomment
3. Re-deploy Supabase Edge Function
4. Check logs untuk error: "Authentication failed"

---

### **❌ Problem: Email masuk ke Spam**

**Solution:**
1. Mark email as "Not Spam" di Gmail
2. Add sender (your GMAIL_USER) ke Contacts
3. Untuk production: Setup SPF, DKIM, dan DMARC records
4. Gunakan professional email domain (bukan Gmail free)

---

### **❌ Problem: "Invalid App Password"**

**Solution:**
1. Pastikan 2-Step Verification aktif di Google Account
2. Generate App Password baru (yang lama mungkin expired)
3. HAPUS SPASI dari App Password (harus jadi satu string)
4. Update GMAIL_APP_PASSWORD secret di Supabase

---

### **❌ Problem: Rate limit / Too many emails**

**Solution:**
1. Gmail free tier limit: ~100 emails/day
2. Jangan test terlalu banyak dalam waktu singkat
3. Untuk production: Upgrade ke Google Workspace atau gunakan email service (SendGrid, Mailgun)

---

## 📈 PRODUCTION RECOMMENDATIONS

Untuk production environment, consider:

1. **Email Service Provider:**
   - SendGrid (100 emails/day free)
   - Mailgun (5,000 emails/month free)
   - AWS SES (62,000 emails/month free)

2. **HTML Email Templates:**
   - Gunakan HTML untuk email yang lebih menarik
   - Add styling, images, buttons
   - Better user experience

3. **Email Tracking:**
   - Track open rates
   - Track click rates
   - Monitor delivery rates

4. **Unsubscribe Option:**
   - Add unsubscribe link di email
   - Comply dengan CAN-SPAM Act
   - Better user experience

---

## 🎯 QUICK RECAP

### **Mode Development (Saat Ini):**
```
✅ Email di-log ke Supabase Console
✅ User melihat toast notification
✅ Data tersimpan di database
✅ Notification schedules dibuat
❌ Email BELUM dikirim ke Gmail sungguhan
```

### **Mode Production (Setelah Setup):**
```
✅ Email di-log ke Supabase Console
✅ User melihat toast notification
✅ Data tersimpan di database
✅ Notification schedules dibuat
✅ Email DIKIRIM ke Gmail sungguhan ← NEW!
✅ User menerima email di inbox
✅ Cron job auto-send reminders
```

---

## 📞 SUPPORT

Jika ada masalah:

1. **Check Supabase Logs** - 90% masalah terlihat di logs
2. **Check GitHub Issues** - Mungkin ada yang pernah mengalami masalah serupa
3. **Test dengan email sendiri** - Jangan langsung test ke user
4. **Start simple** - Test 1 email dulu, baru scale up

---

**Good luck! 🚀📧💙**

Jika sudah berhasil setup, email akan langsung masuk ke inbox Gmail dalam hitungan detik! ✨
