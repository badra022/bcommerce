import Base from "../Base.js";
import { cart } from "../../store/index.js";
import { navList } from "../constants.js";
import Cart from "../Cart/index.js";
import navbarTemplate from '../../../views/navbar.hbs';
const transformStateToTemplateArguments = (cartItems) => {
    return {
        navList: navList,
        cartItemCount: cartItems?.length || 0
    };
};
export default class Navbar extends Base {
    constructor() {
        console.log("Initializing Navbar component...");
        super(navbarTemplate, "navbar-big-container", transformStateToTemplateArguments(cart.getState()));
    }
    configure() {
        this._cartComponent = new Cart();
        document.querySelector('#close-nnav-menu').addEventListener('click', this.closeMobileMenu.bind(this));
        document.querySelector('#nav-menu-button').addEventListener('click', this.openMobileMenu.bind(this));
        document.querySelector('#cart-button-container').addEventListener('click', this.toggleCart.bind(this));
        cart.subscribe(this.updateCartNotificationCount.bind(this));
    }
    toggleCart() {
        this._cartComponent.toggleCart();
    }
    closeMobileMenu() {
        const mobileNav = document.querySelector('#mobile-navbar-items');
        const darkOverlay = document.querySelector('.dark-overlay');
        mobileNav.classList.add('hide');
        darkOverlay.classList.add('hide');
    }
    openMobileMenu() {
        const mobileNav = document.querySelector('#mobile-navbar-items');
        const darkOverlay = document.querySelector('.dark-overlay');
        mobileNav.classList.remove('hide');
        darkOverlay.classList.remove('hide');
    }
    updateCartNotificationCount(action) {
        if (action.type !== 'add' && action.type !== 'remove')
            return;
        this.render(transformStateToTemplateArguments(cart.getState()));
    }
}
