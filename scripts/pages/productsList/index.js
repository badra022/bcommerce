import Base from "../../components/Base.js";
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
        console.log("Initializing Product cards component...");
        console.log(cardsTemplate);
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
    }
}
