import nodemailer from "nodemailer";

const sendEmail = async (options) => {
  console.log("📧 Đang chuẩn bị gửi email đến:", options.email);

  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    throw new Error("Thiếu EMAIL_USER hoặc EMAIL_PASS trong biến môi trường");
  }

  // Thử dùng Port 465 (SMTPS - SSL) thay vì 587 (STARTTLS)
  // Render đôi khi block 587 nhưng lại thả 465
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // <-- Đổi sang 465
    secure: true, // <-- Bật true khi dùng 465
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Tăng timeout lên 60s cho Render Free
    connectionTimeout: 60000,
    greetingTimeout: 60000,
    socketTimeout: 60000,
  });

  const htmlTemplate = `
    <!DOCTYPE html>
    <html lang="vi">
    <head>
      <meta charset="UTF-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #071226; color: #ffffff; margin: 0; padding: 0; }
        .container { max-width: 600px; margin: 40px auto; background: linear-gradient(to bottom right, #0b1630, #12305d); border: 1px solid rgba(234, 179, 8, 0.3); border-radius: 16px; overflow: hidden; box-shadow: 0 4px 30px rgba(0,0,0,0.5); }
        .header { background-color: #0c1830; padding: 24px; text-align: center; border-bottom: 2px solid #eab308; }
        .header h1 { margin: 0; color: #eab308; font-size: 28px; letter-spacing: 2px; }
        .content { padding: 32px 24px; line-height: 1.6; color: #e2e8f0; }
        .otp-box { text-align: center; margin: 32px 0; }
        .otp-code { display: inline-block; background-color: rgba(255, 255, 255, 0.1); border: 2px dashed #eab308; padding: 16px 32px; font-size: 36px; font-weight: bold; letter-spacing: 8px; color: #eab308; border-radius: 12px; }
        .footer { background-color: #050b17; padding: 16px; text-align: center; font-size: 14px; color: #94a3b8; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header"><h1>TICKETFLIX</h1></div>
        <div class="content">
          <h2 style="color: #ffffff;">Yêu cầu Đặt Lại Mật Khẩu</h2>
          <p>Chào bạn,</p>
          <p>Chúng tôi nhận được yêu cầu khôi phục mật khẩu cho tài khoản TicketFlix của bạn. Vui lòng sử dụng mã OTP gồm 6 chữ số dưới đây để hoàn tất quá trình thiết lập mật khẩu mới.</p>
          <div class="otp-box"><div class="otp-code">${options.otp}</div></div>
          <p style="color: #fca5a5; font-size: 14px; text-align: center;">⚠️ Mã OTP này chỉ có hiệu lực trong vòng 15 phút.</p>
          <p>Nếu bạn không thực hiện yêu cầu này, xin vui lòng bỏ qua email này hoặc liên hệ ngay với bộ phận hỗ trợ của TicketFlix để bảo đảm an toàn cho tài khoản của bạn.</p>
          <br />
          <p>Trân trọng,<br><strong style="color: #eab308; font-size: 16px;">Đội ngũ TicketFlix Support</strong></p>
        </div>
        <div class="footer"><p>&copy; ${new Date().getFullYear()} TicketFlix. All rights reserved.</p></div>
      </div>
    </body>
    </html>
  `;

  const mailOptions = {
    from: '"TicketFlix Support" <' + process.env.EMAIL_USER + '>',
    to: options.email,
    subject: "TicketFlix - Khôi Phục Mật Khẩu Khách Hàng",
    html: htmlTemplate,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("✅ Email đã gửi thành công đến:", options.email);
  console.log("   Message ID:", info.messageId);
};

export default sendEmail;
