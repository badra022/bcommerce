import Base from './Base.js';

export default class Form extends Base<HTMLFormElement> {
    constructor(private repository: any) {
        super('task-form-template', 'root');
        this._element = this._element;
        this.render('start');
        this.configure();
    }

    private _submitHandler(event: Event): void {
        event.preventDefault();
        console.log('Task form submitted');
        const titleFieldElement = this._element.querySelector('#task-title')! as HTMLInputElement;
        const descFieldElement = this._element.querySelector('#task-description')! as HTMLTextAreaElement;

        if(this._validateInputs(titleFieldElement, descFieldElement)) {
            this.repository.dispatch({
                type: 'add',
                data: {
                    title: titleFieldElement.value,
                    desc: descFieldElement.value
                }
            });
        }
    }

    private _validateInputs(titleElement: HTMLInputElement, descElement: HTMLTextAreaElement) : boolean {
        let detectedError = false;
        const titleError = this._getErrorMessage(titleElement.value);
        const descError = this._getErrorMessage(descElement.value);

        if(titleError.length) {
            const errorElement = this._element.querySelector('#title-error')! as HTMLSpanElement;
            errorElement.style.display = 'block';
            errorElement.textContent = titleError;
            detectedError = true;
        }
        if(descError.length) {
            const errorElement = this._element.querySelector('#desc-error')! as HTMLSpanElement;
            errorElement.style.display = 'block';
            errorElement.textContent = descError;
            detectedError = true;
        }

        return detectedError;
    }

    public configure(): void {
        this._element.addEventListener('submit', this._submitHandler.bind(this));
    }

    public renderContent(): void {
        const headerElement = this._element.querySelector('.header')! as HTMLHeadingElement;
        const titleLabelElement = this._element.querySelector('#task-title-label')! as HTMLLabelElement;
        const descriptionLabelElement = this._element.querySelector('#task-description-label')! as HTMLLabelElement;

        headerElement.textContent = 'Add New Task';
        titleLabelElement.textContent = 'Task Title';
        descriptionLabelElement.textContent = 'Task Description';
    }

    private _getErrorMessage(value: string, rules?: {min?: number, max?: number, required: boolean}) : string{
        if(!rules) return "";

        if(rules.required && !value) {
            return `This field is Required`;
        }

        if(rules.min && value.length < rules.min) {
            return `This field have a minimum of ${rules.min}`;
        }
        if(rules.max && value.length > rules.max) {
            return `This field have a maxmimum of ${rules.min}`;
        }
    }
}