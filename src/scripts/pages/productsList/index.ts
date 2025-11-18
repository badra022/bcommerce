import Base from "../../components/Base.js";
import { router } from "../../index.js";

// @ts-ignore: allow importing handlebars template without type declarations
import cardsTemplate from '../../../views/productCards.hbs';
import { productsListViewDto } from "../../types/productDto.js";

type productCardsContext = productsListViewDto;

const transformStateToTemplateArguments = (productsListComponent: ProductsList) : productCardsContext => {
    // curerntly no transformation needed for this component state to fit the template context
    return productsListComponent.products;
}

export default class ProductsList extends Base<productCardsContext>{
    constructor(private _products: productsListViewDto) {
        super(cardsTemplate, "products-list-container");
        this.render(transformStateToTemplateArguments(this));
    }

    get products() : productsListViewDto {
        return this._products;
    }

    public mount(products: productsListViewDto): void {
        this._products = products;
        this.render(transformStateToTemplateArguments(this));
        this._hostElement.classList.remove('hide');
    }

    public unmount(): void {
        // Any cleanup if necessary
        this._hostElement.classList.add('hide');
    }

    public configure(): void {
        this._hostElement.querySelectorAll('.product-card').forEach( (elem) => {
            const productId = elem.getAttribute('data-id');
            elem.addEventListener('click', () => {
                router.navigate(productId);
            });
        });
    }
}