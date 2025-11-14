// main components
import Cart from './components/Cart/index.js';
import Navbar from './components/Navbar/index.js';
import Product from './pages/Product/index.js';
import ProductsList from './pages/productsList/index.js';
import { products } from './components/constants.js';


const navbarComponent = new Navbar();
const cartComponent = new Cart();

// Initialize pages
const productComponent = new Product(0);
const productsListComponent = new ProductsList(products);

// Hide both pages initially
productComponent.unmount();
productsListComponent.unmount();

// Custom Router
class Router {
    private productPage: Product;
    private productsListPage: ProductsList;

    constructor(productPage: Product, productsListPage: ProductsList) {
        this.productPage = productPage;
        this.productsListPage = productsListPage;
        
        // Listen to hash changes
        window.addEventListener('hashchange', () => this.handleRoute());
        
        // Handle initial route
        this.handleRoute();
    }

    private handleRoute(): void {
        const hash = window.location.hash.slice(1); // Remove the '#'
        
        if (!hash) {
            // Default route - show products list
            this.showProductsList('all');
            return;
        }

        // Check if hash is a number (product ID)
        const productId = parseInt(hash);
        if (!isNaN(productId)) {
            this.showProduct(productId);
            return;
        }

        // Handle category routes
        const route = hash.toLowerCase();
        switch (route) {
            case 'men':
            case 'women':
            case 'collections':
            case 'about':
            case 'contact':
                this.showProductsList(route);
                break;
            default:
                // Unknown route - show products list
                this.showProductsList('all');
        }
    }

    private showProduct(productId: number): void {
        console.log(`Routing to product #${productId}`);
        this.productsListPage.unmount();
        this.productPage.mount(productId);
    }

    private showProductsList(category: string): void {
        console.log(`Routing to category: ${category}`);
        this.productPage.unmount();
        
        // Filter products based on category if needed
        // For now, showing all products
        // You can add filtering logic here based on the category
        this.productsListPage.mount(products);
    }

    // Public method to navigate programmatically
    public navigate(route: string): void {
        window.location.hash = route;
    }
}

// Initialize router
const router = new Router(productComponent, productsListComponent);

// Export router for use in other components (e.g., Navbar)
export { router };