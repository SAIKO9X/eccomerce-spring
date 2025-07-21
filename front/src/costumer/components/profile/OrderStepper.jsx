import { CheckCircle, FiberManualRecord } from "@mui/icons-material";
import { useEffect, useState } from "react";

const steps = [
  {
    name: "Pedido Realizado",
    description: "na Quinta, 11 de Julho",
    value: "PLACED",
  },
  {
    name: "Empacotado",
    description: "Item empacotado no armazém de despacho",
    value: "CONFIRMED",
  },
  {
    name: "Enviado",
    description: "até Segunda, 15 de Julho",
    value: "SHIPPED",
  },
  {
    name: "Chegando",
    description: "entre 16 de Julho - 18 de Julho",
    value: "ARRIVING",
  },
  {
    name: "Chegou",
    description: "entre 16 de Julho - 18 de Julho",
    value: "DELIVERED",
  },
];

const canceledStep = [
  {
    name: "Pedido Realizado",
    description: "na Quinta, 11 de Julho",
    value: "PLACED",
  },
  {
    name: "Pedido Cancelado",
    description: "na Quinta, 11 de Julho",
    value: "CANCELLED",
  },
];

const currentStep = 2;

export const OrderStepper = ({ orderStatus }) => {
  const [statusStep, setStatusStep] = useState(steps);

  useEffect(() => {
    if (orderStatus === "CANCELLED") {
      setStatusStep(canceledStep);
    } else {
      setStatusStep(steps);
    }
  }, [orderStatus]);

  return (
    <div className="mx-auto my-10">
      {statusStep.map((step, index) => (
        <>
          <div key={index} className="flex px-4">
            <div className="flex flex-col items-center">
              <div
                className={`z-10 w-8 h-8 rounded-full flex items-center justify-center  ${
                  index <= currentStep
                    ? "bg-black/20 text-black"
                    : "bg-black/10 text-black/20"
                }`}
              >
                {step.value === orderStatus ? (
                  <CheckCircle />
                ) : (
                  <FiberManualRecord sx={{ zIndex: -1 }} />
                )}
              </div>

              {index < statusStep.length - 1 && (
                <span
                  className={`border h-20 w-0.5 ${
                    index < currentStep ? "border-black" : "border-black/10"
                  }`}
                ></span>
              )}
            </div>

            <div className="ml-2 w-full">
              <div
                className={`${
                  step.value === orderStatus
                    ? "bg-black p-2 text-white font-medium rounded-md -translate-y-3"
                    : ""
                } ${
                  orderStatus === "CANCELLED" && step.value === orderStatus
                    ? "bg-red-500"
                    : ""
                } w-full`}
              >
                <p className="text-sm">{step.name}</p>
                <p
                  className={`${
                    step.value === orderStatus
                      ? "text-zinc-200"
                      : "text-zinc-400"
                  } text-xs`}
                >
                  {step.description}
                </p>
              </div>
            </div>
          </div>
        </>
      ))}
    </div>
  );
};
