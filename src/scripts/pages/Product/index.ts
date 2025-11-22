import Base from "../../components/Base.js";
import { cart } from "../../store/index.js";

// @ts-ignore: allow importing handlebars template without type declarations
import productTemplate from '../../../views/product.hbs';

import { productViewDto } from "../../types/productDto.js";

interface productContext {
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
        oldPrice: number,
    },
    images: Array<{
        image: string,
        thumbnail: string,
        number: string
    }>,
    currentQuantity: number;
}

const transformStateToTemplateArguments = ( productComponent: Product) : productContext => {
    const quantity = productComponent.quantity;
    const focusedImageIndex = productComponent.focusedImageIndex;
    const product = productComponent.product;
    return {
        selectedImage: {
            image: product.images[focusedImageIndex].image,
            thumbnail: product.images[focusedImageIndex].thumbnail,
            number: product.images[focusedImageIndex].number.toString()
        },
        product: {
            ...product,
            oldPrice: product.price / (1 - product.discount / 100)
        },
        currentQuantity:quantity,
        images: product.images.map(img => ({
            image: img.image,
            thumbnail: img.thumbnail,
            number: img.number.toString()
        }))
    }
}

export default class Product extends Base<productContext>{
    private _currentQuantity: number = 0;
    private _focusedImageIndex: number = 0;
    private _quantityElement: HTMLElement;
    constructor(private _product: productViewDto) {
        super(productTemplate, "product");
        this.render(transformStateToTemplateArguments(this));
        this._quantityElement = document.querySelector('#selected-quantity')!;
    }

    public mount(product: productViewDto): void {
        this._product = product;
        this._currentQuantity = 0;
        this._focusedImageIndex = 0;
        this.render(transformStateToTemplateArguments(this));
        this._hostElement.classList.remove('hide');
        this._quantityElement = document.querySelector('#selected-quantity')!;
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
        this._focusedImageIndex = Math.max(0, Math.min(value, this.product.images.length - 1));
        document.querySelector('.selected-image img')!.setAttribute('src', this.product.images[this._focusedImageIndex].image);
    }
    
    get product(): productViewDto {
        return this._product;
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
        this._updateQuantityValue();
    }

    public increaseQuantity(): void {
        this.quantity++;
        this._updateQuantityValue();
    }

    private _updateQuantityValue(): void {
        this._quantityElement.textContent = this.quantity.toString();
    }

    public addToCart(): void {
        cart.dispatch({
            type: 'add',
            data: {
                title: this.product.name,
                desc: this.product.description,
                price: this.product.price,
                quantity: this.quantity,
                discount: this.product.discount,
                thumbnail: this.product.images[this.focusedImageIndex].thumbnail
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