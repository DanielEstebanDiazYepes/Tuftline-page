const nodemailer = require("nodemailer");

// Configura tu cuenta de envío de correos
const transporter = nodemailer.createTransport({
  service: "gmail", // o "hotmail", "outlook", o configura un SMTP
  auth: {
    user: "faesdream@gmail.com",    //CREDENCIALES PARA ACCEDER A LA CUENTA DE ENVIO
    pass: "vvwv jaqw rwed mpnz",    //CONTRASEÑA CREADA PARA LA CUENTA DE ENVIO
  },
});

async function sendPurchaseReceipt(toEmail, subject, htmlContent) {
  const mailOptions = {
    from: '"Tienda Online" faesdream@gmail.com',
    to: toEmail,
    subject: subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendPurchaseReceipt };
