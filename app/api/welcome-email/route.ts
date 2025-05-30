// app/api/welcome-email/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { userEmail, userName, caregiverEmails, onboardingData } = await request.json();

    // Mock email service - in production, you'd use a service like SendGrid, Mailgun, etc.
    console.log('=== WELCOME EMAIL SERVICE ===');
    console.log('Sending welcome email to:', userEmail);
    console.log('User name:', userName);
    console.log('Caregiver emails:', caregiverEmails);
    console.log('Onboarding data:', onboardingData);

    // Simulate sending welcome email to user
    const userEmailContent = {
      to: userEmail,
      subject: 'Welcome to CareSight! 🎉',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #3B82F6, #06B6D4); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 28px;">Welcome to CareSight!</h1>
            <p style="margin: 10px 0 0 0; font-size: 16px;">Your AI-powered healthcare assistant</p>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1F2937;">Hi ${userName}!</h2>
            
            <p>Thank you for joining CareSight! We're excited to help you manage your healthcare journey with AI-powered assistance.</p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #3B82F6; margin-top: 0;">🚀 Getting Started</h3>
              <ul style="color: #6B7280;">
                <li>Upload your first medical document to see our AI analysis</li>
                <li>Ask our AI assistant any health-related questions</li>
                <li>Set up your appointment reminders</li>
                <li>Enable Care Mode for simplified accessibility</li>
              </ul>
            </div>

            <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400E;">
                <strong>⚠️ Important Demo Notice:</strong> CareSight is currently a demonstration application. 
                Please do not share sensitive medical information or real health records. This app is for 
                showcase and testing purposes only.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/dashboard" 
                 style="background: linear-gradient(135deg, #3B82F6, #06B6D4); color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold;">
                Go to Dashboard
              </a>
            </div>
            
            <p style="color: #6B7280; font-size: 14px;">
              If you have any questions, feel free to explore our help section or contact our support team.
            </p>
          </div>
          
          <div style="background: #1F2937; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">CareSight - AI-Powered Healthcare Assistant</p>
            <p style="margin: 5px 0 0 0; opacity: 0.7;">This is a demonstration application for hackathon purposes.</p>
          </div>
        </div>
      `
    };

    // Simulate sending caregiver notification emails
    const caregiverNotifications = caregiverEmails.map((email: string) => ({
      to: email,
      subject: `${userName} has joined CareSight - Healthcare Monitoring`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #10B981, #06B6D4); padding: 30px; text-align: center; color: white;">
            <h1 style="margin: 0; font-size: 24px;">CareSight Caregiver Notice</h1>
          </div>
          
          <div style="padding: 30px; background: #f9f9f9;">
            <h2 style="color: #1F2937;">Hello,</h2>
            
            <p>${userName} has signed up for CareSight, an AI-powered healthcare assistant, and has listed you as a caregiver contact.</p>
            
            <div style="background: white; padding: 20px; border-radius: 10px; margin: 20px 0;">
              <h3 style="color: #10B981; margin-top: 0;">📋 What this means:</h3>
              <ul style="color: #6B7280;">
                <li>You may receive occasional health-related updates about ${userName}</li>
                <li>Emergency contact information may be shared if needed</li>
                <li>You can help ${userName} stay on top of their healthcare management</li>
              </ul>
            </div>

            <div style="background: #FEF3C7; border: 1px solid #F59E0B; padding: 15px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0; color: #92400E;">
                <strong>⚠️ Demo Application Notice:</strong> CareSight is currently a demonstration application 
                created for hackathon purposes. No real medical data should be shared. This is for testing and 
                showcase purposes only.
              </p>
            </div>
            
            <p style="color: #6B7280;">
              If you have any concerns about this notification or would like to be removed from ${userName}'s 
              caregiver contacts, please contact them directly.
            </p>
          </div>
          
          <div style="background: #1F2937; color: white; padding: 20px; text-align: center; font-size: 14px;">
            <p style="margin: 0;">CareSight - AI-Powered Healthcare Assistant</p>
            <p style="margin: 5px 0 0 0; opacity: 0.7;">This is a demonstration application.</p>
          </div>
        </div>
      `
    }));

    // In a real application, you would send these emails using your email service
    // For now, we'll just log them and return success
    console.log('User welcome email:', userEmailContent);
    console.log('Caregiver notifications:', caregiverNotifications);

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ 
      success: true, 
      message: 'Welcome emails sent successfully',
      emailsSent: {
        userEmail: userEmailContent,
        caregiverNotifications: caregiverNotifications
      }
    });

  } catch (error) {
    console.error('Error sending welcome emails:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to send welcome emails' },
      { status: 500 }
    );
  }
}
