import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmLink = `http://localhost:3000/auth/new-verification?token=${token}`;
  const emailHTML = generateVerificationEmailHTML(confirmLink);

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "قم بتاكيد بريدك الالكتروني",
    html: emailHTML,
  });
};




export const generateVerificationEmailHTML = (confirmLink: string): string => `
<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>تأكيد البريد الإلكتروني - نظام ODUS</title>
    <style>
        body, table, td, a {
            font-family: Arial, sans-serif;
            color: #ffffff;
            font-size: 16px;
            line-height: 1.6;
            margin: 0;
            padding: 0;
        }
        img {
            border: 0;
            outline: none;
            text-decoration: none;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
            border-radius: 8px;
            box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            padding: 20px;
            background-color: #4caf50;
            color: #ffffff;
            border-radius: 8px 8px 0 0;
        }
        .content {
            padding: 20px;
            color: #333;
            text-align: right;
        }
        .button {
            display: inline-block;
            padding: 12px 24px;
            margin: 20px 0;
            background-color: #4caf50;
            color: #ffffff;
            text-color: #ffffff;
            text-decoration: none;
            border-radius: 6px;
            font-weight: bold;
        }
        .button-container {
            text-align: center;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #666666;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h2>تأكيد البريد الإلكتروني</h2>
        </div>

        <div class="content">
            <p>اهلا وسهلا</p>
            <p> لأستكمال عملية تسجيل الدخول يجب عليك توثيق البريد الالكتروني بالضغط على الزر أدناه  </p>
            <div class="button-container">
                <a href="${confirmLink}" class="button">تأكيد البريد الإلكتروني</a>
            </div>
            <p>إذا لم تقم بإنشاء حساب معنا، يمكنك تجاهل هذا البريد الإلكتروني.</p>
        </div>

        <div class="footer">
        <p>&copy; 2024 - جميع الحقوق محفوظة </p>
        </div>
    </div>

</body>
</html>
`;

// for send verification






