// main components
import Cart from './components/Cart/index.js';
import Navbar from './components/Navbar/index.js';
import Product from './pages/Product/index.js';
import ProductsList from './pages/productsList/index.js';
import { getProductById , getAllProducts} from './services/productService.js';
import type { productViewDto, productsListViewDto } from './types/productDto.js';


const navbarComponent = new Navbar();
const cartComponent = new Cart();

// Custom Router
class Router {
    private productPage: Product;
    private productsListPage: ProductsList;

    constructor() {
        // Listen to hash changes
        window.addEventListener('hashchange', async () => {
            await this.handleRoute();
        });
        
        // Handle initial route
        this.handleRoute();
    }

    private async handleRoute(): Promise<void> {
        const hash = window.location.hash.slice(1); // Remove the '#'

        if(!this.productPage) {
            this.productPage = new Product(await getProductById(1));
        }
        if(!this.productsListPage) {
            this.productsListPage = new ProductsList(await getAllProducts());
        }
        
        if (!hash) {
            // Default route - show products list
            await this.showProductsList(await getAllProducts(), 'all');
            return;
        }

        // Check if hash is a number (product ID)
        const productId = parseInt(hash);
        if (!isNaN(productId)) {
            const product = await getProductById(productId);
            await this.showProduct(product);
            return;
        }

        // Handle category routes
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
                // Unknown route - show products list
                await this.showProductsList(products, 'all');
        }
    }

    private showProduct(product: productViewDto): void {
        console.log(`Routing to product #${product}`);
        this.productsListPage.unmount();
        this.productPage.mount(product);
    }

    private showProductsList(products : productsListViewDto, category: string): void {
        console.log(`Routing to category: ${category}`);
        this.productPage.unmount();

        console.log(products);

        if(category !== 'all') {
            const filteredProducts = products.products?.filter(product => product.category.includes(category));
            if(!filteredProducts) {
                // fallback to the full products list if filtering fails
                this.productsListPage.mount(products);
            }
            this.productsListPage.mount({products: filteredProducts});
            return;
        } else {
            this.productsListPage.mount(products);
        }
    }

    public navigate(route: string): void {
        window.location.hash = route;
    }
}

// Initialize router
const router = new Router();

// Export router for use in other components (e.g., Navbar)
export { router };