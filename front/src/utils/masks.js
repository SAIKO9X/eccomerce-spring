// Remove todos os caracteres que não são dígitos
const unmask = (value) => value.replace(/\D/g, "");

// Aplica a máscara de Celular: (99) 99999-9999
export const maskMobile = (value) => {
  const unmasked = unmask(value);
  return unmasked
    .replace(/(\d{2})/, "($1) ")
    .replace(/(\d{5})/, "$1-")
    .slice(0, 15);
};

// Aplica a máscara de CNPJ: 99.999.999/9999-99
export const maskCNPJ = (value) => {
  const unmasked = unmask(value);
  return unmasked
    .replace(/(\d{2})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1.$2")
    .replace(/(\d{3})(\d)/, "$1/$2")
    .replace(/(\d{4})(\d)/, "$1-$2")
    .slice(0, 18); // Limita o tamanho total da string
};

// Aplica a máscara de CEP: 99999-999
export const maskCEP = (value) => {
  const unmasked = unmask(value);
  return unmasked.replace(/(\d{5})(\d)/, "$1-$2").slice(0, 9); // Limita o tamanho total da string
};
