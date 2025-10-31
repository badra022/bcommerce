import {tasks} from './store/index.js'

import Form from './components/Form.js';
import TasksColumn from './components/TasksList.js';

console.log("Hello, Task Manager!");

new Form(tasks);

new TasksColumn("to do", tasks);
new TasksColumn("in progress", tasks);
new TasksColumn("done", tasks);