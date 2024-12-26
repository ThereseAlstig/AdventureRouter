


import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import '../styles/_productSlider.scss'
import { Product } from "../types/product";
import { useSwipeable } from 'react-swipeable';
import { saveToCart } from "../api/cart";
import { Link } from "react-router-dom";


interface ProductCarusellProps {
    products: Product[];
}
//Produktkarusell för tipps produkter
export const ProductCarusellTips: React.FC<ProductCarusellProps> = ({ products }) => {

const [isMobile, setIsMobile] = useState(false);
  const productsPerPage = 3;
  const sliderRef = useRef() as MutableRefObject<HTMLDivElement | null>;
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    setCurrentIndex(0);
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
    const productElement = sliderRef.current.querySelector(".vertical-item") as HTMLElement | null;
  
    if (!productElement) {
      console.warn("Product item not found in slider");
      return;
    }
  
   
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
//slider för mobile
const swipeHandlers = useSwipeable({
  onSwipedUp: () => {
    if (currentIndex < products.length - productsToShow) {
      setCurrentIndex(currentIndex + 1);
    }
  },
  onSwipedDown: () => {
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
 

      //Lägg i kundkorgen
 const handleAddToCart = async (productId: number) => {
    const quantity = 1; // Hämta antal från state (standard till 1)
    try {
        const updatedCart = await saveToCart(productId, quantity);
    console.log(updatedCart);
        alert("Produkten lades till i kundkorgen!");
    } catch (error) {
        if (error instanceof Error) {
            console.error("Kunde inte lägga till produkten:", error.message);
        } else {
            console.error("Kunde inte lägga till produkten:", error);
        }
        alert("Något gick fel!");
    }
};


    const calculateTranslateX = () => {
      if (!sliderRef.current) return 0;
      const productWidth = sliderRef.current.offsetWidth; // Full bredd
      return currentIndex * (productWidth + 20); // 20px mellanrum
    };
   
    const calculateTranslateY = () => {
      if (!sliderRef.current) {
        console.warn("Slider ref not available"); // Om referensen saknas
        return 0;
      }
    
      // Hitta det första produkt-elementet
      const productElement = sliderRef.current.querySelector(".vertical-item") as HTMLElement | null;
    
      if (!productElement) {
        console.warn("Product item not found in slider"); // Om det inte finns några produkter
        return 0;
      }
    
      // Bredden på en produkt (inklusive margin eller padding)
      const productHeight = 350;
      const gap = 20;
    
      const translateY = currentIndex * (productHeight + gap);
    
      return translateY;
    };
    

    return (
      <>
       <h1>Recomended products:</h1>
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
                  transform: isMobile
                    ? `translateX(-${calculateTranslateX()}px)` 
                    : `translateY(-${calculateTranslateY()}px)`, 
                }}
              >
                {products.map((product) => (
                  <div key={product.id} className="vertical-item"  style={{
                    height: `calc((100% - (${productsToShow} - 1) * 20px) / ${productsToShow})`,
                   // Dynamisk bredd
                  }}>
                     <div className="image">
                     <Link to={`/shop/${product.id}`}>
        <img src={product.image_url} alt={product.name}/>
        </Link>
      </div>
      <div className="product-description">
                    <h3>{product.name}</h3>
                
                    <p>{product.price} kr</p>
                    <button className="button-cart"
      onClick={() => handleAddToCart(product.id)} >PUT IN CART</button>
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
                    <svg width="13" height="8" viewBox="0 0 13 8" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M12.5136 5.93792C12.7744 6.14755 12.8322 6.43889 12.6545 6.68485C12.4768 6.93082 12.1005 7.08353 11.6888 7.08068L1.06409 7.00718C0.652384 7.00433 0.278287 6.84424 0.10401 6.59803C-0.0702676 6.35182 -0.0118108 6.06128 0.255261 5.85312L5.59669 1.68997L5.91717 1.44062L1.10283 1.40731C0.515153 1.40325 0.0425234 1.08716 0.045202 0.699979C0.0478806 0.312801 0.524838 0.00328054 1.11252 0.00734624L11.7373 0.0808504C12.3249 0.0849161 12.7976 0.401006 12.7949 0.788184C12.7922 1.17536 12.3153 1.48488 11.7276 1.48082L6.91324 1.44751L7.23024 1.70127L12.5136 5.93792Z" fill="black"/>
</svg>

                  </button>
                  <button
                    type="button"
                    name="next"
                    aria-label="Next"
                    onClick={nextSlide}
                    className="vertical-carousel-button next-button"
                  >
                            <svg width="14" height="9" viewBox="0 0 14 9" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M1.24182 2.2686C0.976957 2.06406 0.913591 1.77388 1.08649 1.52453C1.25939 1.27519 1.63264 1.11524 2.04432 1.11014L12.6685 0.978514C13.0802 0.973414 13.4573 1.12625 13.6363 1.36906C13.8153 1.61186 13.7625 1.90347 13.4995 2.11675L8.23941 6.38223L7.9238 6.63773L12.7379 6.57808C13.3255 6.5708 13.8042 6.87771 13.809 7.26487C13.8138 7.65203 13.3429 7.9707 12.7552 7.97798L2.13104 8.1096C1.54339 8.11688 1.06475 7.80997 1.05995 7.42282C1.05515 7.03566 1.52605 6.71699 2.1137 6.70971L6.92778 6.65007L6.60594 6.40247L1.24182 2.2686Z" fill="black"/>
</svg>


                  </button>
                </>
              )}
            </div></>
          );
        
};

