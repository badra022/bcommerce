export default class Base {
    constructor(_template, _hostElementId, data = {}) {
        this._template = _template;
        this._hostElementId = _hostElementId;
        this.data = data;
        this._hostElement = document.querySelector(`#${this._hostElementId}`);
        this.render(this.data);
    }
    render(data) {
        console.log("Rendering component...", this._hostElement);
        this._hostElement.innerHTML = this._template(data);
        this.configure();
    }
}
