import Base from "../Base.js";
import { cart } from "../../store/index.js";
import cartTemplate from '../../../views/cart.hbs';
const transformStateToTemplateArguments = (cartItems, isOpen) => {
    return {
        cartItemCount: cartItems?.length || 0,
        isOpen: isOpen,
        items: cartItems?.map(item => ({
            itemName: item.title || "Unnamed Item",
            unitPrice: item.price.toFixed(2).toString() || 'Free',
            itemQuantity: item.quantity.toString() || '1',
            totalPrice: (item.price * item.quantity).toFixed(2).toString() || '0',
            thumbnail: item.thumbnail || 'static/notFound.jpg'
        })) || [],
        totalPrice: cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2).toString() || '0'
    };
};
export default class Cart extends Base {
    constructor() {
        super(cartTemplate, "cart-container", transformStateToTemplateArguments(cart.getState(), false));
        this._isOpen = false;
    }
    configure() {
        document.querySelectorAll('.cart-item-delete-button').forEach((elem, index) => {
            elem.addEventListener('click', this.deleteItem.bind(this));
        });
        document.querySelector('#cart-checkout-button').addEventListener('click', this.checkout.bind(this));
        cart.subscribe(this.addItem.bind(this));
        document.querySelector('#cart-button-container').addEventListener('click', (event) => {
            event.stopPropagation();
            this.toggleCart();
        });
        document.addEventListener('click', (event) => {
            const targetElement = event.target;
            if (targetElement.closest('#cart-container')) {
                event.stopPropagation();
            }
            else {
                this._isOpen = false;
                this.render(transformStateToTemplateArguments(cart.getState(), this._isOpen));
            }
        });
    }
    addItem(action) {
        if (action.type !== 'add')
            return;
        this._isOpen = true;
        this.render(transformStateToTemplateArguments(cart.getState(), this._isOpen));
    }
    toggleCart() {
        this._isOpen = !(this._isOpen);
        console.log("Toggling cart. New state:", this._isOpen);
        this.render(transformStateToTemplateArguments(cart.getState(), this._isOpen));
    }
    deleteItem(event) {
        const targetElement = event.target;
        const parentElement = targetElement.parentElement.parentElement;
        cart.dispatch({
            type: 'remove',
            data: {
                title: parentElement.querySelector('.cart-item-description')?.textContent
            }
        });
        this.render(transformStateToTemplateArguments(cart.getState(), this._isOpen));
    }
    checkout() {
        cart.dispatch({ type: 'clear' });
        this.render(transformStateToTemplateArguments(cart.getState(), this._isOpen));
    }
}
