import Base from "../../components/Base.js";
import { cart } from "../../store/index.js";
import productTemplate from '../../../views/product.hbs';
const transformStateToTemplateArguments = (productComponent) => {
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
        currentQuantity: quantity,
        images: product.images.map(img => ({
            image: img.image,
            thumbnail: img.thumbnail,
            number: img.number.toString()
        }))
    };
};
export default class Product extends Base {
    constructor(_product) {
        super(productTemplate, "product");
        this._product = _product;
        this._currentQuantity = 0;
        this._focusedImageIndex = 0;
        this.render(transformStateToTemplateArguments(this));
    }
    mount(product) {
        this._product = product;
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
        this._focusedImageIndex = Math.max(0, Math.min(value, this.product.images.length - 1));
        document.querySelector('.selected-image img').setAttribute('src', this.product.images[this._focusedImageIndex].image);
    }
    get product() {
        return this._product;
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
        this._updateQuantityValue();
    }
    increaseQuantity() {
        this.quantity++;
        this._updateQuantityValue();
    }
    _updateQuantityValue() {
        const quantityElement = document.querySelector('#selected-quantity');
        quantityElement.textContent = this.quantity.toString();
    }
    addToCart() {
        cart.dispatch({
            type: 'add',
            data: {
                title: this.product.name,
                desc: this.product.description,
                price: this.product.price,
                quantity: this.quantity,
                discount: this.product.discount
            }
        });
        this.quantity = 0;
        document.querySelector('#selected-quantity').textContent = '0';
    }
    changeFocusedImage(imageIndex) {
        this.focusedImageIndex = imageIndex;
    }
}
