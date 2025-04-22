export const REGEX_PATTERNS = {
  // Solo letras (incluyendo ñ, tildes y espacios)
  NOMBRES: /^[a-zA-ZÀ-ÿ\u00f1\u00d1\s]{2,50}$/,
  
  // Solo números, máximo 15 dígitos
  DOCUMENTO: /^\d{1,15}$/
};

export class ValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ValidationError';
  }
}

export const validarCampos = {
  nombres: (nombre: string): boolean => {
    if (!REGEX_PATTERNS.NOMBRES.test(nombre)) {
      throw new ValidationError('El nombre solo debe contener letras y espacios (2-50 caracteres)');
    }
    return true;
  },

  apellidos: (apellido: string): boolean => {
    if (!REGEX_PATTERNS.NOMBRES.test(apellido)) {
      throw new ValidationError('El apellido solo debe contener letras y espacios (2-50 caracteres)');
    }
    return true;
  },

  documento: (documento: string): boolean => {
    if (!REGEX_PATTERNS.DOCUMENTO.test(documento)) {
      throw new ValidationError('El documento solo debe contener números (máximo 15 dígitos)');
    }
    return true;
  }
}; 