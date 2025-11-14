import Base from "../Base.js";
import { navList } from "../constants.js";
import { router } from "../../index.js";
import navbarTemplate from '../../../views/navbar.hbs';
const transformStateToTemplateArguments = () => {
    return {
        navList: navList
    };
};
export default class Navbar extends Base {
    constructor() {
        console.log("Initializing Navbar component...");
        super(navbarTemplate, "navbar-big-container", transformStateToTemplateArguments());
    }
    configure() {
        document.querySelector('#close-nnav-menu').addEventListener('click', this.closeMobileMenu.bind(this));
        document.querySelector('#nav-menu-button').addEventListener('click', this.openMobileMenu.bind(this));
        document.querySelectorAll('.navbar-item').forEach((elem, index) => {
            elem.addEventListener('click', this.handleNavigation.bind(this, index));
        });
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
        this.render(transformStateToTemplateArguments());
    }
    handleNavigation(index) {
        const section = navList[index].toLowerCase();
        router.navigate(section);
    }
}
