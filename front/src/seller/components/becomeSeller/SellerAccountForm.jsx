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
import { useFormik } from "formik";
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
    "businessDetails.businessPhone",
  ],
];

export const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const formik = useFormik({
    initialValues: {
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
    validationSchema: sellerAccountSchema,
    validateOnBlur: true,
    validateOnChange: false,
    onSubmit: async (values) => {
      setSubmitFailed(false);
      setIsSubmitting(true);
      console.log("Formulário enviado:", values);
      try {
        await dispatch(registerSeller(values)).unwrap();
        navigate("/verify-seller-email");
      } catch (error) {
        console.error("Erro ao criar conta de vendedor:", error);
        alert("Erro ao criar conta. Tente novamente.");
        setSubmitFailed(true);
        Object.keys(formik.values).forEach((field) => {
          formik.setFieldTouched(field, true, false);
        });
        await formik.validateForm();
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  useEffect(() => {
    if (formik.values.mobile) {
      formik.setFieldValue("pickupAddress.mobile", formik.values.mobile, false);
      formik.setFieldValue(
        "businessDetails.businessPhone",
        formik.values.mobile,
        false
      );
    }
  }, [formik.values.mobile]);

  const validateCurrentStep = async () => {
    try {
      await sellerAccountSchema.validate(formik.values, { abortEarly: false });
      return true;
    } catch (error) {
      const invalidFields = error.inner.map((err) => err.path);
      const currentStepFieldsSet = new Set(stepFields[activeStep]);
      const hasErrorsInCurrentStep = invalidFields.some((field) =>
        currentStepFieldsSet.has(field)
      );
      if (hasErrorsInCurrentStep) {
        invalidFields.forEach((field) => {
          if (currentStepFieldsSet.has(field)) {
            formik.setFieldTouched(field, true, false);
          }
        });
        await formik.validateForm();
      }
      return !hasErrorsInCurrentStep;
    }
  };

  const handleNext = async () => {
    const isStepValid = await validateCurrentStep();
    if (isStepValid && activeStep < steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
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
      <form onSubmit={formik.handleSubmit} className="mt-10 space-y-4">
        <div>
          {activeStep === 0 && <FirstStep formik={formik} />}
          {activeStep === 1 && <SecondStep formik={formik} />}
          {activeStep === 2 && <ThirdStep formik={formik} />}
          {activeStep === 3 && (
            <FourthStep formik={formik} submitFailed={submitFailed} />
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
