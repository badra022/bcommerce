export default class Task {
    constructor(id, title, desc) {
        this.id = id;
        this.title = title;
        this.desc = desc;
        console.log('Task created');
        this.htmlText = `<div class="task-container" id="task-${id}">
                            <h2 class="task-title">${title}</h2>
                            <p class="task-description">${desc}</p>
                            <i class="delete-icon"></i>
                        </div>`;
    }
    getHTML() {
        return this.htmlText;
    }
    get Title() {
        return this.title;
    }
}
