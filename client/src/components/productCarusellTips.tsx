


import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import '../styles/_productSlider.scss'
import { Product } from "../types/product";
import { useSwipeable } from 'react-swipeable';


interface ProductCarusellProps {
    products: Product[];
}

export const ProductCarusellTips: React.FC<ProductCarusellProps> = ({ products }) => {

const [isMobile, setIsMobile] = useState(false);
  const productsPerPage = 1;
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
    
      // Bredden på en produkt (inklusive margin eller padding)
      const productWidth = productElement.offsetWidth;
      const gap = 20;
    
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
      
            <div className="vertical-carousel">
              <div    ref={(node) => {
    if (node) {
      sliderRef.current = node; // Koppla ref manuellt
      if (isMobile && swipeHandlers.ref) {
        swipeHandlers.ref(node); // Koppla swipeHandlers också
      }
    }
  }}
                className="vertical-slider"
                style={{
                  transform: `translateX(-${calculateTranslateX()}px)`,
              
                }}
              >
                {products.map((product) => (
                  <div key={product.id} className="vertical-item"  style={{
                    flex: `0 0 calc((100% - (${productsToShow} - 1) * 20px) / ${productsToShow})`, // Dynamisk bredd
                  }}>
                     <div className="image">
        <img src={product.image_url} alt={product.name}/>
      </div>
      <div className="product-description">
                    <h3>{product.name}</h3>
                    <p>{product.description}</p>
                    <p>{product.price} kr</p>
                    <button className="button-cart">PUT IN CART</button>
                 </div> </div>
                ))}
              </div>
              {!isMobile && (
                <>
                  <button
                    type="button"
                    onClick={prevSlide}
                    className="vertical-carousel-button  prev-button"
                    name="prev"
                    aria-label="Previous"
                  >
                    <svg viewBox="0 0 24 24" style={{ transform: 'rotate(-270deg)' }}>
  <path d="M7.98 8.32 4.3 12l3.67 3.67 3.67 3.67.35-.35.35-.35-3.06-3.06-3.06-3.06H19v-1h-6.38c-3.509 0-6.38-.013-6.38-.03 0-.016 1.377-1.407 3.06-3.09l3.061-3.061-.351-.349-.351-.349L7.98 8.32" />
</svg>
                  </button>
                  <button
                    type="button"
                    name="next"
                    aria-label="Next"
                    onClick={nextSlide}
                    className="vertical-carousel-button next-button"
                  >
                            <svg viewBox="0 0 24 24" style={{ transform: 'rotate(-90deg)' }}>
  <path d="M7.98 8.32 4.3 12l3.67 3.67 3.67 3.67.35-.35.35-.35-3.06-3.06-3.06-3.06H19v-1h-6.38c-3.509 0-6.38-.013-6.38-.03 0-.016 1.377-1.407 3.06-3.09l3.061-3.061-.351-.349-.351-.349L7.98 8.32" />
</svg>
                  </button>
                </>
              )}
            </div>
          );
        
};

