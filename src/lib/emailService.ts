import nodemailer from 'nodemailer';

const STAFF_EMAILS = [
  'staff1@alpicdiagnostics.com',
  'staff2@alpicdiagnostics.com',
  'staff3@alpicdiagnostics.com'
];

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'alpicdiagnostics@gmail.com',
    // You'll need to use an App Password from Google Account settings
    // Regular password won't work due to security settings
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export const sendAMCReminder = async (
  customerEmail: string,
  customerName: string,
  equipmentName: string,
  daysRemaining: number,
  amcEndDate: string
) => {
  const allRecipients = [...STAFF_EMAILS, customerEmail];
  
  const mailOptions = {
    from: 'alpicdiagnostics@gmail.com',
    to: allRecipients.join(','),
    subject: `AMC Renewal Reminder - ${daysRemaining} days remaining`,
    html: `
      <h2>AMC Renewal Reminder</h2>
      <p>Dear ${customerName},</p>
      <p>This is a reminder that your Annual Maintenance Contract (AMC) for ${equipmentName} 
         will expire in ${daysRemaining} days on ${amcEndDate}.</p>
      <p>Please contact us to arrange the renewal of your AMC to ensure continued support 
         and maintenance of your equipment.</p>
      <br>
      <p>Best regards,</p>
      <p>Alpic Diagnostics Team</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`AMC reminder sent to ${allRecipients.join(', ')}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
};