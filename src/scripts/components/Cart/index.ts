import Base from "../Base.js";
import { cart } from "../../store/index.js";
import type { CartItem } from "../../store/index.js";

// @ts-ignore: allow importing handlebars template without type declarations
import cartTemplate from '../../../views/cart.hbs';

interface CartContext {
    // Define the context properties needed for the Cart component
    cartItemCount: number;
    isOpen: boolean;
    items: Array<{
        itemName: string,
        unitPrice: string,
        itemQuantity: string,
        totalPrice: string
    }>;
    totalPrice: string;
}

const transformStateToTemplateArguments = (cartItems: CartItem[], isOpen: boolean) : CartContext => {
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
    }
};


export default class Cart extends Base<CartContext>{
    private _isOpen: boolean = false;
    constructor() {
        super(cartTemplate, "cart-container", transformStateToTemplateArguments(cart.getState(), false));
    }

    public configure(): void {
        document.querySelectorAll('.cart-item-delete-button').forEach( (elem, index) => {
            elem.addEventListener('click', this.deleteItem.bind(this))
    });
        document.querySelector('#cart-checkout-button').addEventListener('click', this.checkout.bind(this));
        cart.subscribe(this.addItem.bind(this))
        document.querySelector('#cart-button-container').addEventListener('click', (event) => {
            event.stopPropagation();
            this.toggleCart();
        });
        document.addEventListener('click', (event) => {
            const targetElement = event.target as HTMLElement;
            if(targetElement.closest('#cart-container')) {
                event.stopPropagation();
            } else {
                this._isOpen = false;
                this.render(transformStateToTemplateArguments(cart.getState(), this._isOpen));
            }
        })
    }

    public addItem(action): void {
        if(action.type !== 'add') return;
        this._isOpen = true;
        // Re-render the cart with updated state
        this.render(transformStateToTemplateArguments(cart.getState(), this._isOpen));
    }

    public toggleCart(): void {
        this._isOpen = !(this._isOpen);
        console.log("Toggling cart. New state:", this._isOpen);
        this.render(transformStateToTemplateArguments(cart.getState(), this._isOpen));
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
        this.render(transformStateToTemplateArguments(cart.getState(), this._isOpen));
    }

    public checkout(): void {
        // Implement checkout logic here
        cart.dispatch({ type: 'clear' });
        this.render(transformStateToTemplateArguments(cart.getState() , this._isOpen));
    }
}