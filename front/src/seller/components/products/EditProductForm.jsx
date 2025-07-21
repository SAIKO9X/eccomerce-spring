import { useState, useEffect } from "react";
import {
  Button,
  CircularProgress,
  FormControl,
  Grid2,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  FormHelperText,
  Autocomplete,
} from "@mui/material";
import { AddPhotoAlternate, Close } from "@mui/icons-material";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { fetchCategories } from "../../../state/admin/adminCategorySlice";
import { updateProduct } from "../../../state/seller/sellerProductSlice";
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

export const EditProductForm = ({ product, onClose }) => {
  const dispatch = useAppDispatch();
  const { categories } = useAppSelector((state) => state.categories);
  const { loading } = useAppSelector((state) => state.sellerProduct);
  const [uploadImage, setUploadImage] = useState(false);

  // Encontra a hierarquia de categorias do produto existente
  const findCategoryHierarchy = () => {
    const cat3 = categories.find(
      (c) => c.categoryId === product.category.categoryId
    );
    const cat2 = cat3
      ? categories.find((c) => c.id === cat3.parentCategory?.id)
      : null;
    const cat1 = cat2
      ? categories.find((c) => c.id === cat2.parentCategory?.id)
      : null;
    return {
      category: cat1?.categoryId || "",
      category2: cat2?.categoryId || "",
      category3: cat3?.categoryId || "",
    };
  };

  const formik = useFormik({
    initialValues: {
      title: product?.title || "",
      description: product?.description || "",
      basePrice: product?.basePrice || "",
      sellingPrice: product?.sellingPrice || "",
      quantity: product?.quantity || "",
      colors: product?.colors || [],
      images: product?.images || [],
      sizes: product?.sizes || [],
      category: "",
      category2: "",
      category3: "",
      brand: product?.brand || "",
    },
    validationSchema,
    onSubmit: (values) => {
      const productData = {
        ...values,
        category: {
          categoryId: values.category3,
        },
      };
      delete productData.category2;
      delete productData.category3;

      const jwt = localStorage.getItem("jwt");
      dispatch(updateProduct({ productId: product.id, productData, jwt }));
      onClose();
    },
  });

  useEffect(() => {
    if (categories.length > 0 && product) {
      const hierarchy = findCategoryHierarchy();
      formik.setFieldValue("category", hierarchy.category);
      formik.setFieldValue("category2", hierarchy.category2);
      formik.setFieldValue("category3", hierarchy.category3);
    }
  }, [categories, product]);

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
    if (!categories) return [];
    if (level === 1) return categories.filter((cat) => cat.level === 1);
    return categories.filter(
      (cat) =>
        cat.level === level &&
        cat.parentCategory?.categoryId === parentCategoryId
    );
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit} className="p-4">
        <Grid2 container spacing={3}>
          {/* Seção de Imagens */}
          <Grid2 size={12}>
            <FormControl
              fullWidth
              error={formik.touched.images && Boolean(formik.errors.images)}
            >
              <p className="text-sm text-zinc-600 mb-2">Imagens do Produto *</p>
              <div className="flex flex-wrap gap-4 items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{ display: "none" }}
                  id="image-upload-edit"
                />
                <label className="relative" htmlFor="image-upload-edit">
                  <span className="w-24 h-24 cursor-pointer flex items-center justify-center border-2 border-dashed border-zinc-400 rounded-md text-zinc-500 hover:bg-zinc-50 transition-colors">
                    <AddPhotoAlternate fontSize="large" />
                  </span>
                  {uploadImage && (
                    <div className="absolute inset-0 w-24 h-24 flex items-center justify-center bg-black/30 rounded-md">
                      <CircularProgress size={24} color="inherit" />
                    </div>
                  )}
                </label>
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
                        top: -5,
                        right: -5,
                        backgroundColor: "white",
                        "&:hover": { backgroundColor: "#f0f0f0" },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </div>
                ))}
              </div>
              {formik.touched.images && formik.errors.images && (
                <FormHelperText>{formik.errors.images}</FormHelperText>
              )}
            </FormControl>
          </Grid2>

          <Grid2 size={6}>
            <TextField
              fullWidth
              required
              label="Título"
              name="title"
              value={formik.values.title}
              onChange={formik.handleChange}
              error={formik.touched.title && Boolean(formik.errors.title)}
              helperText={formik.touched.title && formik.errors.title}
            />
          </Grid2>

          <Grid2 size={6}>
            <TextField
              fullWidth
              label="Marca"
              name="brand"
              value={formik.values.brand}
              onChange={formik.handleChange}
            />
          </Grid2>

          <Grid2 size={12}>
            <TextField
              fullWidth
              required
              multiline
              rows={3}
              label="Descrição"
              name="description"
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

          {/* Categorias */}
          <Grid2 size={4}>
            <FormControl fullWidth required>
              <InputLabel>Categoria Principal</InputLabel>
              <Select
                label="Categoria Principal"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
              >
                {childCategories(1).map((cat) => (
                  <MenuItem key={cat.id} value={cat.categoryId}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={4}>
            <FormControl fullWidth required>
              <InputLabel>Segunda Categoria</InputLabel>
              <Select
                label="Segunda Categoria"
                name="category2"
                value={formik.values.category2}
                onChange={formik.handleChange}
              >
                {childCategories(2, formik.values.category).map((cat) => (
                  <MenuItem key={cat.id} value={cat.categoryId}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={4}>
            <FormControl
              fullWidth
              required
              error={
                formik.touched.category3 && Boolean(formik.errors.category3)
              }
            >
              <InputLabel>Terceira Categoria</InputLabel>
              <Select
                label="Terceira Categoria"
                name="category3"
                value={formik.values.category3}
                onChange={formik.handleChange}
              >
                {childCategories(3, formik.values.category2).map((cat) => (
                  <MenuItem key={cat.id} value={cat.categoryId}>
                    {cat.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.touched.category3 && formik.errors.category3 && (
                <FormHelperText>{formik.errors.category3}</FormHelperText>
              )}
            </FormControl>
          </Grid2>

          {/* Preço */}
          <Grid2 size={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Preço Base"
              name="basePrice"
              value={formik.values.basePrice}
              onChange={formik.handleChange}
              error={
                formik.touched.basePrice && Boolean(formik.errors.basePrice)
              }
              helperText={formik.touched.basePrice && formik.errors.basePrice}
            />
          </Grid2>

          <Grid2 size={6}>
            <TextField
              fullWidth
              required
              type="number"
              label="Preço de Venda"
              name="sellingPrice"
              value={formik.values.sellingPrice}
              onChange={formik.handleChange}
              error={
                formik.touched.sellingPrice &&
                Boolean(formik.errors.sellingPrice)
              }
              helperText={
                formik.touched.sellingPrice && formik.errors.sellingPrice
              }
            />
          </Grid2>

          {/* Tamanhos */}
          <Grid2 size={12}>
            <Autocomplete
              multiple
              freeSolo
              id="sizes-tags"
              options={[]}
              value={formik.values.sizes}
              onChange={(event, newValue) => {
                formik.setFieldValue("sizes", newValue);
              }}
              renderInput={(params) => (
                <TextField {...params} variant="outlined" label="Tamanhos" />
              )}
            />
          </Grid2>

          {/* Cor, Estoque */}

          <Grid2 size={12}>
            <Autocomplete
              multiple
              id="colors-select-edit"
              options={colors.map((color) => color.name)}
              value={formik.values.colors}
              onChange={(event, newValue) => {
                formik.setFieldValue("colors", newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Cores" />}
            />
          </Grid2>

          <Grid2 size={12}>
            <TextField
              fullWidth
              required
              type="number"
              label="Quantidade em Estoque"
              name="quantity"
              value={formik.values.quantity}
              onChange={formik.handleChange}
              error={formik.touched.quantity && Boolean(formik.errors.quantity)}
              helperText={formik.touched.quantity && formik.errors.quantity}
            />
          </Grid2>

          {/* Botão de Ação */}
          <Grid2 xs={12}>
            <Button
              fullWidth
              sx={{ p: "1rem" }}
              type="submit"
              variant="contained"
              disabled={loading}
            >
              {loading ? (
                <CircularProgress size={24} color="inherit" />
              ) : (
                "Salvar Alterações"
              )}
            </Button>
          </Grid2>
        </Grid2>
      </form>
    </div>
  );
};
