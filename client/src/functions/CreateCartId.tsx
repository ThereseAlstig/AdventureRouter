import { v4 as uuidv4 } from 'uuid';


// Function to create a cartId if it doesn't exist in the sessionStorage
const getOrCreateCartId = () => {
    let cartId = sessionStorage.getItem('cartId');
    
    if (!cartId) {
        cartId = uuidv4();
        sessionStorage.setItem('cartId', cartId as string);
    }

    return cartId;
};

export default getOrCreateCartId;