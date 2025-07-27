// front/src/seller/components/becomeSeller/sellerSchema.js

import { z } from "zod";

// Regex para validar CNPJ (formato XX.XXX.XXX/XXXX-XX)
const cnpjRegex = /^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/;
// Regex para validar celular no formato (XX) XXXXX-XXXX
const mobileRegex = /^\(\d{2}\) \d{5}-\d{4}$/;
// Regex para validar CEP no formato XXXXX-XXX
const cepRegex = /^\d{5}-\d{3}$/;

export const firstStepSchema = z.object({
  mobile: z.string().regex(mobileRegex, "Use o formato (99) 99999-9999"),
  cnpj: z
    .string()
    .regex(cnpjRegex, "CNPJ inválido. Use o formato XX.XXX.XXX/XXXX-XX"),
});

export const secondStepSchema = z.object({
  pickupAddress: z.object({
    recipient: z.string().min(1, "Nome do destinatário é obrigatório"),
    mobile: z.string().regex(mobileRegex, "Use o formato (99) 99999-9999"),
    cep: z.string().regex(cepRegex, "CEP inválido. Use o formato XXXXX-XXX"),
    address: z.string().min(1, "Endereço é obrigatório"),
    locality: z.string().min(1, "Localidade é obrigatória"),
    city: z.string().min(1, "Cidade é obrigatória"),
    state: z.string().min(1, "Estado é obrigatório"),
  }),
});

export const thirdStepSchema = z.object({
  bankDetails: z.object({
    accountNumber: z.string().min(1, "Número da conta é obrigatório"),
    ifscCode: z.string().min(1, "Número da agência é obrigatório"),
    accountHoldName: z.string().min(1, "Nome do titular é obrigatório"),
  }),
});

export const fourthStepSchema = z.object({
  sellerName: z.string().min(1, "Nome do vendedor é obrigatório"),
  businessDetails: z.object({
    businessEmail: z
      .string()
      .email("Email da empresa inválido")
      .optional()
      .or(z.literal("")),
    businessName: z.string().min(1, "Nome da empresa é obrigatório"),
    businessPhone: z
      .string()
      .regex(mobileRegex, "Use o formato (99) 99999-9999"),
  }),
});

export const sellerAccountSchema = firstStepSchema
  .merge(secondStepSchema)
  .merge(thirdStepSchema)
  .merge(fourthStepSchema);
