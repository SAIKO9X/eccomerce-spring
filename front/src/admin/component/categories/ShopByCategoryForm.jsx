import {
  Button,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useState } from "react";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { useAlert } from "../../../utils/useAlert";
import { updateHomeCategory } from "../../../state/admin/adminSlice";
import { useEffect } from "react";
import { fetchCategories } from "../../../state/admin/adminCategorySlice";

export const ShopByCategoryForm = ({ category, onSubmit, onClose }) => {
  const dispatch = useAppDispatch();
  const { showAlert, AlertComponent } = useAlert();
  const [imageUrl, setImageUrl] = useState(category?.image || "");

  const { categories, loading: categoriesLoading } = useAppSelector(
    (state) => state.categories
  );

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const levelThreeCategories =
    categories?.filter((cat) => cat.level === 3) || [];

  const getValidCategoryId = (categoryId) => {
    if (
      !categoryId ||
      !levelThreeCategories.some((cat) => cat.id === categoryId)
    ) {
      return "";
    }
    return categoryId;
  };

  const formik = useFormik({
    initialValues: {
      name: category?.name || "",
      image: category?.image || "",
      textButton: category?.textButton || "",
      categoryId: getValidCategoryId(category?.categoryId) || "",
    },
    onSubmit: async (values) => {
      const data = {
        name: values.name,
        image: imageUrl || values.image,
        textButton: values.textButton,
        categoryId: values.categoryId,
        section: "SHOP_BY_CATEGORIES",
      };

      console.log("valores enviados", data);

      try {
        await dispatch(updateHomeCategory({ id: category.id, data }))
          .unwrap()
          .then(() => {
            showAlert("Categoria atualizada com sucesso!", "success");
            if (typeof onSubmit === "function") onSubmit(data);
            if (typeof onClose === "function") onClose();
          });
      } catch (error) {
        console.error("Erro ao atualizar a categoria:", error);
        showAlert(`Erro ao atualizar a categoria: ${error}`, "error");
      }
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Nome da categoria é obrigatório";
      if (!values.image) errors.image = "Imagem é obrigatória";
      if (!values.categoryId) errors.categoryId = "Categoria é obrigatória";
      return errors;
    },
  });

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const url = await uploadToCloudinary(file);
        setImageUrl(url);
        formik.setFieldValue("image", url);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        showAlert("Erro ao carregar a imagem. Tente novamente.", "error");
      }
    }
  };

  if (categoriesLoading) return <div>Carregando categorias...</div>;

  return (
    <form onSubmit={formik.handleSubmit}>
      <AlertComponent />
      <h2 className="text-lg font-medium mb-4">
        Editar Categoria de Shop by Categories
      </h2>
      <Grid2 container spacing={4}>
        <TextField
          fullWidth
          label="Nome da Categoria"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={!!formik.errors.name}
          helperText={formik.errors.name}
        />

        <TextField
          fullWidth
          label="Texto do Botão"
          name="textButton"
          value={formik.values.textButton}
          onChange={formik.handleChange}
          error={!!formik.errors.textButton}
          helperText={formik.errors.textButton}
        />

        <FormControl fullWidth error={!!formik.errors.categoryId}>
          <InputLabel id="category-label">Categoria</InputLabel>
          <Select
            labelId="category-label"
            id="category-select"
            label="Categoria"
            name="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            error={!!formik.errors.categoryId}
          >
            {levelThreeCategories.map((item) => (
              <MenuItem key={item.id} value={item.id}>
                {item.name}
              </MenuItem>
            ))}
          </Select>
          {formik.errors.categoryId && (
            <p className="text-red-500 text-sm">{formik.errors.categoryId}</p>
          )}
        </FormControl>

        <FormControl fullWidth>
          <InputLabel shrink>Imagem da Categoria</InputLabel>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            style={{ marginTop: "8px" }}
          />
          {imageUrl && (
            <p style={{ marginTop: "8px" }}>
              Imagem atual:{" "}
              <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                Visualizar
              </a>
            </p>
          )}
        </FormControl>

        <Grid2 size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={formik.isSubmitting}
          >
            Salvar Alterações
          </Button>
          <Button
            variant="outlined"
            color="secondary"
            fullWidth
            sx={{ mt: 1 }}
            onClick={() => typeof onClose === "function" && onClose()}
            disabled={formik.isSubmitting}
          >
            Cancelar
          </Button>
        </Grid2>
      </Grid2>
    </form>
  );
};
