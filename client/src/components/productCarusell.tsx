
import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import '../styles/_productSlider.scss'
import { Product } from "../types/product";
import { useSwipeable } from 'react-swipeable';
import { saveToCart } from "../api/cart";
import { Link } from "react-router-dom";


interface ProductCarusellProps {
    products: Product[];
}

//Produktkarusell
export const ProductCarusell: React.FC<ProductCarusellProps> = ({ products }) => {

const [isMobile, setIsMobile] = useState(false);
const [quantities, setQuantities] = useState<{ [key: number]: number }>({});

  const productsPerPage = 3;
  const sliderRef = useRef() as MutableRefObject<HTMLDivElement | null>;
  const [currentIndex, setCurrentIndex] = useState(0);


  useEffect(() => {
    setCurrentIndex(0); 
  }, [products]);

  //Om mobil, använd swipe
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
  
   
  }, []);

//För att uppdatera om mobil eller inte
  useEffect(() => {
    const handleResize = () => {
        setIsMobile(window.innerWidth < 768);
      };
        handleResize();
        handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


    // Uppdatera antal för en specifik produkt
    const handleQuantityChange = (productId: number, quantity: string) => {
      setQuantities((prev) => ({
          ...prev,
          [productId]: parseInt(quantity) || 1, // Standard till 1 om input är tomt
      }));
  };

  //Lägger i kundkorgen
  const handleAddToCart = async (productId: number) => {
    const quantity = quantities[productId] || 1; // Hämta antal från state (standard till 1)
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

    const productsToShow = isMobile ? 1 : productsPerPage;
//slider för mobile
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
      const gap = 20;
    
      // Beräkna den totala förflyttningen Gap med för rätt positionering
      const translateX = currentIndex * (productWidth + gap);
    
    
      return translateX;
    };
    

    const CrocodileGap = ({ direction }: { direction: "left" | "right" }) => {
      return (
        <svg
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
          style={{
            transform: direction === "left" ? "rotate(180deg)" : "none",
            width: "40px",
            height: "40px",
            fill: "#333",
          }}
        >
          <path d="M4 12l6-6v4h10v4H10v4l-6-6z" />
        </svg>
      );
    };
    
    return (
      <div className="product-carousel-container">
        {!isMobile && (
          <>
            <button
              type="button"
              onClick={prevSlide}
              className="carousel-button prev-button"
              name="prev"
              aria-label="Previous"
            >
              <CrocodileGap direction="right" />
            </button>
          </>
        )}
    
        <div className="product-carousel">
          <div
            ref={(node) => {
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
              <div
                key={product.id}
                className="product-item"
                style={{
                  flex: `0 0 calc((100% - (${productsToShow} - 1) * 20px) / ${productsToShow})`, // Dynamisk bredd
                }}
              >
                <Link to={`/shop/${product.id}`}>
                 
                <img src={product.image_url} alt={product.name} /></Link>
                <h3>{product.name}</h3>
                <p>{product.description}</p>
                <p>{product.price} kr</p>
              
                {product.in_stock ? (
                  <>
                    <div className="quantity-container">
                  <label htmlFor={`quantity-${product.id}`}>Antal:</label>
                  <input
                    id={`quantity-${product.id}`}
                    type="number"
                    min="1"
                    defaultValue="1"
                    onChange={(e) => handleQuantityChange(product.id, e.target.value)} // Hantera antal
                  />
                </div>
                <button
                  className="button-cart"
                  onClick={() => handleAddToCart(product.id)}
                >
                  PUT IN CART
                </button></>
                ) : (
                  <p className="out-of-stock">Out of stock</p>
                )
                }
               
              </div>
            ))}
          </div>
        </div>
    
        {!isMobile && (
          <>
            <button
              type="button"
              name="next"
              aria-label="Next"
              onClick={nextSlide}
              className="carousel-button next-button"
            >
              <CrocodileGap direction="left" />
            </button>
          </>
        )}
      </div>
    );
  }

