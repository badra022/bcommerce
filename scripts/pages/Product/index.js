import Base from "../../components/Base.js";
import { cart } from "../../store/index.js";
import productTemplate from '../../../views/product.hbs';
import { products } from "../../components/constants.js";
const transformStateToTemplateArguments = (productComponent) => {
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
        currentQuantity: quantity,
        images: products[productIndex].images.map(img => ({
            image: img.image,
            thumbnail: img.thumbnail,
            number: img.number.toString()
        }))
    };
};
export default class Product extends Base {
    constructor(_productIndex) {
        super(productTemplate, "product");
        this._productIndex = _productIndex;
        this._currentQuantity = 0;
        this._focusedImageIndex = 0;
        this.render(transformStateToTemplateArguments(this));
    }
    mount(productIndex) {
        this._productIndex = productIndex;
        this._currentQuantity = 0;
        this._focusedImageIndex = 0;
        this.render(transformStateToTemplateArguments(this));
        this._hostElement.classList.remove('hide');
    }
    unmount() {
        this._hostElement.classList.add('hide');
    }
    get quantity() {
        return this._currentQuantity;
    }
    set quantity(value) {
        this._currentQuantity = Math.max(0, value);
    }
    get focusedImageIndex() {
        return this._focusedImageIndex;
    }
    set focusedImageIndex(value) {
        this._focusedImageIndex = Math.max(0, Math.min(value, products[this._productIndex].images.length - 1));
        document.querySelector('.selected-image img').setAttribute('src', products[this.productIndex].images[this._focusedImageIndex].image);
    }
    get productIndex() {
        return this._productIndex;
    }
    configure() {
        document.querySelector('#decrease-quantity').addEventListener('click', this.decreaseQuantity.bind(this));
        document.querySelector('#increase-quantity').addEventListener('click', this.increaseQuantity.bind(this));
        document.querySelector('#add-to-cart-button').addEventListener('click', this.addToCart.bind(this));
        document.querySelectorAll('.product-image').forEach((element, index) => {
            element.addEventListener('click', this.changeFocusedImage.bind(this, index));
        });
        document.querySelector('#select-prev').addEventListener('click', () => this.focusedImageIndex--);
        document.querySelector('#select-next').addEventListener('click', () => this.focusedImageIndex++);
    }
    decreaseQuantity() {
        this.quantity--;
        this.render(transformStateToTemplateArguments(this));
    }
    increaseQuantity() {
        this.quantity++;
        this.render(transformStateToTemplateArguments(this));
    }
    addToCart() {
        cart.dispatch({
            type: 'add',
            data: {
                title: products[this.productIndex].name,
                desc: products[this.productIndex].description,
                price: products[this.productIndex].price,
                quantity: this.quantity,
                discount: products[this.productIndex].discount
            }
        });
        this.quantity = 0;
        document.querySelector('#selected-quantity').textContent = '0';
    }
    changeFocusedImage(imageIndex) {
        this.focusedImageIndex = imageIndex;
    }
}
