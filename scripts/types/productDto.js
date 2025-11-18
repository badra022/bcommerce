export function createProductViewDto(data) {
    if (!data.title || !data.price) {
        throw new Error('createProductViewDto: Invalid product data');
    }
    return {
        seller: data.seller || 'unknown',
        name: data.title,
        description: data.description || '',
        price: data.price,
        currency: data.currency || '$',
        discount: data.discount || 0,
        images: data.image ? [{ image: data.image, thumbnail: data.image, number: 1 }, { image: data.image, thumbnail: data.image, number: 2 }, { image: data.image, thumbnail: data.image, number: 3 }, { image: data.image, thumbnail: data.image, number: 4 }] : []
    };
}
export function createAllProductViewDto(data) {
    return { products: data.map((product) => {
            if (!product.id || !product.title || !product.price) {
                throw new Error('createAllProductViewDto: Invalid product data, dropping item');
            }
            return {
                id: product.id,
                seller: product.seller || 'unknown',
                name: product.title.length > 60 ? product.title.substring(0, 60) + '...' : product.title,
                price: product.price,
                currency: product.currency || '$',
                discount: product.discount || Math.floor(Math.random() * 30),
                category: product.category || '',
                oldPrice: product.price / (1 - (product.discount || 0) / 100),
                imageSrc: product.image || 'static/notFound.jpg'
            };
        }) };
}
