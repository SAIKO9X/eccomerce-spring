import { Button } from "@mui/material";
import { useState } from "react";
import { DealTable } from "../component/deals/DealTable";
import { CreateDealForm } from "../component/deals/CreateDealForm";

const tabs = ["Promoções", "Criar Promoção"];

export const DealPage = () => {
  const [activeTab, setActiveTab] = useState("Promoções");

  return (
    <div className="">
      <h1 className="text-center text-2xl font-medium font-playfair pb-10">
        Personalize Sua Promoções
      </h1>

      <div className="flex items-center justify-center md:justify-start gap-4">
        {tabs.map((tab, index) => (
          <Button
            key={index}
            variant={activeTab === tab ? "contained" : "outlined"}
            onClick={() => setActiveTab(tab)}
            color="primary"
            size="small"
          >
            {tab}
          </Button>
        ))}
      </div>

      <div className="mt-5">
        {activeTab === "Promoções" ? (
          <DealTable />
        ) : (
          <div className="flex flex-col justify-center items-center mt-[10%]">
            <CreateDealForm />
          </div>
        )}
      </div>
    </div>
  );
};
