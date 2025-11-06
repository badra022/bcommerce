import Base from "../Base.js";
import { cart } from "../../store/index.js";
import cartTemplate from '../../../views/cart.hbs';
const transformStateToTemplateArguments = (cartItems) => {
    return {
        items: cartItems?.map(item => ({
            itemName: item.title || "Unnamed Item",
            unitPrice: item.price.toFixed(2).toString() || 'Free',
            itemQuantity: item.quantity.toString() || '1',
            totalPrice: (item.price * item.quantity).toFixed(2).toString() || '0'
        })) || []
    };
};
export default class Cart extends Base {
    constructor() {
        super(cartTemplate, "cart", transformStateToTemplateArguments(cart.getState()));
        if (cart.getState()?.items?.length) {
            this._hostElement.querySelector('#empty-container')?.classList.add('hide');
        }
        else {
            this._hostElement.querySelector('#empty-container')?.classList.remove('hide');
        }
        this._hostElement.classList.add('hide');
    }
    configure() {
        document.querySelectorAll('.cart-item-delete-button').forEach((elem, index) => {
            elem.addEventListener('click', this.deleteItem.bind(this));
        });
        document.querySelector('#cart-checkout-button').addEventListener('click', this.checkout.bind(this));
        cart.subscribe(this.addItem.bind(this));
    }
    addItem(action) {
        if (action.type !== 'add')
            return;
        this.render(transformStateToTemplateArguments(cart.getState()));
    }
    toggleCart() {
        if (this._hostElement.classList.contains('hide')) {
            this._hostElement.classList.remove('hide');
        }
        else {
            this._hostElement.classList.add('hide');
        }
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
    }
    checkout() {
        console.log("Checkout initiated: ", cart.getState());
    }
}
