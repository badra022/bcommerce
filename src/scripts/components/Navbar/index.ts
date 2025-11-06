import Base from "../Base.js";
import { cart } from "../../store/index.js";
import type { CartItem } from "../../store/index.js";
import { navList } from "../constants.js";


// related components
import Cart from "../Cart/index.js";

// @ts-ignore: allow importing handlebars template without type declarations
import navbarTemplate from '../../../views/navbar.hbs';

interface navbarContext {
    // Define the context properties needed for the navbar component
    navList: string[];
    cartItemCount: number;
}

const transformStateToTemplateArguments = (cartItems: CartItem[]) : navbarContext => {
    return {
        navList: navList,
        cartItemCount: cartItems?.length || 0
    }
};


export default class Navbar extends Base<navbarContext>{
    private _cartComponent: Cart;
    constructor() {
        console.log("Initializing Navbar component...");
        super(navbarTemplate, "navbar-big-container", transformStateToTemplateArguments(cart.getState()));
    }

    public configure(): void {
        this._cartComponent = new Cart();
        document.querySelector('#close-nnav-menu').addEventListener('click', this.closeMobileMenu.bind(this));
        document.querySelector('#nav-menu-button').addEventListener('click', this.openMobileMenu.bind(this));
        document.querySelector('#cart-button-container').addEventListener('click', this.toggleCart.bind(this));
        cart.subscribe(this.updateCartNotificationCount.bind(this));
    }

    public toggleCart(): void {
        this._cartComponent.toggleCart();
    }
    public closeMobileMenu(): void {
        const mobileNav = document.querySelector('#mobile-navbar-items') as HTMLElement;
        const darkOverlay = document.querySelector('.dark-overlay') as HTMLElement;

        mobileNav.classList.add('hide');
        darkOverlay.classList.add('hide');
    }

    public openMobileMenu(): void {
        const mobileNav = document.querySelector('#mobile-navbar-items') as HTMLElement;
        const darkOverlay = document.querySelector('.dark-overlay') as HTMLElement;

        mobileNav.classList.remove('hide');
        darkOverlay.classList.remove('hide');
    }

    public updateCartNotificationCount(action): void {
        if(action.type !== 'add' && action.type !== 'remove') return;
        // Re-render the navbar with updated state
        this.render(transformStateToTemplateArguments(cart.getState()));
    }
}