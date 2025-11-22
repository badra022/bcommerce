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
        super(navbarTemplate, "navbar-big-container", transformStateToTemplateArguments());
    }
    configure() {
        document.querySelector('#close-nnav-menu').addEventListener('click', (event) => {
            event.stopPropagation();
            this.closeMobileMenu();
        });
        document.querySelector('#nav-menu-button').addEventListener('click', (event) => {
            event.stopPropagation();
            this.openMobileMenu();
        });
        document.querySelectorAll('.navbar-container .navbar-item').forEach((elem, index) => {
            elem.addEventListener('click', this.handleNavigation.bind(this, index));
        });
        document.querySelectorAll('#mobile-navbar-items .navbar-item').forEach((elem, index) => {
            elem.addEventListener('click', (event) => {
                event.stopPropagation();
                this.handleNavigation(index);
            });
        });
        document.querySelector('#navbar-logo').addEventListener('click', this.handleNavigation.bind(this, 0));
        document.addEventListener('click', (event) => {
            const targetElement = event.target;
            if (targetElement.closest('#mobile-navbar-items')) {
                event.stopPropagation();
            }
            else {
                console.log("Closing mobile menu due to outside click");
                this.closeMobileMenu();
            }
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
        this.closeMobileMenu();
    }
}