export const sendPasswordResetEmail = async (email: string, token: string) => {
    const resetLink = `http://localhost:3000/auth/new-password?token=${token}`;
  
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "إعادة تعيين كلمة المرور",
      html: `
      
      
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>إعادة تعيين كلمة المرور - نظام ODUS</title>
          <style>
              body, table, td, a {
                  font-family: Arial, sans-serif;
                  color: #ffffff;
                  font-size: 16px;
                  line-height: 1.6;
                  margin: 0;
                  padding: 0;
              }
              img {
                  border: 0;
                  outline: none;
                  text-decoration: none;
              }
              .container {
                  max-width: 600px;
                  margin: 0 auto;
                  padding: 20px;
                  background-color: #f8f9fa;
                  border-radius: 8px;
                  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
              }
              .header {
                  text-align: center;
                  padding: 20px;
                  background-color: #4caf50;
                  color: #ffffff;
                  border-radius: 8px 8px 0 0;
              }
              .content {
                  padding: 20px;
                  color: #333;
                  text-align: right;
              }
              .button {
                  display: inline-block;
                  padding: 12px 24px;
                  margin: 20px 0;
                  background-color: #4caf50;
                  color: #ffffff;
                  text-decoration: none;
                  border-radius: 6px;
                  font-weight: bold;
              }
              .button-container {
                  text-align: center;
              }
              .footer {
                  text-align: center;
                  padding: 10px;
                  font-size: 12px;
                  color: #666666;
              }
          </style>
      </head>
      <body>
      
          <div class="container">
              <div class="header">
                  <img src="https://www.kau.edu.sa/Images/222/New_logo/قواعد%20ارشادية/KAU_logo.png" alt="KAU Logo" width="80" style="margin-bottom: 10px;">
                  <h2>إعادة تعيين كلمة المرور</h2>
                  <p>جامعة الملك عبدالعزيز</p>
              </div>
      
              <div class="content">
                  <p>مرحباً بك</p>
                  <p>لقد تلقينا طلباً لإعادة تعيين كلمة المرور الخاصة بحسابك لإكمال العملية يرجى النقر على الزر أدناه</p>
                  <div class="button-container">
                      <a href="${resetLink}" class="button">إعادة تعيين كلمة المرور</a>
                  </div>
                  <p>إذا لم تطلب إعادة تعيين كلمة المرور، يمكنك تجاهل هذا البريد الإلكتروني.</p>
              </div>
      
              <div class="footer">
                  <p>&copy; 2024 - جميع الحقوق محفوظة، جامعة الملك عبدالعزيز</p>
                  <p><a href="https://localhost:3000/" style="color: #4caf50; text-decoration: none;">موقع جامعة الملك عبدالعزيز</a></p>
                  <p>ODUS PLUS</p>
              </div>
          </div>
      
      </body>
      </html>
      `,
    });
  };




  //the gmail was cut the msg there because he has limit of kb => 102KB only for msg 
  //! must be solve this problem 
  export const sendTwoFactorTokenEmail = async (
    email: string,
    token: string
  ) => {
    // Adding spaces between each character for better readability
    const spacedToken = token.split("").join(" ");
  
    await resend.emails.send({
      from: "onboarding@resend.dev",
      to: email,
      subject: "رمز التحقق من عملية تسجيل الدخول",
      html: `
        <!DOCTYPE html>
        <html lang="ar" dir="rtl">
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>رمز التحقق من عملية تسجيل الدخول - جامعة الملك عبدالعزيز</title>
            <style>
                body, table, td, a {
                    font-family: Arial, sans-serif;
                    color: #333;
                    font-size: 16px;
                    line-height: 1.6;
                    margin: 0;
                    padding: 0;
                }
                .container {
                    max-width: 600px;
                    margin: 0 auto;
                    padding: 20px;
                    background-color: #f8f9fa;
                    border-radius: 8px;
                    box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.1);
                }
                .header {
                    text-align: center;
                    padding: 20px;
                    background-color: #4caf50;
                    color: #ffffff;
                    border-radius: 8px 8px 0 0;
                }
                .content {
                    padding: 20px;
                    color: #333;
                    text-align: right;
                }
                .token-box {
                    background-color: #4caf50;
                    color: #fff;
                    padding: 15px;
                    border-radius: 6px;
                    font-size: 24px;
                    letter-spacing: 2px; /* Reduced letter spacing for smaller size */
                    text-align: center;
                    margin: 20px 0; /* Add margin for spacing */
                }
                .footer {
                    text-align: center;
                    padding: 10px;
                    font-size: 12px;
                    color: #666666;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <img src="https://www.kau.edu.sa/Images/222/New_logo/قواعد%20ارشادية/KAU_logo.png" alt="KAU Logo" width="80" style="margin-bottom: 10px;">
                    <h2>رمز التحقق من عملية تسجيل الدخول</h2>
                    <p>جامعة الملك عبدالعزيز</p>
                </div>
    
                <div class="content">
                    <p>عزيزي المستخدم</p>
                    <p>لقد تلقيت رمز التحقق لإتمام عملية تسجيل الدخول إلى حسابك</p>
                    <div class="token-box">${spacedToken}</div>
                    <p> يرجى عدم مشاركة هذا الرمز مع أي شخص إذ أن هذا الإجراء يعزز حماية حسابك اذ لم تقم بتسجيل الدخول فسارع بإعادة تعيين كلمة المرور من <a href="http://localhost:3000/auth/reset"> هنا </a></p>
                    <br>
                </div>
    
                <div class="footer">
                    <p>&copy; 2024 - جميع الحقوق محفوظة، جامعة الملك عبدالعزيز</p>
                    <p><a href="https://localhost:3000/" style="color: #4caf50; text-decoration: none;">موقع جامعة الملك عبدالعزيز</a></p>
                    <p>ODUS PLUS</p>
                </div>
            </div>
        </body>
        </html>
      `,
    });
  };