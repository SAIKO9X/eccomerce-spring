import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import { ImageSearch } from "@mui/icons-material";
import { useAppSelector } from "../../../state/store";
import { useState, useEffect } from "react";

export const Slider = () => {
  const { home } = useAppSelector((state) => state);
  const carouselData = home?.homePageData?.carousel || [];
  const [isLoop, setIsLoop] = useState(window.innerWidth <= 650);
  const [isResetting, setIsResetting] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      setIsLoop(window.innerWidth <= 650);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSlideChange = (swiper) => {
    if (isResetting) return;

    if (
      swiper.realIndex === carouselData.length - 1 &&
      window.innerWidth <= 650
    ) {
      setIsResetting(true);
      swiper.loopDestroy();
      setTimeout(() => {
        swiper.slideTo(0);
        swiper.loopCreate();
        setIsResetting(false);
      }, 2000);
    }
  };

  return (
    <Swiper
      modules={[Pagination]}
      grabCursor
      centeredSlides={false}
      slideToClickedSlide
      slidesPerView={1}
      speed={800}
      initialSlide={1}
      loop={isLoop}
      onSlideChange={handleSlideChange}
      breakpoints={{
        320: { slidesPerView: 1, spaceBetween: 20, centeredSlides: false },
        650: { slidesPerView: 2, spaceBetween: 30, centeredSlides: false },
        1000: { slidesPerView: "auto", spaceBetween: 40, centeredSlides: true },
      }}
    >
      {carouselData.map((category, index) => (
        <SwiperSlide key={category.id || index}>
          <img
            src={category.image}
            className="w-full h-full object-cover object-center"
            alt={category.name || "Carousel Item"}
          />
          <div className="absolute top-2 right-2 flex gap-2">
            <p className="bg-white px-4 py-2 rounded-full">
              Visualizar Coleção
            </p>
            <div className="bg-white p-2 rounded-full">
              <ImageSearch />
            </div>
          </div>
          <p className="absolute bottom-2 left-2 bg-white px-4 py-2 rounded-full">
            {category.name}
          </p>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};
