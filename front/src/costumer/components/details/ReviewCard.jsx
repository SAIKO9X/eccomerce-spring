import { StarRate, StarHalf, MoreVert } from "@mui/icons-material";
import { Avatar, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import { deleteReview } from "../../../state/customer/reviewSlice";
import { useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../state/store";

export const ReviewCard = ({ review }) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleEdit = () => {
    handleMenuClose();
    navigate(`/reviews/${review.product.id}/edit/${review.id}`);
  };

  console.log("teste", review);

  const handleDelete = () => {
    if (window.confirm("Tem certeza que deseja excluir esta avaliação?")) {
      dispatch(deleteReview(review.id));
    }
    handleMenuClose();
  };

  const isOwner = user && user.id === review.user.id;

  return (
    <div className="flex flex-col gap-6 justify-between bg-zinc-50 p-6 rounded-xl border border-black/10">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar src={review.user.avatar} />
          <div className="flex flex-col gap-1">
            <p className="leading-none">{review.user.fullName}</p>
            <span className="leading-none text-sm text-zinc-400">
              {new Date(review.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        <div className="flex items-center gap-1">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            if (ratingValue <= review.rating) {
              return <StarRate key={index} sx={{ fontSize: 20 }} />;
            } else if (ratingValue - 0.5 <= review.rating) {
              return <StarHalf key={index} sx={{ fontSize: 20 }} />;
            } else {
              return (
                <StarRate key={index} sx={{ fontSize: 20, color: "grey" }} />
              );
            }
          })}
        </div>
      </div>

      <p className="text-sm text-justify">{review.reviewText}</p>

      <div className="flex items-center justify-between">
        {review.productImages && review.productImages.length > 0 && (
          <div className="flex gap-2">
            {review.productImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt="Imagem de Review"
                className="w-20 h-20 rounded-md object-cover object-center border border-black/10"
              />
            ))}
          </div>
        )}

        {isOwner && (
          <>
            <IconButton onClick={handleMenuOpen}>
              <MoreVert />
            </IconButton>
            <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
              <MenuItem onClick={handleEdit}>Editar</MenuItem>
              <MenuItem onClick={handleDelete}>Deletar</MenuItem>
            </Menu>
          </>
        )}
      </div>
    </div>
  );
};
