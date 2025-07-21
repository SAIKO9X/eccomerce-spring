import { Stepper, Step, StepLabel, Button } from "@mui/material";
import { useState } from "react";
import { FirstStep } from "./FirstStep";
import { useFormik } from "formik";
import { SecondStep } from "./SecondStep";
import { ThirdStep } from "./ThirdStep";
import { FourthStep } from "./FourthStep";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../../state/store";
import { registerSeller } from "../../../state/seller/sellerAuthSlice";

const steps = [
  "Detalhes Fiscais e Celular",
  "Endereço de Retirada",
  "Detalhes Bancários",
  "Detalhes do Fornecedor",
];

export const SellerAccountForm = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleStep = (value) => () => {
    if (value === 1 && activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    } else if (value === -1 && activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    } else if (activeStep === steps.length - 1 && value === 1) {
      handleCreateAccount();
    }
  };

  const handleCreateAccount = async () => {
    try {
      await dispatch(registerSeller(formik.values)).unwrap();
      navigate("/verify-seller-email");
    } catch (error) {
      console.error("Erro ao criar conta de vendedor:", error);
      alert("Erro ao criar conta. Tente novamente.");
    }
  };

  const formik = useFormik({
    initialValues: {
      mobile: "",
      otp: "",
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
      sellerEmail: "",
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
    onSubmit: (values) => {
      console.log("Formik enviado:", values);
    },
  });

  return (
    <div>
      <Stepper activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={index}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>

      <div className="mt-10 space-y-4">
        <div>
          {activeStep === 0 ? (
            <FirstStep formik={formik} />
          ) : activeStep === 1 ? (
            <SecondStep formik={formik} />
          ) : activeStep === 2 ? (
            <ThirdStep formik={formik} />
          ) : activeStep === 3 ? (
            <FourthStep formik={formik} />
          ) : (
            ""
          )}
        </div>

        <div className="flex items-center justify-between">
          <Button
            onClick={handleStep(-1)}
            variant="contained"
            disabled={activeStep === 0}
          >
            Voltar
          </Button>

          <Button onClick={handleStep(1)} variant="contained">
            {activeStep === steps.length - 1 ? "Criar Conta" : "Continuar"}
          </Button>
        </div>
      </div>
    </div>
  );
};
