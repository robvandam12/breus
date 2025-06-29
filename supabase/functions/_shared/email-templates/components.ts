
export const createButton = (text: string, url: string, variant: 'primary' | 'secondary' | 'danger' = 'primary') => {
  const styles = {
    primary: 'background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white;',
    secondary: 'background: #f3f4f6; color: #374151; border: 1px solid #d1d5db;',
    danger: 'background: linear-gradient(135deg, #dc2626 0%, #ef4444 100%); color: white;'
  };
  
  return `
    <div style="text-align: center; margin: 32px 0;">
      <a href="${url}" 
         style="display: inline-block; 
                padding: 16px 32px; 
                ${styles[variant]}
                text-decoration: none; 
                border-radius: 8px; 
                font-weight: 600; 
                font-size: 16px; 
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s;"
         onmouseover="this.style.transform='translateY(-1px)'"
         onmouseout="this.style.transform='translateY(0)'">
        ${text}
      </a>
    </div>
  `;
};

export const createInfoCard = (title: string, content: string, variant: 'info' | 'warning' | 'success' | 'danger' = 'info') => {
  const styles = {
    info: 'background: #eff6ff; border: 1px solid #bfdbfe; color: #1e40af;',
    warning: 'background: #fffbeb; border: 1px solid #fde68a; color: #92400e;',
    success: 'background: #f0fdf4; border: 1px solid #bbf7d0; color: #166534;',
    danger: 'background: #fef2f2; border: 1px solid #fecaca; color: #dc2626;'
  };
  
  const icons = {
    info: '💡',
    warning: '⚠️',
    success: '✅',
    danger: '🚨'
  };
  
  return `
    <div style="margin: 24px 0; padding: 20px; border-radius: 8px; ${styles[variant]}">
      <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
        <span style="font-size: 16px;">${icons[variant]}</span>
        <h3 style="margin: 0; font-size: 16px; font-weight: 600;">${title}</h3>
      </div>
      <div style="color: inherit; font-size: 14px; line-height: 1.5;">
        ${content}
      </div>
    </div>
  `;
};

export const createTable = (headers: string[], rows: string[][]) => {
  const headerRow = headers.map(h => `<th style="padding: 12px; text-align: left; background: #f9fafb; font-weight: 600; color: #374151;">${h}</th>`).join('');
  const bodyRows = rows.map(row => 
    `<tr>${row.map(cell => `<td style="padding: 12px; border-top: 1px solid #e5e7eb; color: #6b7280;">${cell}</td>`).join('')}</tr>`
  ).join('');
  
  return `
    <div style="margin: 24px 0; overflow-x: auto;">
      <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; border: 1px solid #e5e7eb;">
        <thead>
          <tr>${headerRow}</tr>
        </thead>
        <tbody>
          ${bodyRows}
        </tbody>
      </table>
    </div>
  `;
};

export const createSection = (title: string, content: string) => {
  return `
    <div style="margin: 32px 0;">
      <h2 style="color: #1f2937; font-size: 20px; font-weight: 600; margin: 0 0 16px 0; padding-bottom: 8px; border-bottom: 2px solid #e5e7eb;">
        ${title}
      </h2>
      <div style="color: #4b5563; font-size: 16px; line-height: 1.6;">
        ${content}
      </div>
    </div>
  `;
};
