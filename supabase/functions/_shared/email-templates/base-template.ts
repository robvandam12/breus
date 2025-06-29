
export interface BaseEmailProps {
  title: string;
  previewText: string;
  children: string;
}

export const createBaseEmailTemplate = ({ title, previewText, children }: BaseEmailProps) => `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="x-apple-disable-message-reformatting">
  <title>${title}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      line-height: 1.6;
      color: #374151;
      background-color: #f8fafc;
    }
    
    .email-container {
      max-width: 600px;
      margin: 0 auto;
      background-color: #ffffff;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
    }
    
    .email-header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      padding: 40px 30px;
      text-align: center;
      position: relative;
    }
    
    .logo {
      width: 60px;
      height: 60px;
      background-color: white;
      border-radius: 50%;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 16px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    }
    
    .logo-text {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      background-clip: text;
      font-weight: 700;
      font-size: 24px;
    }
    
    .brand-name {
      color: white;
      font-size: 28px;
      font-weight: 700;
      margin: 0;
      letter-spacing: -0.5px;
    }
    
    .brand-tagline {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      font-weight: 500;
      margin: 8px 0 0 0;
    }
    
    .email-content {
      padding: 40px 30px;
    }
    
    .email-footer {
      background-color: #f8fafc;
      padding: 30px;
      text-align: center;
      border-top: 1px solid #e5e7eb;
    }
    
    .footer-text {
      color: #6b7280;
      font-size: 12px;
      line-height: 1.5;
      margin: 0;
    }
    
    .footer-link {
      color: #3b82f6;
      text-decoration: none;
    }
    
    .footer-link:hover {
      text-decoration: underline;
    }
    
    @media only screen and (max-width: 600px) {
      .email-container {
        margin: 10px;
        border-radius: 8px;
      }
      
      .email-header {
        padding: 30px 20px;
      }
      
      .email-content {
        padding: 30px 20px;
      }
      
      .email-footer {
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div style="padding: 20px 0;">
    <div class="email-container">
      <div class="email-header">
        <div class="logo">
          <div class="logo-text">B</div>
        </div>
        <h1 class="brand-name">Breus</h1>
        <p class="brand-tagline">Plataforma de Gestión de Buceo Profesional</p>
      </div>
      
      <div class="email-content">
        ${children}
      </div>
      
      <div class="email-footer">
        <p class="footer-text">
          © 2024 Breus Platform. Plataforma de gestión de buceo profesional para la industria salmonicultora.
        </p>
        <p class="footer-text" style="margin-top: 12px;">
          <a href="mailto:soporte@breus.cl" class="footer-link">soporte@breus.cl</a> | 
          <a href="https://breus.cl" class="footer-link">breus.cl</a>
        </p>
      </div>
    </div>
  </div>
  
  <!-- Preview text (hidden) -->
  <div style="display: none; font-size: 1px; color: #ffffff; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden;">
    ${previewText}
  </div>
</body>
</html>
`;
