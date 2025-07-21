import { useState, useEffect } from "react";
import {
  Autocomplete,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { AddPhotoAlternate, Close } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { fetchCategories } from "../../../state/admin/adminCategorySlice";
import { createProduct } from "../../../state/seller/sellerProductSlice";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";
import { colors } from "../../../data/filter/color";
import { useFormik } from "formik";
import * as Yup from "yup";

const validationSchema = Yup.object().shape({
  title: Yup.string().required("Título é obrigatório"),
  description: Yup.string().required("Descrição é obrigatória"),
  basePrice: Yup.number()
    .positive("O preço base deve ser maior que zero.")
    .required("Preço base é obrigatório"),
  sellingPrice: Yup.number()
    .positive("O preço de venda deve ser maior que zero.")
    .required("Preço de venda é obrigatório"),
  quantity: Yup.number()
    .integer("A quantidade deve ser um número inteiro.")
    .min(0, "A quantidade não pode ser negativa.")
    .required("Quantidade é obrigatória"),
  category3: Yup.string().required("A categoria final é obrigatória"),
  images: Yup.array().min(1, "Adicione pelo menos uma imagem.").required(),
});

export const AddProductForm = () => {
  const dispatch = useAppDispatch();
  const {
    categories,
    loading: categoriesLoading,
    error,
  } = useAppSelector((state) => state.categories);
  const { loading: productLoading } = useAppSelector(
    (state) => state.sellerProduct
  );
  const [uploadImage, setUploadImage] = useState(false);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
      basePrice: "",
      sellingPrice: "",
      quantity: "",
      colors: [],
      images: [],
      sizes: [],
      category: "", // Nível 1
      category2: "", // Nível 2
      category3: "", // Nível 3
      brand: "",
    },
    validationSchema,
    onSubmit: (values) => {
      const request = {
        ...values,
        category: {
          categoryId: values.category3,
        },
      };
      delete request.category2;
      delete request.category3;

      dispatch(createProduct({ request, jwt: localStorage.getItem("jwt") }));
    },
  });

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleImageChange = async (event) => {
    const file = event.target.files[0];
    setUploadImage(true);
    const image = await uploadToCloudinary(file);
    formik.setFieldValue("images", [...formik.values.images, image]);
    setUploadImage(false);
  };

  const handleImageRemove = (index) => {
    const updatedImages = [...formik.values.images];
    updatedImages.splice(index, 1);
    formik.setFieldValue("images", updatedImages);
  };

  const childCategories = (level, parentCategoryId) => {
    if (level === 1)
      return categories.filter((cat) => cat.level === 1 && !cat.parentCategory);
    if (level === 2)
      return categories.filter(
        (cat) =>
          cat.level === 2 && cat.parentCategory?.categoryId === parentCategoryId
      );
    if (level === 3)
      return categories.filter(
        (cat) =>
          cat.level === 3 && cat.parentCategory?.categoryId === parentCategoryId
      );
    return [];
  };

  if (categoriesLoading) return <CircularProgress />;
  if (error) return <div>Erro ao carregar categorias: {error}</div>;

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="space-y-4 p-4">
        <Grid2 container spacing={4}>
          <Grid2 className="flex flex-wrap gap-5" size={{ xs: 12 }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: "none" }}
              id="image-upload"
            />

            <label className="relative" htmlFor="image-upload">
              <span className="w-24 h-24 cursor-pointer flex items-center justify-center border border-zinc-400 rounded-md text-zinc-400">
                <AddPhotoAlternate fontSize="large" />
              </span>

              {uploadImage && (
                <div className="absolute inset-0 w-24 h-24 flex items-center justify-center">
                  <CircularProgress />
                </div>
              )}
            </label>

            <div className="flex flex-wrap gap-2">
              {formik.values.images.map((image, index) => (
                <div key={index} className="relative">
                  <img
                    src={image}
                    alt={`Imagem do Produto ${index + 1}`}
                    className="w-24 h-24 object-cover rounded-md"
                  />
                  <IconButton
                    onClick={() => handleImageRemove(index)}
                    size="small"
                    color="error"
                    sx={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      outline: "none",
                    }}
                  >
                    <Close />
                  </IconButton>
                </div>
              ))}
            </div>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              required
              fullWidth
              label="Título"
              id="title"
              name="title"
              size="small"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              required
              multiline
              fullWidth
              rows={4}
              label="Descrição"
              id="description"
              name="description"
              size="small"
              value={formik.values.description}
              onChange={formik.handleChange}
              error={
                formik.touched.description && Boolean(formik.errors.description)
              }
              helperText={
                formik.touched.description && formik.errors.description
              }
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              type="text"
              inputMode="numeric"
              label="Preço Base"
              id="basePrice"
              name="basePrice"
              size="small"
              value={formik.values.basePrice}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                formik.setFieldValue("basePrice", numericValue);
              }}
              error={
                formik.touched.basePrice && Boolean(formik.errors.basePrice)
              }
              helperText={formik.touched.basePrice && formik.errors.basePrice}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              required
              type="text"
              inputMode="numeric"
              label="Preço de Venda"
              id="sellingPrice"
              name="sellingPrice"
              size="small"
              value={formik.values.sellingPrice}
              onChange={(e) => {
                const numericValue = e.target.value.replace(/[^0-9]/g, "");
                formik.setFieldValue("sellingPrice", numericValue);
              }}
              error={
                formik.touched.sellingPrice &&
                Boolean(formik.errors.sellingPrice)
              }
              helperText={
                formik.touched.sellingPrice && formik.errors.sellingPrice
              }
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Autocomplete
              multiple
              id="colors-select"
              options={colors.map((color) => color.name)}
              value={formik.values.colors}
              onChange={(event, newValue) => {
                formik.setFieldValue("colors", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Cores"
                  placeholder="Selecione as cores"
                  size="small"
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, md: 6 }}>
            <Autocomplete
              multiple
              freeSolo
              id="sizes-tags-add"
              options={[]}
              value={formik.values.sizes || []}
              onChange={(event, newValue) => {
                formik.setFieldValue("sizes", newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  label="Tamanhos"
                  placeholder="Adicione tamanhos"
                  size="small"
                />
              )}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl
              fullWidth
              required
              size="small"
              error={formik.touched.category && Boolean(formik.errors.category)}
            >
              <InputLabel id="category-label">Categoria Principal</InputLabel>
              <Select
                labelId="category-label"
                label="Categoria Principal"
                id="category"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
              >
                {childCategories(1, null).map((category) => (
                  <MenuItem key={category.id} value={category.categoryId}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.category && formik.errors.category && (
                <FormHelperText>{formik.errors.category}</FormHelperText>
              )}
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl
              fullWidth
              required
              size="small"
              error={
                formik.touched.category2 && Boolean(formik.errors.category2)
              }
            >
              <InputLabel id="category2-label">Segunda Categoria</InputLabel>
              <Select
                labelId="category2-label"
                label="Segunda Categoria"
                id="category2"
                name="category2"
                value={formik.values.category2}
                onChange={formik.handleChange}
              >
                {childCategories(2, formik.values.category).map((category) => (
                  <MenuItem key={category.id} value={category.categoryId}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.category2 && formik.errors.category2 && (
                <FormHelperText>{formik.errors.category2}</FormHelperText>
              )}
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6, lg: 4 }}>
            <FormControl
              fullWidth
              required
              size="small"
              error={
                formik.touched.category3 && Boolean(formik.errors.category3)
              }
            >
              <InputLabel id="category3-label">Terceira Categoria</InputLabel>
              <Select
                labelId="category3-label"
                label="Terceira Categoria"
                id="category3"
                name="category3"
                value={formik.values.category3}
                onChange={formik.handleChange}
              >
                {childCategories(3, formik.values.category2).map((category) => (
                  <MenuItem key={category.id} value={category.categoryId}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.category3 && formik.errors.category3 && (
                <FormHelperText>{formik.errors.category3}</FormHelperText>
              )}
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <TextField
              fullWidth
              label="Marca"
              id="brand"
              name="brand"
              size="small"
              value={formik.values.brand}
              onChange={formik.handleChange}
            />
          </Grid2>

          <Grid2 size={{ xs: 12 }}>
            <Button
              fullWidth
              sx={{ p: "1rem" }}
              type="submit"
              variant="outlined"
              disabled={productLoading}
            >
              {productLoading ? (
                <CircularProgress
                  size="small"
                  sx={{ width: "1.5rem", height: "1.5rem" }}
                />
              ) : (
                "Adicionar Produto"
              )}
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </div>
  );
};
