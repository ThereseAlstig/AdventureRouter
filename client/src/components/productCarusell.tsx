
import React, { useEffect, useState } from "react";
import '../styles/_productSlider.scss'
import { Product } from "../types/product";
import { useSwipeable } from 'react-swipeable';


interface ProductCarusellProps {
    products: Product[];
}

export const ProductCarusell: React.FC<ProductCarusellProps> = ({ products }) => {
console.log('produkterrrrr', products)
const [isMobile, setIsMobile] = useState(false);
  const productsPerPage = 3;
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    setCurrentIndex(0); // Återställ index till 0 vid första render
  }, [products]);

  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
        handleResize();
        handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
    // const settings = {
    //     dots: false, // Visa inte pagination-punkter
    //     infinite: true, // Oändlig scroll
    //     speed: 500, // Hastighet för scroll i ms
    //     slidesToShow: 3, // Antal produkter att visa
    //     slidesToScroll: 1, // Antal produkter att scrolla åt gången
    //     responsive: [
    //         {
    //             breakpoint: 768, // För skärmar mindre än 768px
    //             settings: {
    //                 slidesToShow: 1, // Visa en produkt åt gången
    //                 slidesToScroll: 1,
    //             },
    //         },
    //     ],
    //     nextArrow: <NextArrow />,
    //     prevArrow: <PrevArrow />,
    // };

    const productsToShow = isMobile ? 1 : productsPerPage;

    const swipeHandlers = useSwipeable({
        onSwipedLeft: () => {
          if (currentIndex < products.length - productsToShow) {
            setCurrentIndex(currentIndex + 1);
          }
        },
        onSwipedRight: () => {
          if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
          }
        },
        preventScrollOnSwipe: true,
        trackMouse: true,
      });
    const nextSlide = () => {
        if (currentIndex < Math.max(products.length - productsToShow, 0)) {
          setCurrentIndex(currentIndex + 1);
        }
      };
    
      const prevSlide = () => {
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
    }


    
    return (
      
            <div className="product-carousel">
              <div
                {...(isMobile && swipeHandlers)}
                className="product-slider"
                style={{
                  transform: `translateX(-${(currentIndex * 100) / productsToShow}%)`,
                }}
              >
                {products.map((product) => (
                  <div key={product.id} className="product-item"  style={{
                    flex: `0 0 calc(100% / ${productsToShow})`, // Dynamisk bredd
                  }}>
                    <img src={product.image_url} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>{product.price} kr</p>
                    <button>PUT IN CART</button>
                  </div>
                ))}
              </div>
              {!isMobile && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="carousel-button prev-button"
                    name="prev"
                    aria-label="Previous"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="M7.98 8.32 4.3 12l3.67 3.67 3.67 3.67.35-.35.35-.35-3.06-3.06-3.06-3.06H19v-1h-6.38c-3.509 0-6.38-.013-6.38-.03 0-.016 1.377-1.407 3.06-3.09l3.061-3.061-.351-.349-.351-.349L7.98 8.32" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    name="next"
                    aria-label="Next"
                    onClick={nextSlide}
                    className="carousel-button next-button"
                  >
                    <svg viewBox="0 0 24 24">
                      <path d="m11.99 4.99-.349.351L14.7 8.4c1.683 1.683 3.06 3.073 3.06 3.09 0 .016-2.871.03-6.38.03H5v1h12.78l-3.06 3.06-3.06 3.06.35.35.35.35 3.67-3.67L19.7 12l-3.68-3.68-3.681-3.681-.349.351" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          );
        
};

