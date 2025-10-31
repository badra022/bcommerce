import Base from './Base.js';
import Task from './Task.js';

export default class TasksList extends Base<HTMLDivElement> {
    tasks: Task[] = [];
    constructor(private _name : string, private repository: any) {
        super('tasks-container-template', 'root');
        this.render('start');
    }

    public configure(): void {
        this.repository.subscribe(action => {
            switch(action) {
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
        })
    }

    private _addTask({title, desc} : {title  :string, desc : string}) : void {
        let newTaskId = this.repository.getState().length;
        const newTask = new Task(newTaskId, title, desc);
        this.tasks.push(newTask);
        console.log(`Task "${title}" added to column.`);
        this.tasks.push(newTask);
    }

    private _removeTask({title, desc} : {title  :string, desc : string}){
        this.tasks = this.tasks.filter(tasks => {
            tasks.Title !== title
        })
    }

    protected renderContent(): void {

    }
}