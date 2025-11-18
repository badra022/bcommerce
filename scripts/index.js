import Cart from './components/Cart/index.js';
import Navbar from './components/Navbar/index.js';
import Product from './pages/Product/index.js';
import ProductsList from './pages/productsList/index.js';
import { getProductById, getAllProducts } from './services/productService.js';
const navbarComponent = new Navbar();
const cartComponent = new Cart();
class Router {
    constructor() {
        window.addEventListener('hashchange', async () => {
            await this.handleRoute();
        });
        this.handleRoute();
    }
    async handleRoute() {
        const hash = window.location.hash.slice(1);
        if (!this.productPage) {
            this.productPage = new Product(await getProductById(1));
        }
        if (!this.productsListPage) {
            this.productsListPage = new ProductsList(await getAllProducts());
        }
        if (!hash) {
            await this.showProductsList(await getAllProducts(), 'all');
            return;
        }
        const productId = parseInt(hash);
        if (!isNaN(productId)) {
            const product = await getProductById(productId);
            await this.showProduct(product);
            return;
        }
        const route = hash.toLowerCase();
        const products = await getAllProducts();
        switch (route) {
            case 'men':
            case 'women':
            case 'collections':
                await this.showProductsList(products, route);
                break;
            case 'about':
            case 'contact':
            default:
                await this.showProductsList(products, 'all');
        }
    }
    showProduct(product) {
        console.log(`Routing to product #${product}`);
        this.productsListPage.unmount();
        this.productPage.mount(product);
    }
    showProductsList(products, category) {
        console.log(`Routing to category: ${category}`);
        this.productPage.unmount();
        console.log(products);
        if (category !== 'all') {
            const filteredProducts = products.products?.filter(product => product.category.includes(category));
            if (!filteredProducts) {
                this.productsListPage.mount(products);
            }
            this.productsListPage.mount({ products: filteredProducts });
            return;
        }
        else {
            this.productsListPage.mount(products);
        }
    }
    navigate(route) {
        window.location.hash = route;
    }
}
const router = new Router();
export { router };
