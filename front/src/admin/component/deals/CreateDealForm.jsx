import {
  Button,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  Slider,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useState, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../state/store";
import { fetchCategories } from "../../../state/admin/adminCategorySlice";
import { createDeal, updateDeal } from "../../../state/admin/dealSlice";
import { getAllProducts } from "../../../state/customer/productSlice";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";
import { useAlert } from "../../../utils/useAlert";

export const CreateDealForm = ({ deal, onSubmit, onClose }) => {
  const dispatch = useAppDispatch();
  const {
    categories,
    loading: categoriesLoading,
    error: categoriesError,
  } = useAppSelector((state) => state.categories);
  const {
    products = [],
    loading: productsLoading,
    error: productsError,
  } = useAppSelector((state) => state.products || {});
  const [dealType, setDealType] = useState(deal?.dealType || "CATEGORY");
  const [imageUrl, setImageUrl] = useState(deal?.dealImage || "");

  const { showAlert, AlertComponent } = useAlert();

  useEffect(() => {
    dispatch(fetchCategories());
    dispatch(getAllProducts());
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
      dealType: deal?.dealType || "CATEGORY",
      discount: deal?.dealType === "CATEGORY" ? deal?.discount || 0 : 0,
      category: getValidCategoryId(deal?.category?.id) || "",
      dealName: deal?.dealName || "",
      product: deal?.product?.id || "",
      originalPrice: deal?.originalPrice || 0,
      discountedPrice: deal?.discountedPrice || 0,
      productDiscountPercent:
        deal?.dealType === "PRODUCT" ? deal?.productDiscountPercent || 0 : 0,
    },
    onSubmit: async (values) => {
      if (!["CATEGORY", "PRODUCT"].includes(values.dealType)) {
        console.error("dealType inválido:", values.dealType);
        showAlert("Erro: Tipo de promoção inválido.", "error");
        return;
      }

      const formData = new FormData();
      formData.append("dealType", values.dealType);

      if (values.dealType === "CATEGORY") {
        formData.append("discount", values.discount.toString());
        formData.append("categoryId", values.category);
        formData.append("dealName", values.dealName);
        formData.append("originalPrice", values.originalPrice.toString());
        formData.append("discountedPrice", values.discountedPrice.toString());
        if (imageUrl) {
          formData.append("dealImage", imageUrl);
        } else if (deal?.dealImage) {
          formData.append("dealImage", deal.dealImage);
        }
      } else if (values.dealType === "PRODUCT") {
        formData.append("productId", values.product);
        formData.append(
          "productDiscountPercent",
          values.productDiscountPercent.toString()
        );
        formData.append("originalPrice", values.originalPrice.toString());
        formData.append("discountedPrice", values.discountedPrice.toString());
        formData.append("dealName", values.dealName); // Adiciona o nome da promoção
        formData.append("dealImage", values.dealImage); // Adiciona a imagem da promoção
      }

      console.log("Dados enviados:");
      for (let pair of formData.entries()) {
        console.log(`${pair[0]}: ${pair[1]}`);
      }

      try {
        if (deal) {
          await dispatch(updateDeal({ id: deal.id, dealData: formData }))
            .unwrap()
            .then(() => {
              showAlert("Promoção atualizada com sucesso!", "success");
              if (typeof onSubmit === "function") onSubmit(formData);
              if (typeof onClose === "function") onClose();
            });
        } else {
          await dispatch(createDeal(formData))
            .unwrap()
            .then(() => {
              showAlert("Promoção criada com sucesso!", "success");
              if (typeof onClose === "function") onClose();
            });
        }
      } catch (error) {
        console.error("Erro ao salvar a promoção:", error);
        showAlert(`Erro ao salvar a promoção: ${error}`, "error");
      }
    },
    validate: (values) => {
      const errors = {};
      if (!values.dealType) errors.dealType = "Tipo de promoção é obrigatório";
      if (values.dealType === "CATEGORY") {
        if (!values.category) errors.category = "Categoria é obrigatória";
        if (!values.dealName)
          errors.dealName = "Nome da promoção é obrigatório";
        if (values.originalPrice <= 0)
          errors.originalPrice = "Preço original deve ser maior que zero";
      } else if (values.dealType === "PRODUCT") {
        if (!values.product) errors.product = "Produto é obrigatório";
      }
      return errors;
    },
  });

  const handleDealTypeChange = (event) => {
    const newDealType = event.target.value;
    setDealType(newDealType);
    formik.setFieldValue("dealType", newDealType);

    if (newDealType === "CATEGORY") {
      formik.setFieldValue("product", "");
      formik.setFieldValue("originalPrice", 0);
      formik.setFieldValue("discountedPrice", 0);
      formik.setFieldValue("productDiscountPercent", 0);
    } else if (newDealType === "PRODUCT") {
      formik.setFieldValue("category", "");
      formik.setFieldValue("discount", 0);
      formik.setFieldValue("dealName", "");
      setImageUrl("");
    }
  };

  const handleProductChange = (event) => {
    const productId = event.target.value;
    formik.setFieldValue("product", productId);

    const selectedProduct = products.find(
      (prod) => prod.id === Number(productId)
    );
    if (selectedProduct) {
      formik.setFieldValue("dealName", selectedProduct.title);
      formik.setFieldValue("dealImage", selectedProduct.images[0] || "");
      formik.setFieldValue("originalPrice", selectedProduct.basePrice);
      formik.setFieldValue("discountedPrice", selectedProduct.sellingPrice);

      const discountPercent = calculateDiscountPercent(
        selectedProduct.basePrice,
        selectedProduct.sellingPrice
      );
      formik.setFieldValue("productDiscountPercent", discountPercent);
    }
  };

  const calculateDiscountPercent = (originalPrice, discountedPrice) => {
    if (originalPrice <= 0 || discountedPrice < 0) return 0;
    const discount = ((originalPrice - discountedPrice) / originalPrice) * 100;
    return Math.round(discount);
  };

  const updateDiscountedPrice = (percentDiscount, originalPrice) => {
    if (originalPrice <= 0 || percentDiscount < 0) return 0;
    const discountAmount = (percentDiscount / 100) * originalPrice;
    return Math.round((originalPrice - discountAmount) * 100) / 100;
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const url = await uploadToCloudinary(file);
        setImageUrl(url);
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        showAlert("Erro ao carregar a imagem. Tente novamente.", "error");
      }
    }
  };

  if (categoriesLoading || productsLoading) return <div>Carregando...</div>;
  if (categoriesError)
    return <div>Erro ao carregar categorias: {categoriesError}</div>;
  if (productsError)
    return <div>Erro ao carregar produtos: {productsError}</div>;

  return (
    <form onSubmit={formik.handleSubmit}>
      <AlertComponent />
      <h2 className="text-lg font-medium mb-4">
        {deal ? "Editar Promoção" : "Adicione uma Promoção"}
      </h2>
      <Grid2 container spacing={4}>
        <FormControl fullWidth error={!!formik.errors.dealType}>
          <InputLabel id="deal-type-label">Tipo de Promoção</InputLabel>
          <Select
            labelId="deal-type-label"
            id="deal-type-select"
            label="Tipo de Promoção"
            value={formik.values.dealType}
            onChange={handleDealTypeChange}
            error={!!formik.errors.dealType}
          >
            <MenuItem value="CATEGORY">Categoria</MenuItem>
            <MenuItem value="PRODUCT">Produto</MenuItem>
          </Select>
          {formik.errors.dealType && (
            <p className="text-red-500 text-sm">{formik.errors.dealType}</p>
          )}
        </FormControl>

        {dealType === "CATEGORY" && (
          <>
            <FormControl fullWidth error={!!formik.errors.category}>
              <InputLabel id="category-label">Categoria</InputLabel>
              <Select
                labelId="category-label"
                id="category-select"
                label="Categoria"
                name="category"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={!!formik.errors.category}
              >
                {levelThreeCategories.map((item) => (
                  <MenuItem key={item.id} value={item.id}>
                    {item.name}
                  </MenuItem>
                ))}
              </Select>
              {formik.errors.category && (
                <p className="text-red-500 text-sm">{formik.errors.category}</p>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Nome da Promoção"
              name="dealName"
              value={formik.values.dealName}
              onChange={formik.handleChange}
              error={!!formik.errors.dealName}
              helperText={formik.errors.dealName}
            />

            <TextField
              fullWidth
              label="Preço Original"
              type="number"
              name="originalPrice"
              value={formik.values.originalPrice}
              onChange={(e) => {
                const value = Number(e.target.value);
                formik.setFieldValue("originalPrice", value);
                const newDiscountedPrice = updateDiscountedPrice(
                  formik.values.discount,
                  value
                );
                formik.setFieldValue("discountedPrice", newDiscountedPrice);
              }}
              InputProps={{ inputProps: { min: 0 } }}
              error={!!formik.errors.originalPrice}
              helperText={formik.errors.originalPrice}
            />

            <TextField
              fullWidth
              label="Preço com Desconto"
              type="number"
              name="discountedPrice"
              value={formik.values.discountedPrice}
              InputProps={{ inputProps: { min: 0, readOnly: true } }}
              error={!!formik.errors.discountedPrice}
              helperText={formik.errors.discountedPrice}
            />

            <div className="w-full">
              <p className="text-zinc-500 pb-2">Desconto (%)</p>
              <Slider
                size="small"
                name="discount"
                value={formik.values.discount}
                onChange={(event, newValue) => {
                  formik.setFieldValue("discount", newValue);
                  const newDiscountedPrice = updateDiscountedPrice(
                    newValue,
                    formik.values.originalPrice
                  );
                  formik.setFieldValue("discountedPrice", newDiscountedPrice);
                }}
                aria-label="slider-label"
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                marks={[
                  { value: 0, label: "0%" },
                  { value: 100, label: "100%" },
                ]}
                sx={{
                  "& .MuiSlider-markLabel": {
                    transform: "translateX(-50%)",
                  },
                  '& .MuiSlider-markLabel[data-index="0"]': {
                    transform: "translateX(-10%)",
                  },
                  '& .MuiSlider-markLabel[data-index="1"]': {
                    transform: "translateX(-80%)",
                  },
                }}
                min={0}
                max={100}
              />
            </div>

            <FormControl
              fullWidth
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                alignItems: "center",
                textAlign: "center",
                padding: 2,
                border: "1px dashed #ccc",
                borderRadius: "8px",
              }}
            >
              <InputLabel shrink sx={{ fontWeight: "bold", color: "#666" }}>
                Imagem da Promoção
              </InputLabel>
              <Button
                variant="contained"
                component="label"
                sx={{
                  backgroundColor: "#000",
                  color: "#fff",
                  "&:hover": { backgroundColor: "#090109" },
                }}
              >
                Escolher Arquivo
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={handleImageUpload}
                />
              </Button>
              {imageUrl && !deal && (
                <p style={{ marginTop: "8px", color: "#444" }}>
                  Imagem selecionada:{" "}
                  <a href={imageUrl} target="_blank" rel="noopener noreferrer">
                    Visualizar
                  </a>
                </p>
              )}
              {deal?.dealImage && !imageUrl && (
                <p style={{ marginTop: "8px", color: "#444" }}>
                  Imagem atual:{" "}
                  <a
                    href={deal.dealImage}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Visualizar
                  </a>
                </p>
              )}
            </FormControl>
          </>
        )}

        {dealType === "PRODUCT" && (
          <>
            <FormControl fullWidth error={!!formik.errors.product}>
              <InputLabel id="product-label">Produto</InputLabel>
              <Select
                labelId="product-label"
                id="product-select"
                label="Produto"
                name="product"
                value={formik.values.product}
                onChange={handleProductChange}
                error={!!formik.errors.product}
              >
                {products.length > 0 ? (
                  products.map((product) => (
                    <MenuItem key={product.id} value={product.id}>
                      {product.title}
                    </MenuItem>
                  ))
                ) : (
                  <MenuItem disabled>
                    Os vendedores ainda não adicionaram produtos
                  </MenuItem>
                )}
              </Select>
              {formik.errors.product && (
                <p className="text-red-500 text-sm">{formik.errors.product}</p>
              )}
            </FormControl>

            <TextField
              fullWidth
              label="Nome da Promoção"
              name="dealName"
              value={formik.values.dealName}
              onChange={formik.handleChange}
              error={!!formik.errors.dealName}
              helperText={formik.errors.dealName}
            />

            <TextField
              fullWidth
              label="Imagem da Promoção"
              name="dealImage"
              value={formik.values.dealImage}
              onChange={formik.handleChange}
              error={!!formik.errors.dealImage}
              helperText={formik.errors.dealImage}
            />

            <TextField
              fullWidth
              label="Preço Original"
              type="number"
              name="originalPrice"
              value={formik.values.originalPrice}
              onChange={formik.handleChange}
              InputProps={{ inputProps: { min: 0, readOnly: true } }}
              error={!!formik.errors.originalPrice}
              helperText={formik.errors.originalPrice}
            />

            <TextField
              fullWidth
              label="Preço com Desconto"
              type="number"
              name="discountedPrice"
              value={formik.values.discountedPrice}
              onChange={formik.handleChange}
              InputProps={{ inputProps: { min: 0, readOnly: true } }}
              error={!!formik.errors.discountedPrice}
              helperText={formik.errors.discountedPrice}
            />

            <div className="w-full">
              <p className="text-zinc-500 pb-2">Percentual de Desconto (%)</p>
              <Slider
                size="small"
                name="productDiscountPercent"
                value={formik.values.productDiscountPercent}
                onChange={(event, newValue) => {
                  const newPercent = newValue;
                  formik.setFieldValue("productDiscountPercent", newPercent);
                  const originalPrice = formik.values.originalPrice;
                  const newDiscountedPrice = updateDiscountedPrice(
                    newPercent,
                    originalPrice
                  );
                  formik.setFieldValue("discountedPrice", newDiscountedPrice);
                }}
                aria-label="slider-label"
                valueLabelDisplay="auto"
                valueLabelFormat={(value) => `${value}%`}
                marks={[
                  { value: 0, label: "0%" },
                  { value: 100, label: "100%" },
                ]}
                sx={{
                  "& .MuiSlider-markLabel": {
                    transform: "translateX(-50%)",
                  },
                  '& .MuiSlider-markLabel[data-index="0"]': {
                    transform: "translateX(-10%)",
                  },
                  '& .MuiSlider-markLabel[data-index="1"]': {
                    transform: "translateX(-80%)",
                  },
                }}
                min={0}
                max={100}
              />
            </div>
          </>
        )}

        <Grid2 size={{ xs: 12 }} sx={{ mt: 2 }}>
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            disabled={formik.isSubmitting}
          >
            {deal ? "Salvar Alterações" : "Criar Promoção"}
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
