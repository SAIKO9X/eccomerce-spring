import {
  Stepper,
  Step,
  StepLabel,
  Button,
  CircularProgress,
} from "@mui/material";
import { useEffect, useState } from "react";
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
    "bankDetails.ifscCode",
    "bankDetails.accountHoldName",
  ],
  [
    "sellerName",
    "businessDetails.businessName",
    "businessDetails.businessEmail",
    "businessDetails.businessMobile",
  ],
];

export const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    watch,
    setValue,
    clearErrors,
  } = useForm({
    resolver: zodResolver(sellerAccountSchema),
    mode: "onBlur",
    defaultValues: {
      mobile: "",
      cnpj: "",
      pickupAddress: {
        recipient: "",
        mobile: "",
        cep: "",
        address: "",
        locality: "",
        city: "",
        state: "",
      },
      bankDetails: {
        accountNumber: "",
        ifscCode: "",
        accountHoldName: "",
      },
      sellerName: "",
      businessDetails: {
        businessName: "",
        businessEmail: "",
        businessPhone: "",
        logo: "",
      },
    },
  });

  const mainMobile = watch("mobile");

  useEffect(() => {
    if (mainMobile) {
      const options = {
        shouldDirty: false,
        shouldTouch: false,
        shouldValidate: false,
      };
      setValue("pickupAddress.mobile", mainMobile, options);
      setValue("businessDetails.businessPhone", mainMobile, options);
    }
  }, [mainMobile, setValue]);

  const handleNext = async () => {
    const isStepValid = await trigger(stepFields[activeStep]);
    if (isStepValid && activeStep < steps.length - 1) {
      clearErrors(stepFields[activeStep + 1]);
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const onSubmit = async (data) => {
    setSubmitFailed(false);
    setIsSubmitting(true);
    console.log("Formulário enviado:", data);
    try {
      await dispatch(registerSeller(data)).unwrap();
      navigate("/verify-seller-email");
    } catch (error) {
      console.error("Erro ao criar conta de vendedor:", error);
      alert("Erro ao criar conta. Tente novamente.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const onInvalid = (validationErrors) => {
    console.log("Validação falhou:", validationErrors);
    setSubmitFailed(true);
  };

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            {" "}
            <StepLabel>{label}</StepLabel>{" "}
          </Step>
        ))}
      </Stepper>

      <form
        onSubmit={handleSubmit(onSubmit, onInvalid)}
        className="mt-10 space-y-4"
      >
        <div>
          {activeStep === 0 && <FirstStep control={control} errors={errors} />}
          {activeStep === 1 && <SecondStep control={control} errors={errors} />}
          {activeStep === 2 && <ThirdStep control={control} errors={errors} />}
          {activeStep === 3 && (
            <FourthStep
              control={control}
              errors={errors}
              submitFailed={submitFailed}
            />
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={handleBack}
            variant="contained"
            disabled={activeStep === 0 || isSubmitting}
          >
            Voltar
          </Button>

          {activeStep === steps.length - 1 ? (
            <Button type="submit" variant="contained" disabled={isSubmitting}>
              {isSubmitting ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Criar Conta"
              )}
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
