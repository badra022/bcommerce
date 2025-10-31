export default class Base {
    constructor(_templateId, _hostElementId) {
        this._templateId = _templateId;
        this._hostElementId = _hostElementId;
        this._template = document.getElementById(_templateId);
        this._hostElement = document.getElementById(_hostElementId);
        this._element = document.importNode(this._template.content, true).firstElementChild;
    }
    render(position) {
        this._hostElement.insertAdjacentElement(position === 'start' ? 'afterbegin' : 'beforeend', this._element);
        this.renderContent();
    }
    get element() {
        return this._element;
    }
}
