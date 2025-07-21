import { CarouselTable } from "../component/carousel/CarouselTable";

export const CarouselDashboard = () => {
  return (
    <div>
      <h1 className="py-10 font-playfair font-medium text-2xl text-center">
        Gerenciar Carousel
      </h1>
      <CarouselTable />
    </div>
  );
};
