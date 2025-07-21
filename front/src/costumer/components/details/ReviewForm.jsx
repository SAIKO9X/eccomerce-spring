import { useState } from "react";
import { Button, TextField, Rating } from "@mui/material";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useAppDispatch } from "../../../state/store";
import { createReview } from "../../../state/customer/reviewSlice";
import { uploadToCloudinary } from "../../../utils/uploadToCloudinary";
import { CloudUpload } from "@mui/icons-material";

export const ReviewForm = ({ productId }) => {
  const dispatch = useAppDispatch();
  const [images, setImages] = useState([]);

  const handleImageUpload = async (e, setFieldValue) => {
    const files = Array.from(e.target.files);
    try {
      const uploadedImages = await Promise.all(
        files.map((file) => uploadToCloudinary(file))
      );
      setImages(uploadedImages);
      setFieldValue("productImages", uploadedImages);
    } catch (error) {
      console.error("Erro ao fazer upload das imagens:", error);
      alert("Erro ao fazer upload das imagens.");
    }
  };

  const initialValues = {
    reviewText: "",
    reviewRating: 0,
    productImages: [],
  };

  const validate = (values) => {
    const errors = {};
    if (!values.reviewText) {
      errors.reviewText = "O texto da avaliação é obrigatório";
    }
    if (values.reviewRating === 0) {
      errors.reviewRating = "A avaliação deve ser maior que 0";
    }
    return errors;
  };

  const onSubmit = async (values, { resetForm }) => {
    try {
      const reviewData = {
        reviewText: values.reviewText,
        reviewRating: values.reviewRating,
        productImages: images,
      };
      await dispatch(createReview({ productId, reviewData })).unwrap();
      resetForm();
      setImages([]);
    } catch (error) {
      alert("Erro ao criar avaliação: " + error);
    }
  };

  return (
    <Formik
      initialValues={initialValues}
      validate={validate}
      onSubmit={onSubmit}
    >
      {({ setFieldValue, values }) => (
        <Form className="space-y-4 pt-4">
          <div>
            <Field
              as={TextField}
              name="reviewText"
              label="Escreva sua avaliação"
              multiline
              rows={4}
              fullWidth
              variant="outlined"
            />
            <ErrorMessage
              name="reviewText"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div>
            <Field name="reviewRating">
              {({ field }) => (
                <Rating
                  {...field}
                  value={values.reviewRating}
                  onChange={(e, newValue) =>
                    setFieldValue("reviewRating", newValue)
                  }
                  precision={0.5}
                />
              )}
            </Field>
            <ErrorMessage
              name="reviewRating"
              component="div"
              className="text-red-500 text-sm mt-1"
            />
          </div>

          <div className="flex flex-col gap-3">
            <input
              type="file"
              multiple
              onChange={(e) => handleImageUpload(e, setFieldValue)}
              accept="image/*"
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="cursor-pointer flex justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md shadow-sm text-gray-700 hover:bg-gray-100 transition-all"
            >
              <CloudUpload />
              <span>Enviar imagens</span>
            </label>

            {images.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {images.map((img, index) => (
                  <div key={index} className="relative group">
                    <img
                      src={img}
                      alt="Pré-visualização"
                      className="w-20 h-20 rounded-md object-cover border border-gray-300"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-red-500 text-white text-xs p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => {
                        const updatedImages = images.filter(
                          (_, i) => i !== index
                        );
                        setImages(updatedImages);
                        setFieldValue("productImages", updatedImages);
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Button type="submit" variant="contained">
            Enviar Avaliação
          </Button>
        </Form>
      )}
    </Formik>
  );
};
