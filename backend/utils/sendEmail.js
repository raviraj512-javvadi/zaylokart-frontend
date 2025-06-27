import brevo from '@getbrevo/brevo';

const sendEmail = async (options) => {
  // Configure the Brevo API client
  const apiInstance = new brevo.TransactionalEmailsApi();
  
  // Authenticate with your API key from the environment variables
  apiInstance.authentications['api-key'].apiKey = process.env.BREVO_API_KEY;

  // Construct the email
  const sendSmtpEmail = new brevo.SendSmtpEmail();
  sendSmtpEmail.subject = options.subject;
  sendSmtpEmail.htmlContent = `
    <html>
      <body>
        <h4>You are receiving this email because you (or someone else) has requested the reset of a password.</h4>
        <p>Please click on the following link, or paste it into your browser to complete the process:</p>
        <a href="${options.resetUrl}" target="_blank">${options.resetUrl}</a>
        <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>
      </body>
    </html>
  `;
  sendSmtpEmail.sender = { 
    name: 'ZayloKart Support', 
    email: process.env.EMAIL_FROM 
  };
  sendSmtpEmail.to = [{ email: options.email, name: options.name }];

  try {
    // Send the email
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Password reset email sent successfully via Brevo.');
  } catch (error) {
    console.error('Error sending email with Brevo:', error);
    throw new Error('Email could not be sent');
  }
};

export default sendEmail;
