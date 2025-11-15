import Base from "../../components/Base.js";
import { cart } from "../../store/index.js";

// @ts-ignore: allow importing handlebars template without type declarations
import productTemplate from '../../../views/product.hbs';

import { products } from "../../components/constants.js";

interface productContext {
    // Define the context properties needed for the product component
    selectedImage: {
        image: string,
        thumbnail: string,
        number: string
    },
    product: {
        seller: string, 
        name: string,
        description: string,
        price: number,
        currency: string,
        discount: number,
        oldPrice: number
    }
    images: Array<{
        image: string,
        thumbnail: string,
        number: string
    }>;
    currentQuantity: number;
}

const transformStateToTemplateArguments = (productComponent: Product) : productContext => {
    const quantity = productComponent.quantity;
    const focusedImageIndex = productComponent.focusedImageIndex;
    const productIndex = productComponent.productIndex;
    return {
        selectedImage: {
            image: products[productIndex].images[focusedImageIndex].image,
            thumbnail: products[productIndex].images[focusedImageIndex].thumbnail,
            number: products[productIndex].images[focusedImageIndex].number.toString()
        },
        product: {
            ...products[productIndex],
            oldPrice: products[productIndex].price / (1 - products[productIndex].discount / 100)
        },
        currentQuantity:quantity,
        images: products[productIndex].images.map(img => ({
            image: img.image,
            thumbnail: img.thumbnail,
            number: img.number.toString()
        }))
    }
}

export default class Product extends Base<productContext>{
    private _currentQuantity: number = 0;
    private _focusedImageIndex: number = 0;
    constructor(private _productIndex: number) {
        super(productTemplate, "product");
        this.render(transformStateToTemplateArguments(this));
    }

    public mount(productIndex: number): void {
        this._productIndex = productIndex;
        this._currentQuantity = 0;
        this._focusedImageIndex = 0;
        this.render(transformStateToTemplateArguments(this));
        this._hostElement.classList.remove('hide');
    }

    public unmount(): void {
        // Any cleanup if necessary
        this._hostElement.classList.add('hide');
    }

    get quantity(): number {
        return this._currentQuantity;
    }

    set quantity(value: number) {
        this._currentQuantity = Math.max(0, value);
    }

    get focusedImageIndex(): number {
        return this._focusedImageIndex;
    }

    set focusedImageIndex(value: number) {
        this._focusedImageIndex = Math.max(0, Math.min(value, products[this._productIndex].images.length - 1));
        document.querySelector('.selected-image img')!.setAttribute('src', products[this.productIndex].images[this._focusedImageIndex].image);
    }

    get productIndex() : number {
        return this._productIndex;
    }

    public configure(): void {
        document.querySelector('#decrease-quantity').addEventListener('click', this.decreaseQuantity.bind(this));
        document.querySelector('#increase-quantity').addEventListener('click', this.increaseQuantity.bind(this));
        document.querySelector('#add-to-cart-button').addEventListener('click', this.addToCart.bind(this));
        document.querySelectorAll('.product-image').forEach((element, index) => {
            element.addEventListener('click', this.changeFocusedImage.bind(this, index));
        });

        document.querySelector('#select-prev')!.addEventListener('click', () => this.focusedImageIndex--);
        document.querySelector('#select-next')!.addEventListener('click', () => this.focusedImageIndex++);
    }

    public decreaseQuantity(): void {
        this.quantity--;
        this.render(transformStateToTemplateArguments(this));
    }

    public increaseQuantity(): void {
        this.quantity++;
        this.render(transformStateToTemplateArguments(this));
    }

    public addToCart(): void {
        cart.dispatch({
            type: 'add',
            data: {
                title: products[this.productIndex].name,
                desc: products[this.productIndex].description,
                price: products[this.productIndex].price,
                quantity: this.quantity,
                discount: products[this.productIndex].discount
            }
        })

        // alter the quantity without re-rendering!
        this.quantity = 0;
        document.querySelector('#selected-quantity')!.textContent = '0';
    }

    public changeFocusedImage(imageIndex: number): void {
        this.focusedImageIndex = imageIndex;
        
    }
}