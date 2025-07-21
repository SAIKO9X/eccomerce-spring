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
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { useFormik } from "formik";
import dayjs from "dayjs";
import { createCoupon } from "../../../state/admin/adminCouponSlice";
import { useEffect } from "react";
import { useAlert } from "../../../utils/useAlert";
import { useAppDispatch, useAppSelector } from "../../../state/store";

export const CreateCouponForm = () => {
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector((state) => state.adminCoupon);
  const { showAlert, AlertComponent } = useAlert();

  const formik = useFormik({
    initialValues: {
      code: "",
      discountPercentage: 0,
      startDate: null,
      endDate: null,
      minOrderValue: 0,
      activationType: "NOW",
    },
    onSubmit: (values) => {
      const formattedValues = {
        ...values,
        validityStartDate:
          values.activationType === "NOW"
            ? dayjs().format("YYYY-MM-DD")
            : values.startDate?.format("YYYY-MM-DD"),
        validityEndDate: values.endDate?.format("YYYY-MM-DD"),
        isActive: true,
        minimumOrderValue: values.minOrderValue,
      };
      dispatch(createCoupon(formattedValues));
    },
  });

  useEffect(() => {
    if (!loading && !error && formik.isSubmitting) {
      showAlert("Cupom criado com sucesso!", "success");
      formik.resetForm();
      formik.setSubmitting(false);
    } else if (!loading && error && formik.isSubmitting) {
      showAlert(error || "Erro ao criar o cupom.", "error");
      formik.setSubmitting(false);
    }
  }, [loading, error, formik, showAlert]);

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <h1 className="py-10 font-playfair font-medium text-2xl text-center">
        Crie um Novo Cupom
      </h1>
      <AlertComponent />
      <form className="px-4" onSubmit={formik.handleSubmit}>
        <Grid2 container spacing={4} maxWidth="md" mx={"auto"}>
          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="code"
              label="Código do Cupom"
              value={formik.values.code}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <TextField
              fullWidth
              name="minOrderValue"
              label="Valor Mínimo do Pedido"
              value={formik.values.minOrderValue}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={
                formik.touched.minOrderValue &&
                Boolean(formik.errors.minOrderValue)
              }
              helperText={
                formik.touched.minOrderValue && formik.errors.minOrderValue
              }
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth>
              <InputLabel id="activation-type-label">
                Tipo de Ativação
              </InputLabel>
              <Select
                labelId="activation-type-label"
                id="activation-type-select"
                name="activationType"
                value={formik.values.activationType}
                onChange={formik.handleChange}
                label="Tipo de Ativação"
              >
                <MenuItem value="NOW">Ativo Agora</MenuItem>
                <MenuItem value="SCHEDULED">Agendado</MenuItem>
              </Select>
            </FormControl>
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            <DatePicker
              sx={{ width: "100%" }}
              name="endDate"
              label="Data de Término"
              minDate={formik.values.startDate || dayjs()}
              onChange={(newValue) => formik.setFieldValue("endDate", newValue)}
              value={formik.values.endDate}
            />
          </Grid2>

          <Grid2 size={{ xs: 12, sm: 6 }}>
            {formik.values.activationType === "SCHEDULED" && (
              <DatePicker
                sx={{ width: "100%" }}
                name="startDate"
                label="Data de Início"
                minDate={dayjs().add(1, "day")}
                onChange={(newValue) =>
                  formik.setFieldValue("startDate", newValue)
                }
                value={formik.values.startDate}
              />
            )}
          </Grid2>

          <div className="w-full">
            <p className="text-zinc-500 pb-2">Valor do Desconto</p>
            <Slider
              size="small"
              name="discountPercentage"
              value={formik.values.discountPercentage}
              onChange={(event, newValue) =>
                formik.setFieldValue("discountPercentage", newValue)
              }
              aria-labelledby="slider-label"
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

          <div className="w-full mx-auto">
            <Button
              fullWidth
              variant="outlined"
              sx={{ py: 1 }}
              type="submit"
              disabled={loading || formik.isSubmitting} // Desabilitar o botão durante o carregamento
            >
              {loading ? "Criando..." : "Criar Cupom"}
            </Button>
          </div>
        </Grid2>
      </form>
    </LocalizationProvider>
  );
};
