import Cart from './components/Cart/index.js';
import Navbar from './components/Navbar/index.js';
import Product from './pages/Product/index.js';
import ProductsList from './pages/productsList/index.js';
import { products } from './components/constants.js';
const navbarComponent = new Navbar();
const cartComponent = new Cart();
const productComponent = new Product(0);
const productsListComponent = new ProductsList(products);
productComponent.unmount();
productsListComponent.unmount();
class Router {
    constructor(productPage, productsListPage) {
        this.productPage = productPage;
        this.productsListPage = productsListPage;
        window.addEventListener('hashchange', () => this.handleRoute());
        this.handleRoute();
    }
    handleRoute() {
        const hash = window.location.hash.slice(1);
        if (!hash) {
            this.showProductsList('all');
            return;
        }
        const productId = parseInt(hash);
        if (!isNaN(productId)) {
            this.showProduct(productId);
            return;
        }
        const route = hash.toLowerCase();
        switch (route) {
            case 'men':
            case 'women':
            case 'collections':
                this.showProductsList(route);
                break;
            case 'about':
            case 'contact':
            default:
                this.showProductsList('all');
        }
    }
    showProduct(productId) {
        console.log(`Routing to product #${productId}`);
        this.productsListPage.unmount();
        this.productPage.mount(productId);
    }
    showProductsList(category) {
        console.log(`Routing to category: ${category}`);
        this.productPage.unmount();
        if (category !== 'all') {
            const filteredProducts = products.filter(product => product.category.includes(category));
            this.productsListPage.mount(filteredProducts);
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
const router = new Router(productComponent, productsListComponent);
export { router };
