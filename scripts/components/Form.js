import Base from './Base.js';
export default class Form extends Base {
    constructor(repository) {
        super('task-form-template', 'root');
        this.repository = repository;
        this._element = this._element;
        this.render('start');
        this.configure();
    }
    _submitHandler(event) {
        event.preventDefault();
        console.log('Task form submitted');
        const titleFieldElement = this._element.querySelector('#task-title');
        const descFieldElement = this._element.querySelector('#task-description');
        if (this._validateInputs(titleFieldElement, descFieldElement)) {
            this.repository.dispatch({
                type: 'add',
                data: {
                    title: titleFieldElement.value,
                    desc: descFieldElement.value
                }
            });
        }
    }
    _validateInputs(titleElement, descElement) {
        let detectedError = false;
        const titleError = this._getErrorMessage(titleElement.value);
        const descError = this._getErrorMessage(descElement.value);
        if (titleError.length) {
            const errorElement = this._element.querySelector('#title-error');
            errorElement.style.display = 'block';
            errorElement.textContent = titleError;
            detectedError = true;
        }
        if (descError.length) {
            const errorElement = this._element.querySelector('#desc-error');
            errorElement.style.display = 'block';
            errorElement.textContent = descError;
            detectedError = true;
        }
        return detectedError;
    }
    configure() {
        this._element.addEventListener('submit', this._submitHandler.bind(this));
    }
    renderContent() {
        const headerElement = this._element.querySelector('.header');
        const titleLabelElement = this._element.querySelector('#task-title-label');
        const descriptionLabelElement = this._element.querySelector('#task-description-label');
        headerElement.textContent = 'Add New Task';
        titleLabelElement.textContent = 'Task Title';
        descriptionLabelElement.textContent = 'Task Description';
    }
    _getErrorMessage(value, rules) {
        if (!rules)
            return "";
        if (rules.required && !value) {
            return `This field is Required`;
        }
        if (rules.min && value.length < rules.min) {
            return `This field have a minimum of ${rules.min}`;
        }
        if (rules.max && value.length > rules.max) {
            return `This field have a maxmimum of ${rules.min}`;
        }
    }
}
