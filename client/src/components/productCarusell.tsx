
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import '../styles/_productSlider.scss'
import { Product } from "../types/product";
import { useSwipeable } from 'react-swipeable';


interface ProductCarusellProps {
    products: Product[];
}

export const ProductCarusell: React.FC<ProductCarusellProps> = ({ products }) => {

const [isMobile, setIsMobile] = useState(false);
  const productsPerPage = 3;
  // const sliderRef = useRef<HTMLDivElement>(null);
  const sliderRef = useRef() as MutableRefObject<HTMLDivElement | null>;
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    setCurrentIndex(0); // Återställ index till 0 vid första render
  }, [products]);

  useEffect(() => {
    if (isMobile && sliderRef.current) {
      swipeHandlers.ref(sliderRef.current);
    }
  }, [isMobile, sliderRef.current]);

  useEffect(() => {
    if (!sliderRef.current) {
      console.warn("Slider ref not available");
      return;
    }
  
    // Hitta det första elementet i slidern
    const productElement = sliderRef.current.querySelector(".product-item") as HTMLElement | null;
  
    if (!productElement) {
      console.warn("Product item not found in slider");
      return;
    }
  
    console.log("Product element found:", productElement);
  }, []);
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
   
      if (currentIndex < products.length - productsToShow) {
        setCurrentIndex(currentIndex + 1);
      }
    };
      const prevSlide = () => {
        if (currentIndex > 0) {
          setCurrentIndex(currentIndex - 1);
        }
      };
    console.log({
      currentIndex,
      translateX: (currentIndex * (100 / productsToShow)),
    });
    // console.log({
    //   currentIndex,
    //   productsToShow,
    //   totalProducts: products.length,
    //   translateX: (currentIndex * 100) / productsToShow,
    // });

    // const calculateTranslateX = () => {
    //   const isLastSlide =
    //     currentIndex === Math.ceil(products.length / productsToShow) - 1;
    //   const remainingProducts = products.length % productsToShow;
    
    //   // Om det är sista raden och den inte fyller hela raden
    //   if (isLastSlide && remainingProducts !== 0) {
    //     return (currentIndex * 100) / productsToShow - (100 - (remainingProducts / productsToShow) * 100);
    //   }
    
    //   return (currentIndex * 100) / productsToShow;
    // };
    const calculateTranslateX = () => {
      if (!sliderRef.current) {
        console.warn("Slider ref not available"); // Om referensen saknas
        return 0;
      }
    
      // Hitta det första produkt-elementet
      const productElement = sliderRef.current.querySelector(".product-item") as HTMLElement | null;
    
      if (!productElement) {
        console.warn("Product item not found in slider"); // Om det inte finns några produkter
        return 0;
      }
    
      // Bredden på en produkt (inklusive margin eller padding om nödvändigt)
      const productWidth = productElement.offsetWidth;
    
      // Om du använder gap i CSS (20px i detta fall)
      const gap = 20;
    
      // Beräkna den totala förflyttningen
      const translateX = currentIndex * (productWidth + gap);
    
      console.log({
        currentIndex,
        productWidth,
        gap,
        translateX,
      });
    
      return translateX;
    };
    

    return (
      
            <div className="product-carousel">
              <div    ref={(node) => {
    if (node) {
      sliderRef.current = node; // Koppla ref manuellt
      if (isMobile && swipeHandlers.ref) {
        swipeHandlers.ref(node); // Koppla swipeHandlers också
      }
    }
  }}
                className="product-slider"
                style={{
                  transform: `translateX(-${calculateTranslateX()}px)`,
              
                }}
              >
                {products.map((product) => (
                  <div key={product.id} className="product-item"  style={{
                    flex: `0 0 calc((100% - (${productsToShow} - 1) * 20px) / ${productsToShow})`, // Dynamisk bredd
                  }}>
                    <img src={product.image_url} alt={product.name} />
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>{product.price} kr</p>
                    <button className="button-cart">PUT IN CART</button>
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

