// Email Service for sending emails via Gmail SMTP
// To enable real email sending:
// 1. Add GMAIL_USER and GMAIL_APP_PASSWORD to Supabase Edge Function Secrets
// 2. Uncomment the nodemailer code below
// 3. Comment out the console.log section

// import nodemailer from 'npm:nodemailer';

/**
 * Sends an email using Gmail SMTP
 * @param to - Recipient email address
 * @param subject - Email subject
 * @param text - Email body (plain text)
 * @returns Promise<{ success: boolean, message?: string }>
 */
export async function sendEmail(to: string, subject: string, text: string): Promise<{ success: boolean, message?: string }> {
  try {
    // Check if Gmail credentials are available
    const gmailUser = Deno.env.get('GMAIL_USER');
    const gmailPassword = Deno.env.get('GMAIL_APP_PASSWORD');

    if (!gmailUser || !gmailPassword) {
      // Development mode: Just log the email
      console.log('\n=== EMAIL (Development Mode) ===');
      console.log(`To: ${to}`);
      console.log(`From: ${gmailUser || 'noreply@educalm.space'}`);
      console.log(`Subject: ${subject}`);
      console.log('---');
      console.log(text);
      console.log('================================\n');
      
      return { 
        success: true, 
        message: 'Email logged (development mode - Gmail not configured)' 
      };
    }

    // Production mode: Send real email via SMTP
    // Uncomment the code below to enable real email sending
    
    /*
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
    */

    // Temporary: Log and return success (until nodemailer is enabled)
    console.log('\n=== EMAIL (Gmail Configured but Sending Disabled) ===');
    console.log(`To: ${to}`);
    console.log(`From: ${gmailUser}`);
    console.log(`Subject: ${subject}`);
    console.log('---');
    console.log(text);
    console.log('====================================================\n');
    console.log('💡 To enable real email sending:');
    console.log('   1. Uncomment nodemailer code in email_service.tsx');
    console.log('   2. Deploy to Supabase');
    
    return { 
      success: true, 
      message: 'Email logged (nodemailer disabled - uncomment code to enable)' 
    };

  } catch (error) {
    console.error('❌ Error sending email:', error);
    return { 
      success: false, 
      message: `Failed to send email: ${error}` 
    };
  }
}

/**
 * Sends exam confirmation email
 */
export async function sendExamConfirmationEmail(exam: any) {
  const subject = `📅 Ujian ${exam.subject} Telah Didaftarkan`;
  
  const message = `Halo!

Ujian ${exam.subject} telah berhasil didaftarkan pada EduCalm Space. 
Berikut detailnya:

📚 Mata Pelajaran: ${exam.subject}
📅 Tanggal: ${new Date(exam.date).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
🕐 Waktu: ${exam.time}
📧 Email: ${exam.email}

Kamu akan menerima pengingat otomatis:
• 7 hari sebelum ujian - Tips mulai review materi
• 3 hari sebelum ujian - Tips latihan relaksasi
• 1 hari sebelum ujian - Tips latihan napas & istirahat
• Hari ujian - Motivasi dan semangat

Jangan khawatir, kami akan mengingatkanmu di waktu yang tepat! 💙

Semoga berhasil dan tetap tenang! 🍀

Salam hangat,
Tim EduCalm Space
educalm.space`;

  return await sendEmail(exam.email, subject, message);
}

/**
 * Sends exam reminder email based on days until exam
 */
export async function sendExamReminderEmail(exam: any, daysUntil: number) {
  let subject = '';
  let message = '';

  if (daysUntil === 0) {
    subject = `🎯 Hari Ini Ujian ${exam.subject}!`;
    message = `Halo! 

Hari ini adalah hari ujian ${exam.subject} pada pukul ${exam.time}! 🎓

💡 Tips untuk menghadapi ujian hari ini:
• Sarapan yang cukup untuk energi
• Bernapas dalam-dalam untuk menenangkan diri
• Yakin pada kemampuanmu sendiri - kamu sudah belajar dengan baik
• Datang 15 menit lebih awal untuk persiapan

💙 Ingat: Kamu sudah belajar dengan baik. Kamu BISA melakukannya!

Percaya diri dan tetap tenang. Semoga berhasil! 🍀✨

Salam hangat,
Tim EduCalm Space
educalm.space`;

  } else if (daysUntil === 1) {
    subject = `🧘 Besok Ujian ${exam.subject} - Waktunya Relaksasi`;
    message = `Halo!

Besok kamu akan menghadapi ujian ${exam.subject} pada pukul ${exam.time}. 📚

💡 Saran untuk hari ini:
• Latihan napas 5 menit untuk menenangkan pikiran
• Review materi secara RINGAN, jangan terlalu berat
• Tidur yang cukup (minimal 7-8 jam) - ini PENTING!
• Hindari belajar hingga larut malam

🧘 Kunjungi "Zona Tenang" di EduCalm Space untuk latihan pernapasan dan meditasi gratis.

Kamu sudah siap! Percaya pada dirimu sendiri. 💪💙

Istirahat yang cukup adalah kuncinya! 😊

Salam hangat,
Tim EduCalm Space
educalm.space`;

  } else if (daysUntil <= 3) {
    subject = `😌 ${daysUntil} Hari Lagi Ujian ${exam.subject}`;
    message = `Halo!

${daysUntil} hari lagi ujian ${exam.subject} pada ${new Date(exam.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} pukul ${exam.time}. 📅

💡 Saran untuk kamu:
• Mulai latihan relaksasi setiap hari (10-15 menit)
• Buat jadwal review materi yang konsisten
• Jangan lupa istirahat yang cukup di antara belajar
• Makan makanan bergizi untuk stamina

🧘 Tips: Luangkan waktu untuk mindfulness dan relaksasi. Pikiran yang tenang = belajar lebih efektif!

Kamu pasti bisa! 💙✨

Salam hangat,
Tim EduCalm Space
educalm.space`;

  } else {
    subject = `📚 ${daysUntil} Hari Lagi Ujian ${exam.subject}`;
    message = `Halo!

${daysUntil} hari lagi ujian ${exam.subject} pada ${new Date(exam.date).toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long' })} pukul ${exam.time}. 📅

💡 Saran untuk kamu:
• Mulai review materi secara perlahan dan konsisten
• Buat catatan atau mind map untuk memudahkan belajar
• Jangan lupa istirahat 10 menit setiap 1 jam belajar
• Tetap tenang dan percaya diri - masih banyak waktu!

📖 Yuk, mulai belajar dengan santai dan konsisten. Tidak perlu terburu-buru!

Semangat! 💪📚

Salam hangat,
Tim EduCalm Space
educalm.space`;
  }

  return await sendEmail(exam.email, subject, message);
}
