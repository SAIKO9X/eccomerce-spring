import { useAppSelector } from "../../../state/store";
import { DealCard } from "./DealCard";
import Slider from "react-slick";

export const Deal = () => {
  const { home } = useAppSelector((state) => state);

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    centerMode: true,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          centerMode: true,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerMode: false,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <section className="flex flex-col justify-center px-2 sm:px-10 py-20 gap-10">
      <div className="flex flex-col items-center gap-2">
        <h2 className="text-4xl font-playfair capitalize">
          Ofertas Imperdíveis de Hoje
        </h2>
        <p className="text-zinc-400">
          Descubra descontos incríveis e aproveite enquanto durar!
        </p>
      </div>

      <Slider {...settings}>
        {home.homePageData?.deals.map((item) => (
          <div key={item.id} className="px-2">
            <DealCard item={item} />
          </div>
        ))}
      </Slider>
    </section>
  );
};
