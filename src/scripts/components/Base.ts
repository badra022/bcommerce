type placementPosition = 'start' | 'end';

export default abstract class Base<T extends HTMLElement> {
    private _template: HTMLTemplateElement;
    private _hostElement: HTMLElement;
    protected _element: T;
    constructor(private _templateId: string, private _hostElementId: string) {
        this._template = document.getElementById(_templateId)! as HTMLTemplateElement;
        this._hostElement = document.getElementById(_hostElementId)! as HTMLElement;
        this._element = document.importNode(this._template.content, true).firstElementChild! as T;
    }

    public render(position: placementPosition): void {
        // console.log("Rendering component...", this._element);
        this._hostElement.insertAdjacentElement(position === 'start' ? 'afterbegin' : 'beforeend', this._element);
        this.renderContent();
    }

    public get element(): T {
        return this._element;
    }

    public abstract configure(): void;

    protected abstract renderContent(): void;
}