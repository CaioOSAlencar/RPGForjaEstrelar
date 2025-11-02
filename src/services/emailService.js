import nodemailer from 'nodemailer';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  initializeTransporter() {
    // Verificar se as credenciais do Gmail estão configuradas
    if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
      // Usar Gmail real
      this.transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });
      console.log('📧 Email service initialized with Gmail');
    } else {
      // Fallback para desenvolvimento
      this.createTestTransporter();
    }
  }

  async createTestTransporter() {
    try {
      // Criar conta de teste do Ethereal Email
      const testAccount = await nodemailer.createTestAccount();
      
      this.transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass
        }
      });
      
      console.log('📧 Email service initialized with test account');
      console.log('Test account:', testAccount.user);
    } catch (error) {
      console.error('Erro ao criar transporter de teste:', error);
      // Fallback: criar transporter simples para desenvolvimento
      this.transporter = nodemailer.createTransport({
        streamTransport: true,
        newline: 'unix',
        buffer: true
      });
    }
  }

  async sendCampaignInvite(email, campaignName, masterName, inviteLink) {
    if (!this.transporter) {
      console.log('📧 Email service not configured - skipping email send');
      return { success: false, message: 'Email service not configured' };
    }

    const mailOptions = {
      from: process.env.EMAIL_FROM || 'noreply@rpgforjaestrelar.com',
      to: email,
      subject: `🎲 Convite para a campanha: ${campaignName}`,
      html: this.generateInviteEmailTemplate(campaignName, masterName, inviteLink)
    };

    try {
      const info = await this.transporter.sendMail(mailOptions);
      
      // Verificar se está usando Gmail real ou teste
      if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
        console.log('📧 Email enviado via Gmail para:', email);
        console.log('Message ID:', info.messageId);
      } else {
        console.log('📧 Email enviado (desenvolvimento)');
        console.log('Preview URL:', nodemailer.getTestMessageUrl(info));
      }
      
      return { 
        success: true, 
        messageId: info.messageId,
        previewUrl: nodemailer.getTestMessageUrl(info)
      };
    } catch (error) {
      console.error('Erro ao enviar email:', error);
      return { success: false, error: error.message };
    }
  }

  generateInviteEmailTemplate(campaignName, masterName, inviteLink) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Convite para Campanha RPG</title>
        <style>
          body { font-family: Arial, sans-serif; background-color: #1a1a1a; color: #ffffff; margin: 0; padding: 20px; }
          .container { max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #2c1810 0%, #1a1a1a 100%); border: 2px solid #d4af37; border-radius: 12px; padding: 30px; }
          .header { text-align: center; margin-bottom: 30px; }
          .title { font-size: 28px; font-weight: bold; margin-bottom: 10px; text-shadow: 2px 2px 4px rgba(0,0,0,0.5); color: #d4af37; }
          .subtitle { font-size: 16px; opacity: 0.9; color: #ffffff; }
          .content { line-height: 1.6; margin-bottom: 30px; color: #ffffff; }
          .invite-button { display: inline-block; background: linear-gradient(135deg, #d4af37 0%, #f4d03f 100%); color: #1a1a1a; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 16px; margin: 20px 0; }
          .footer { text-align: center; font-size: 12px; opacity: 0.8; margin-top: 30px; border-top: 1px solid rgba(212, 175, 55, 0.3); padding-top: 20px; color: #cccccc; }
          .campaign-name { color: #d4af37; text-align: center; font-size: 24px; margin: 20px 0; }
          .instructions { font-size: 14px; opacity: 0.9; color: #e0e0e0; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div class="title">⚔️ CONCLAVE</div>
            <div class="subtitle">Convite para Aventura</div>
          </div>
          
          <div class="content">
            <p>Saudações, aventureiro!</p>
            
            <p><strong>${masterName}</strong> te convida para participar da campanha:</p>
            
            <h2 class="campaign-name">
              🏰 ${campaignName}
            </h2>
            
            <p>Prepare seus dados e junte-se à mesa! Uma nova aventura te aguarda no mundo do RPG.</p>
            
            <div style="text-align: center;">
              <a href="${inviteLink}" class="invite-button">
                🎲 Aceitar Convite
              </a>
            </div>
            
            <p class="instructions">
              <strong style="color: #d4af37;">Como funciona:</strong><br>
              1. Clique no botão acima<br>
              2. Faça login ou crie sua conta<br>
              3. Você será automaticamente adicionado à campanha<br>
              4. Comece a jogar!
            </p>
          </div>
          
          <div class="footer">
            <p>Este convite expira em 7 dias.</p>
            <p>Se você não solicitou este convite, pode ignorar este email.</p>
            <p>© 2024 RPG Forja Estrelar - Sistema de RPG Online</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}

export default new EmailService();