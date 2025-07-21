import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Grid2,
  FormHelperText,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import {
  createCategory,
  deleteCategory,
  updateCategory,
} from "../../../state/admin/adminCategorySlice";
import { useAppDispatch, useAppSelector } from "../../../state/store";

export const CreateCategoriesForm = ({ onClose, category }) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);

  const formik = useFormik({
    initialValues: {
      name: category?.name || "",
      categoryId: category?.categoryId || "",
      level: category?.level || 1,
      parentCategoryId: category?.parentCategory?.categoryId || "",
    },
    onSubmit: (values) => {
      const categoryData = {
        name: values.name,
        categoryId: values.categoryId,
        level: values.level,
        parentCategoryId: values.parentCategoryId || null,
      };

      if (category) {
        dispatch(
          updateCategory({ id: category.id, category: categoryData })
        ).then(() => onClose());
      } else {
        dispatch(createCategory(categoryData)).then(() => onClose());
      }
    },
    validate: (values) => {
      const errors = {};
      if (!values.name) errors.name = "Nome é obrigatório";
      if (!values.categoryId) errors.categoryId = "categoryId é obrigatório";
      if (!values.level) errors.level = "Nível é obrigatório";
      return errors;
    },
  });

  const handleDelete = () => {
    if (
      category &&
      window.confirm("Tem certeza que deseja deletar esta categoria?")
    ) {
      dispatch(deleteCategory(category.id)).then(() => onClose());
    }
  };

  const parentCategories = categories?.filter((cat) => cat.level < 3) || [];

  useEffect(() => {
    if (category) {
      formik.setValues({
        name: category.name || "",
        categoryId: category.categoryId || "",
        level: category.level || 1,
        parentCategoryId: category.parentCategory?.categoryId || "",
      });
    }
  }, [category]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <h2 className="text-lg font-medium mb-4">
        {category ? "Editar Categoria" : "Criar Nova Categoria"}
      </h2>
      <Grid2 container spacing={2}>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Nome"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="categoryId"
            name="categoryId"
            value={formik.values.categoryId}
            onChange={formik.handleChange}
            error={
              formik.touched.categoryId && Boolean(formik.errors.categoryId)
            }
            helperText={formik.touched.categoryId && formik.errors.categoryId}
          />
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <FormControl
            fullWidth
            error={formik.touched.level && Boolean(formik.errors.level)}
          >
            <InputLabel>Nível</InputLabel>
            <Select
              name="level"
              value={formik.values.level}
              onChange={formik.handleChange}
              label="Nível"
            >
              <MenuItem value={1}>Nível 1</MenuItem>
              <MenuItem value={2}>Nível 2</MenuItem>
              <MenuItem value={3}>Nível 3</MenuItem>
            </Select>
            {formik.touched.level && formik.errors.level && (
              <FormHelperText>{formik.errors.level}</FormHelperText>
            )}
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel>Categoria Pai (Opcional)</InputLabel>
            <Select
              name="parentCategoryId"
              value={formik.values.parentCategoryId}
              onChange={formik.handleChange}
              label="Categoria Pai (Opcional)"
            >
              <MenuItem value="">Nenhum</MenuItem>
              {parentCategories.map((cat) => (
                <MenuItem key={cat.id} value={cat.categoryId}>
                  {cat.name} (Nível {cat.level})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid2>
        <Grid2 size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={formik.isSubmitting}
          >
            {category ? "Salvar Alterações" : "Criar Categoria"}
          </Button>
          {category && (
            <Button
              variant="contained"
              color="error"
              fullWidth
              sx={{ mt: 1 }}
              onClick={handleDelete}
              disabled={formik.isSubmitting}
            >
              Deletar Categoria
            </Button>
          )}
        </Grid2>
      </Grid2>
    </form>
  );
};
