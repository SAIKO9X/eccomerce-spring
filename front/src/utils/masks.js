// utils/masks.js

export const maskMobile = (value) => {
  if (!value) return "";

  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 11 dígitos
  const limitedNumbers = numbers.slice(0, 11);

  // Aplica a máscara (99) 99999-9999
  if (limitedNumbers.length <= 2) {
    return `(${limitedNumbers}`;
  } else if (limitedNumbers.length <= 7) {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(2)}`;
  } else {
    return `(${limitedNumbers.slice(0, 2)}) ${limitedNumbers.slice(
      2,
      7
    )}-${limitedNumbers.slice(7)}`;
  }
};

export const maskCEP = (value) => {
  if (!value) return "";

  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 8 dígitos
  const limitedNumbers = numbers.slice(0, 8);

  // Aplica a máscara 99999-999
  if (limitedNumbers.length <= 5) {
    return limitedNumbers;
  } else {
    return `${limitedNumbers.slice(0, 5)}-${limitedNumbers.slice(5)}`;
  }
};

export const maskCNPJ = (value) => {
  if (!value) return "";

  // Remove tudo que não é número
  const numbers = value.replace(/\D/g, "");

  // Limita a 14 dígitos
  const limitedNumbers = numbers.slice(0, 14);

  // Aplica a máscara XX.XXX.XXX/XXXX-XX
  if (limitedNumbers.length <= 2) {
    return limitedNumbers;
  } else if (limitedNumbers.length <= 5) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(2)}`;
  } else if (limitedNumbers.length <= 8) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(
      2,
      5
    )}.${limitedNumbers.slice(5)}`;
  } else if (limitedNumbers.length <= 12) {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(
      2,
      5
    )}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(8)}`;
  } else {
    return `${limitedNumbers.slice(0, 2)}.${limitedNumbers.slice(
      2,
      5
    )}.${limitedNumbers.slice(5, 8)}/${limitedNumbers.slice(
      8,
      12
    )}-${limitedNumbers.slice(12)}`;
  }
};

// Função auxiliar para permitir apenas números
export const onlyNumbers = (value) => {
  if (!value) return "";
  return value.replace(/\D/g, "");
};
