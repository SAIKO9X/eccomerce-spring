import { Stepper, Step, StepLabel, Button } from "@mui/material";
import { useState } from "react";
import { FirstStep } from "./FirstStep";
import { SecondStep } from "./SecondStep";
import { ThirdStep } from "./ThirdStep";
import { FourthStep } from "./FourthStep";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../state/store";
import { registerSeller } from "../../../state/seller/sellerAuthSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { sellerAccountSchema } from "./sellerSchema";

const steps = [
  "Detalhes Fiscais e Celular",
  "Endereço de Retirada",
  "Detalhes Bancários",
  "Detalhes do Fornecedor",
];

const stepFields = [
  ["mobile", "cnpj"],
  [
    "pickupAddress.recipient",
    "pickupAddress.mobile",
    "pickupAddress.cep",
    "pickupAddress.address",
    "pickupAddress.locality",
    "pickupAddress.city",
    "pickupAddress.state",
  ],
  [
    "bankDetails.accountNumber",
    "bankDetails.agencyNumber",
    "bankDetails.accountHolderName",
  ],
  [
    "sellerName",
    "businessDetails.businessName",
    "businessDetails.businessEmail",
    "businessDetails.businessPhone",
  ],
];

export const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm({
    resolver: zodResolver(sellerAccountSchema),
    mode: "onBlur",
    defaultValues: {
      mobile: "",
      cnpj: "",
      pickupAddress: {
        name: "",
        mobile: "",
        cep: "",
        address: "",
        locality: "",
        city: "",
        state: "",
      },
      bankDetails: {
        accountNumber: "",
        agencyNumber: "",
        accountHolderName: "",
      },
      sellerName: "",
      businessDetails: {
        businessName: "",
        businessEmail: "",
        businessPhone: "",
        logo: "",
        banner: "",
        businessAddress: "",
      },
      password: "",
    },
  });

  const handleNext = async () => {
    // Valida apenas os campos do passo atual
    const isStepValid = await trigger(stepFields[activeStep]);

    if (isStepValid) {
      if (activeStep < steps.length - 1) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      } else {
        // Se for o último passo, o botão agora será de submissão
        // A lógica de submissão será tratada pelo handleSubmit
      }
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    console.log("Formulário enviado:", data);
    try {
      await dispatch(registerSeller(data)).unwrap();
      navigate("/verify-seller-email");
    } catch (error) {
      console.error("Erro ao criar conta de vendedor:", error);
      alert("Erro ao criar conta. Tente novamente.");
    }
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-10 space-y-4">
        <div>
          {activeStep === 0 && <FirstStep control={control} errors={errors} />}
          {activeStep === 1 && <SecondStep control={control} errors={errors} />}
          {activeStep === 2 && <ThirdStep control={control} errors={errors} />}
          {activeStep === 3 && <FourthStep control={control} errors={errors} />}
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={handleBack}
            variant="contained"
            disabled={activeStep === 0}
          >
            Voltar
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button type="submit" variant="contained">
              Criar Conta
            </Button>
          ) : (
            <Button onClick={handleNext} variant="contained" type="button">
              Continuar
            </Button>
          )}
        </div>
      </form>
    </div>
  );
};
