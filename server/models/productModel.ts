export interface Product {
    id: number;
    name: string;
    price: number;
    created_at: Date;
    description: string; 
    travel_option_id: number;
    image_url: string;
    in_stock: boolean;
}
