import Base from "../../components/Base.js";
import { router } from "../../index.js";
import cardsTemplate from '../../../views/productCards.hbs';
const transformStateToTemplateArguments = (productsListComponent) => {
    return {
        products: productsListComponent.products?.map(product => {
            return {
                ...product,
                oldPrice: product.price / (1 - product.discount / 100),
                imageSrc: product.images[0].image
            };
        })
    };
};
export default class ProductsList extends Base {
    constructor(_products) {
        super(cardsTemplate, "products-list-container");
        this._products = _products;
        this.render(transformStateToTemplateArguments(this));
    }
    get products() {
        return this._products;
    }
    mount(products) {
        this._products = products;
        this.render(transformStateToTemplateArguments(this));
        this._hostElement.classList.remove('hide');
    }
    unmount() {
        this._hostElement.classList.add('hide');
    }
    configure() {
        this._hostElement.querySelectorAll('.product-card').forEach((elem) => {
            const productId = elem.getAttribute('data-id');
            elem.addEventListener('click', () => {
                router.navigate(productId);
            });
        });
    }
}
