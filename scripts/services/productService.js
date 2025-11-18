import { createProductViewDto, createAllProductViewDto } from "../types/productDto.js";
export async function getAllProducts() {
    const response = await fetch('https://fakestoreapi.com/products');
    const responseData = await response.json();
    return createAllProductViewDto(responseData);
}
export async function getProductById(id) {
    const response = await fetch(`https://fakestoreapi.com/products/${id}`);
    const responseData = await response.json();
    return createProductViewDto(responseData);
}
