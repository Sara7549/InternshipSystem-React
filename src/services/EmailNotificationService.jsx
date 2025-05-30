// src/services/EmailNotificationService.js

// This service will handle sending email notifications
export const sendEmailNotification = async (recipient, subject, message) => {
  try {
    console.log(`Sending email to: ${recipient}`);
    console.log(`Subject: ${subject}`);
    console.log(`Message: ${message}`);
    
    // Simulating API call latency
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error };
  }
};

// Helper functions for specific notification types
export const sendApplicationStatusNotification = async (company, status, internshipTitle) => {
  const subject = `Internship Application ${status === 'accepted' ? 'Accepted' : 'Rejected'}`;
  
  let message = '';
  if (status === 'accepted') {
    message = `Congratulations! Your application for posting the "${internshipTitle}" internship has been accepted. You can now start receiving applications from students.`;
  } else {
    message = `We regret to inform you that your application for posting the "${internshipTitle}" internship has been rejected. Please contact our support team for more information.`;
  }
  
  return await sendEmailNotification(company.email, subject, message);
};