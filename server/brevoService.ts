import * as brevo from '@getbrevo/brevo';

export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  message: string;
}

export class BrevoEmailService {
  private transactionalEmailsApi: brevo.TransactionalEmailsApi;

  constructor() {
    const apiKey = process.env.BREVO_API_KEY;
    if (!apiKey) {
      throw new Error('BREVO_API_KEY environment variable is required');
    }

    // Initialize Brevo API client
    const apiInstance = brevo.ApiClient.instance;
    const apiKeyInstance = apiInstance.authentications['api-key'];
    apiKeyInstance.apiKey = apiKey;
    
    this.transactionalEmailsApi = new brevo.TransactionalEmailsApi();
  }

  async sendContactEmail(contactData: ContactFormData): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const sendSmtpEmail = new brevo.SendSmtpEmail();
      
      // Configure the email
      sendSmtpEmail.subject = `New Contact Form Submission from ${contactData.firstName} ${contactData.lastName}`;
      sendSmtpEmail.to = [{ 
        email: process.env.RESTAURANT_EMAIL || 'hello@jealousfork.com',
        name: 'Jealous Fork Restaurant'
      }];
      sendSmtpEmail.sender = { 
        name: 'Jealous Fork Website',
        email: process.env.BREVO_SENDER_EMAIL || 'noreply@jealousfork.com'
      };
      sendSmtpEmail.replyTo = {
        email: contactData.email,
        name: `${contactData.firstName} ${contactData.lastName}`
      };

      // Create HTML email content
      const htmlContent = `
        <html>
          <head>
            <style>
              body { font-family: 'Inter', Arial, sans-serif; color: #374151; line-height: 1.6; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px; }
              .content { background: white; padding: 20px; border: 1px solid #e5e7eb; border-radius: 8px; }
              .field { margin-bottom: 15px; }
              .label { font-weight: 600; color: #1f2937; }
              .value { margin-top: 5px; padding: 10px; background: #f9fafb; border-radius: 4px; }
              .message { background: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; border-radius: 4px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h2 style="margin: 0; color: #1f2937;">New Contact Form Submission</h2>
                <p style="margin: 10px 0 0 0; color: #6b7280;">From Jealous Fork Website</p>
              </div>
              
              <div class="content">
                <div class="field">
                  <div class="label">Name:</div>
                  <div class="value">${contactData.firstName} ${contactData.lastName}</div>
                </div>
                
                <div class="field">
                  <div class="label">Email:</div>
                  <div class="value"><a href="mailto:${contactData.email}">${contactData.email}</a></div>
                </div>
                
                ${contactData.phone ? `
                <div class="field">
                  <div class="label">Phone:</div>
                  <div class="value"><a href="tel:${contactData.phone}">${contactData.phone}</a></div>
                </div>
                ` : ''}
                
                <div class="field">
                  <div class="label">Message:</div>
                  <div class="message">${contactData.message.replace(/\n/g, '<br>')}</div>
                </div>
                
                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 14px; color: #6b7280;">
                  <p>Submitted on: ${new Date().toLocaleString('en-US', { 
                    timeZone: 'America/New_York',
                    dateStyle: 'full',
                    timeStyle: 'short'
                  })}</p>
                </div>
              </div>
            </div>
          </body>
        </html>
      `;

      sendSmtpEmail.htmlContent = htmlContent;
      
      // Send plain text version as well
      sendSmtpEmail.textContent = `
New Contact Form Submission

Name: ${contactData.firstName} ${contactData.lastName}
Email: ${contactData.email}
${contactData.phone ? `Phone: ${contactData.phone}` : ''}

Message:
${contactData.message}

Submitted on: ${new Date().toLocaleString('en-US', { 
  timeZone: 'America/New_York',
  dateStyle: 'full',
  timeStyle: 'short'
})}
      `.trim();

      const result = await this.transactionalEmailsApi.sendTransacEmail(sendSmtpEmail);
      
      return {
        success: true,
        messageId: result.body?.messageId
      };
    } catch (error: any) {
      console.error('Brevo email sending error:', error);
      return {
        success: false,
        error: error.message || 'Failed to send email'
      };
    }
  }

  async testConnection(): Promise<{ success: boolean; error?: string }> {
    try {
      // Test API connection by getting account info
      const accountApi = new brevo.AccountApi();
      await accountApi.getAccount();
      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error.message || 'Connection test failed'
      };
    }
  }
}