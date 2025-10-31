export default class Task {
    private htmlText: string;
    constructor(private id: number, private title: string, private desc: string) {
        console.log('Task created');
        this.htmlText = `<div class="task-container" id="task-${id}">
                            <h2 class="task-title">${title}</h2>
                            <p class="task-description">${desc}</p>
                            <i class="delete-icon"></i>
                        </div>`;
    }

    getHTML(): string {
        return this.htmlText;
    }

    get Title() {
        return this.title;
    }
}