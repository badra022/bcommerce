import Base from "../../components/Base.js";

// @ts-ignore: allow importing handlebars template without type declarations
import cardsTemplate from '../../../views/productCards.hbs';

interface productCardsContext {
    // Define the context properties needed for the products list component
    products: Array<{
        seller: string, 
        name: string,
        price: number,
        currency: string,
        discount: number,
        oldPrice: number,
        imageSrc: string,
    }>
}

const transformStateToTemplateArguments = (productsListComponent: ProductsList) : productCardsContext => {
    return {
        products: productsListComponent.products?.map(product => {
            return {
                ...product,
                oldPrice: product.price / (1 - product.discount / 100),
                imageSrc: product.images[0].image
            }
        })
    }
}

export default class ProductsList extends Base<productCardsContext>{
    constructor(private _products: Array<any>) {
        console.log("Initializing Product cards component...");
        console.log(cardsTemplate);
        super(cardsTemplate, "products-list-container");
        this.render(transformStateToTemplateArguments(this));
    }

    get products() : Array<any> {
        return this._products;
    }

    public mount(products: Array<any>): void {
        this._products = products;
        this.render(transformStateToTemplateArguments(this));
        this._hostElement.classList.remove('hide');
    }

    public unmount(): void {
        // Any cleanup if necessary
        this._hostElement.classList.add('hide');
    }

    public configure(): void {
        // add container click event to go to the product page of the clicked product
    }
}