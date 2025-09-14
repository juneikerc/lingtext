/**
 * Client-side validation utilities for UX and performance
 * 
 * IMPORTANT SECURITY NOTE:
 * These validations run in the browser and can be bypassed by users.
 * They are NOT security measures - only UX helpers for better user experience.
 * 
 * Since this app stores data locally in IndexedDB and only sends text to
 * the /translate endpoint (which has its own server-side validation),
 * client-side "security" validation is not meaningful.
 */

export interface ValidationResult {
  isValid: boolean;
  error?: string;
  warnings?: string[];
}

/**
 * Validates text content for UX and performance issues (client-side only)
 * Note: This is NOT a security measure since it runs in the browser
 */
export function validateTextContent(content: string, filename?: string): ValidationResult {
  const warnings: string[] = [];
  
  // Check if content is empty
  if (!content || content.trim().length === 0) {
    return {
      isValid: false,
      error: "El archivo está vacío o no contiene texto válido."
    };
  }

  // Check file size for performance (5MB limit)
  const maxSize = 5 * 1024 * 1024; // 5MB
  const contentSize = new Blob([content]).size;
  if (contentSize > maxSize) {
    return {
      isValid: false,
      error: `El archivo es demasiado grande (${(contentSize / 1024 / 1024).toFixed(2)}MB). Máximo permitido: 5MB para mejor rendimiento.`
    };
  }

  // Check for excessive HTML tags (UX warning)
  const htmlTagCount = (content.match(/<[^>]+>/g) || []).length;
  const totalLines = content.split('\n').length;
  if (htmlTagCount > totalLines * 0.1) {
    warnings.push("El archivo contiene muchas etiquetas HTML. El lector funciona mejor con texto plano.");
  }

  // Check for very long lines (performance warning)
  const lines = content.split('\n');
  const longLines = lines.filter(line => line.length > 1000);
  if (longLines.length > 0) {
    warnings.push(`${longLines.length} línea(s) muy largas detectadas. Podrían afectar el rendimiento de lectura.`);
  }

  // Check encoding issues (UX warning)
  const encodingIssues = [
    /Ã¡|Ã©|Ã­|Ã³|Ãº/g, // Common UTF-8 mojibake
    /â€™|â€œ|â€/g, // Smart quotes mojibake
  ];

  for (const pattern of encodingIssues) {
    if (pattern.test(content)) {
      warnings.push("Posibles problemas de codificación detectados. Verifica que el archivo esté en UTF-8.");
      break;
    }
  }

  return {
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}

/**
 * Validates and sanitizes title input
 */
export function validateTitle(title: string): ValidationResult {
  if (!title || title.trim().length === 0) {
    return {
      isValid: false,
      error: "El título no puede estar vacío."
    };
  }

  const trimmedTitle = title.trim();
  
  if (trimmedTitle.length > 200) {
    return {
      isValid: false,
      error: "El título no puede tener más de 200 caracteres."
    };
  }

  // Check for suspicious characters
  const suspiciousChars = /[<>\"'&]/;
  if (suspiciousChars.test(trimmedTitle)) {
    return {
      isValid: false,
      error: "El título contiene caracteres no permitidos."
    };
  }

  return { isValid: true };
}

/**
 * Sanitizes text content for safe display in the browser
 * Removes HTML tags and escapes entities to prevent XSS when rendering
 * This IS a legitimate security measure since it prevents XSS in the UI
 */
export function sanitizeTextContent(content: string): string {
  return content
    // Remove HTML tags
    .replace(/<[^>]*>/g, '')
    // Escape HTML entities
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    // Remove null bytes and other control characters
    .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '')
    // Normalize whitespace
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n');
}

/**
 * Validates file type and extension (UX helper, not security)
 * Note: This validation can be bypassed by users, it's only for better UX
 */
export function validateFileType(file: File, allowedTypes: string[] = ['text/plain']): ValidationResult {
  const warnings: string[] = [];
  
  // Check file extension (UX guidance)
  const fileName = file.name.toLowerCase();
  const textExtensions = ['.txt', '.text'];
  const hasTextExtension = textExtensions.some(ext => fileName.endsWith(ext));
  
  if (!hasTextExtension) {
    warnings.push(`Archivo con extensión inusual detectado. Se recomienda usar archivos .txt para mejor compatibilidad.`);
  }

  // Check file size for performance
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return {
      isValid: false,
      error: `Archivo demasiado grande (${(file.size / 1024 / 1024).toFixed(2)}MB). Máximo recomendado: 10MB para mejor rendimiento.`
    };
  }

  return { 
    isValid: true,
    warnings: warnings.length > 0 ? warnings : undefined
  };
}
