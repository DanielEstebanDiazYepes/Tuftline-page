const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",//USAMOS GMAIL
  auth: {
    user: "faesdream@gmail.com",    //CREDENCIALES PARA ACCEDER A LA CUENTA DE ENVIO
    pass: "vvwv jaqw rwed mpnz",    //CONTRASEÑA CREADA PARA LA CUENTA DE ENVIO
  },
});

async function sendEmail(toEmail, subject, htmlContent) {
  const mailOptions = {
    from: '"Tienda Online" faesdream@gmail.com',
    to: toEmail,
    subject: subject,
    html: htmlContent,
  };

  await transporter.sendMail(mailOptions);
}

module.exports = { sendEmail };
