// In browser environments the Node 'fs', 'path' and 'url' modules are not available.
// Load templates via fetch at runtime instead.

export default abstract class Base<TemplateContext> {
    protected _hostElement!: HTMLElement;
    constructor(private _template : any, private _hostElementId: string, protected data: TemplateContext = {} as TemplateContext) {
        this._hostElement = document.querySelector(`#${this._hostElementId}`)! as HTMLElement;
        this.render(this.data);
    }

    public render(data: TemplateContext): void {
        console.log("Rendering component...", this._hostElement);
        this._hostElement.innerHTML = this._template(data);
        this.configure();
    }

    public abstract configure(): void;
}