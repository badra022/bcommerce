import Base from './Base.js';
import Task from './Task.js';
export default class TasksList extends Base {
    constructor(_name, repository) {
        super('tasks-container-template', 'root');
        this._name = _name;
        this.repository = repository;
        this.tasks = [];
        this.render('start');
    }
    configure() {
        this.repository.subscribe(action => {
            switch (action) {
                case 'add': {
                    this._addTask(action.data);
                    break;
                }
                case 'remove': {
                    this._removeTask(action.data);
                    break;
                }
                default: {
                    throw Error(`action uncaught in TasksList: ${action}!`);
                }
            }
        });
    }
    _addTask({ title, desc }) {
        let newTaskId = this.repository.getState().length;
        const newTask = new Task(newTaskId, title, desc);
        this.tasks.push(newTask);
        console.log(`Task "${title}" added to column.`);
        this.tasks.push(newTask);
    }
    _removeTask({ title, desc }) {
        this.tasks = this.tasks.filter(tasks => {
            tasks.Title !== title;
        });
    }
    renderContent() {
    }
}
