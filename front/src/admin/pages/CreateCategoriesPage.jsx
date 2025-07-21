import { useEffect } from "react";
import { CategoriesTable } from "../component/categories/CategoriesTable";
import { useState } from "react";
import { Button, Modal } from "@mui/material";
import { CreateCategoriesForm } from "../component/categories/CreateCategoriesForm";
import { fetchCategories } from "../../state/admin/adminCategorySlice";
import { useAppDispatch } from "../../state/store";

export const CreateCategoriesPage = () => {
  const dispatch = useAppDispatch();
  const [openModal, setOpenModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenModal = (category = null) => {
    setSelectedCategory(category);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedCategory(null);
  };

  return (
    <div>
      <h1 className="py-10 font-playfair font-medium text-2xl text-center">
        Crie e Organize as Categorias
      </h1>
      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpenModal()}
        sx={{ mb: 2, ml: 2 }}
      >
        Criar Nova Categoria
      </Button>
      <CategoriesTable onEdit={handleOpenModal} />
      <Modal open={openModal} onClose={handleCloseModal}>
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "white",
            padding: "20px",
            borderRadius: "8px",
            minWidth: "300px",
            maxWidth: "500px",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        >
          <CreateCategoriesForm
            onClose={handleCloseModal}
            category={selectedCategory}
          />
        </div>
      </Modal>
    </div>
  );
};
