import Base from "../Base.js";
import { navList } from "../constants.js";

import Product from '../../pages/Product/index.js';
import ProductsList from '../../pages/productsList/index.js';
import { products } from '../../components/constants.js';
import { router } from "../../index.js";


// @ts-ignore: allow importing handlebars template without type declarations
import navbarTemplate from '../../../views/navbar.hbs';

interface navbarContext {
    // Define the context properties needed for the navbar component
    navList: string[];
}

const transformStateToTemplateArguments = () : navbarContext => {
    return {
        navList: navList
    }
};


export default class Navbar extends Base<navbarContext>{
    constructor() {
        console.log("Initializing Navbar component...");
        super(navbarTemplate, "navbar-big-container", transformStateToTemplateArguments());
    }

    public configure(): void {
        document.querySelector('#close-nnav-menu').addEventListener('click', this.closeMobileMenu.bind(this));
        document.querySelector('#nav-menu-button').addEventListener('click', this.openMobileMenu.bind(this));
        document.querySelectorAll('.navbar-item').forEach( (elem, index) => {
            elem.addEventListener('click', this.handleNavigation.bind(this, index))
        });
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
        this.render(transformStateToTemplateArguments());
    }

    private handleNavigation(index: number): void {
        const section = navList[index].toLowerCase();
        router.navigate(section);
    } 
}