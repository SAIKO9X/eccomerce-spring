import * as Yup from "yup";

// Regex para validar CNPJ (formato XX.XXX.XXX/XXXX-XX)
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
// Regex para validar celular no formato (XX) XXXXX-XXXX
const mobileRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
// Regex para validar CEP no formato XXXXX-XXX
const cepRegex = /^\d{5}-\d{3}$/;

export const firstStepSchema = Yup.object().shape({
  mobile: Yup.string()
    .matches(mobileRegex, "Use o formato (99) 99999-9999")
    .required("Número de celular é obrigatório"),
  cnpj: Yup.string()
    .matches(cnpjRegex, "CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX")
    .required("CNPJ é obrigatório"),
});

export const secondStepSchema = Yup.object().shape({
  pickupAddress: Yup.object().shape({
    recipient: Yup.string()
      .min(1, "Nome do destinatário é obrigatório")
      .required("Nome do destinatário é obrigatório"),
    mobile: Yup.string()
      .matches(mobileRegex, "Use o formato (99) 99999-9999")
      .required("Telefone é obrigatório"),
    cep: Yup.string()
      .matches(cepRegex, "CEP inválido. Use o formato XXXXX-XXX")
      .required("CEP é obrigatório"),
    address: Yup.string()
      .min(1, "Endereço é obrigatório")
      .required("Endereço é obrigatório"),
    locality: Yup.string()
      .min(1, "Localidade é obrigatória")
      .required("Localidade é obrigatória"),
    city: Yup.string()
      .min(1, "Cidade é obrigatória")
      .required("Cidade é obrigatória"),
    state: Yup.string()
      .min(1, "Estado é obrigatório")
      .required("Estado é obrigatório"),
  }),
});

export const thirdStepSchema = Yup.object().shape({
  bankDetails: Yup.object().shape({
    accountNumber: Yup.string()
      .min(1, "Número da conta é obrigatório")
      .required("Número da conta é obrigatório"),
    ifscCode: Yup.string()
      .min(1, "Número da agência é obrigatório")
      .required("Número da agência é obrigatório"),
    accountHoldName: Yup.string()
      .min(1, "Nome do titular é obrigatório")
      .required("Nome do titular é obrigatório"),
  }),
});

export const fourthStepSchema = Yup.object().shape({
  sellerName: Yup.string()
    .min(1, "Nome do vendedor é obrigatório")
    .required("Nome do vendedor é obrigatório"),
  businessDetails: Yup.object().shape({
    businessEmail: Yup.string()
      .email("Email da empresa inválido")
      .notRequired(),
    businessName: Yup.string()
      .min(1, "Nome da empresa é obrigatório")
      .required("Nome da empresa é obrigatório"),
    businessPhone: Yup.string()
      .matches(mobileRegex, "Use o formato (99) 99999-9999")
      .required("Telefone da empresa é obrigatório"),
  }),
});

export const sellerAccountSchema = Yup.object().shape({
  ...firstStepSchema.fields,
  ...secondStepSchema.fields,
  ...thirdStepSchema.fields,
  ...fourthStepSchema.fields,
});
