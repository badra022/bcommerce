import Base from "../Base.js";
import { cart } from "../../store/index.js";
import type { CartItem } from "../../store/index.js";

// @ts-ignore: allow importing handlebars template without type declarations
import cartTemplate from '../../../views/cart.hbs';

interface CartContext {
    // Define the context properties needed for the Cart component
    cartItemCount: number;
    items: Array<{
        itemName: string,
        unitPrice: string,
        itemQuantity: string,
        totalPrice: string
    }>;
    totalPrice: string;
}

const transformStateToTemplateArguments = (cartItems: CartItem[]) : CartContext => {
    return {
        cartItemCount: cartItems?.length || 0,
        items: cartItems?.map(item => ({
            itemName: item.title || "Unnamed Item",
            unitPrice: item.price.toFixed(2).toString() || 'Free',
            itemQuantity: item.quantity.toString() || '1',
            totalPrice: (item.price * item.quantity).toFixed(2).toString() || '0'
        })) || [],
        totalPrice: cartItems?.reduce((acc, item) => acc + item.price * item.quantity, 0).toFixed(2).toString() || '0'
    }
};


export default class Cart extends Base<CartContext>{
    constructor() {
        super(cartTemplate, "cart-container", transformStateToTemplateArguments(cart.getState()));
        if(cart.getState()?.items?.length) {
           this._hostElement.querySelector('#empty-container')?.classList.add('hide');
        } else {
            this._hostElement.querySelector('#empty-container')?.classList.remove('hide');
        }

        // initially cart itself is closed/hidden
        this._hostElement.querySelector('#cart').classList.add('hide');
    }

    public configure(): void {
        document.querySelectorAll('.cart-item-delete-button').forEach( (elem, index) => {
            elem.addEventListener('click', this.deleteItem.bind(this))
    });
        document.querySelector('#cart-checkout-button').addEventListener('click', this.checkout.bind(this));
        cart.subscribe(this.addItem.bind(this))
        document.querySelector('#cart-button-container').addEventListener('click', this.toggleCart.bind(this));
    }

    public addItem(action): void {
        if(action.type !== 'add') return;
        // Re-render the cart with updated state
        this.render(transformStateToTemplateArguments(cart.getState()));
    }

    public toggleCart(): void {
        const cartElement : HTMLElement = this._hostElement.querySelector('#cart') as HTMLElement;
        if(cartElement.classList.contains('hide')) {
            cartElement.classList.remove('hide');
        } else {
            cartElement.classList.add('hide');
        }
    }

    public deleteItem(event: Event): void {
        const targetElement = event.target as HTMLElement;
        const parentElement = targetElement.parentElement.parentElement as HTMLElement;
        cart.dispatch({
            type: 'remove',
            data: {
                title: parentElement.querySelector('.cart-item-description')?.textContent
            }
        });
        // Re-render the cart with updated state
        this.render(transformStateToTemplateArguments(cart.getState()));
    }

    public checkout(): void {
        // Implement checkout logic here
        console.log("Checkout initiated: ", cart.getState());
    }
}