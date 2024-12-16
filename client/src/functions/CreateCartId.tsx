import { v4 as uuidv4 } from 'uuid';

const getOrCreateCartId = () => {
    let cartId = sessionStorage.getItem('cartId');
    
    if (!cartId) {
        cartId = uuidv4();
        sessionStorage.setItem('cartId', cartId as string);
    }

    return cartId;
};

export default getOrCreateCartId;