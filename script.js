const input = document.getElementById('taskInput');
    const categoryInput = document.getElementById('categoryInput');
    const list = document.getElementById('taskList');
    const dateInput = document.getElementById('dateInput');
    const filterDate = document.getElementById('filterDate');
    const commentInput = document.getElementById('commentInput');
    const calendarDays = document.getElementById('calendarDays');
    const monthTitle = document.getElementById('monthTitle');
    const addTaskForm = document.getElementById('addTaskForm');
    const taskFormTitle = document.getElementById('taskFormTitle');
    const createDatedTaskButton = document.getElementById('createDatedTaskButton');
    const createUndatedTaskButton = document.getElementById('createUndatedTaskButton');
    const cancelTaskButton = document.getElementById('cancelTaskButton');
    let currentFilter = 'Все';
    let showUndatedOnly = false;
    let displayedMonth = new Date(
      new Date().getFullYear(),
      new Date().getMonth(),
      1
    );

    let selectedDate = '';



let tasks = JSON.parse(
  localStorage.getItem('myTasks') || '[]'
).map(task => ({
  ...task,
  category: task.category || 'Личное',
  date: task.date || '',
  comment: task.comment || '',
}));



function saveTasks() {
  localStorage.setItem('myTasks', JSON.stringify(tasks));
}

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function renderCalendar() {
  const year = displayedMonth.getFullYear();
  const month = displayedMonth.getMonth();

  const monthNames = [
    'Январь', 'Февраль', 'Март', 'Апрель',
    'Май', 'Июнь', 'Июль', 'Август',
    'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'
  ];

  monthTitle.textContent = `${monthNames[month]} ${year}`;
  calendarDays.innerHTML = '';

  const firstDay = new Date(year, month, 1);
  const offset = (firstDay.getDay() + 6) % 7;
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const start = new Date(year, month, 1 - offset);
  const today = getTodayDate();

  const taskCounts = {};

  tasks.forEach(task => {
    if (task.date) {
      taskCounts[task.date] = (taskCounts[task.date] || 0) + 1;
    }
  });

  for (let i = 0; i < 42; i++) {
    const date = new Date(
      start.getFullYear(),
      start.getMonth(),
      start.getDate() + i
    );

    const dateString = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, '0'),
      String(date.getDate()).padStart(2, '0')
    ].join('-');

    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = date.getDate();

    if (date.getMonth() !== month) {
      button.classList.add('other-month');
    }

    if (dateString === today) {
      button.classList.add('today');
    }

    if (dateString === selectedDate) {
      button.classList.add('selected');
    }

    const count = taskCounts[dateString] || 0;

    if (count > 0) {
      const badge = document.createElement('span');
      badge.className = 'task-count';
      badge.textContent = count;
      button.appendChild(badge);
    }

    button.addEventListener('click', () => {
      selectedDate = dateString;
      filterDate.value = dateString;

      displayedMonth = new Date(
        date.getFullYear(),
        date.getMonth(),
        1
      );

      renderCalendar();
      renderTasks();
    });

    calendarDays.appendChild(button);
  }
}

function renderTasks() {
  list.innerHTML = '';


const active = tasks.filter(task => !task.done).length;
const completed = tasks.filter(task => task.done).length;
const total = tasks.length;

const percent = total === 0
  ? 0
  : Math.round((completed / total) * 100);

    document.getElementById('activeCount').textContent = active;
    document.getElementById('doneCount').textContent = completed;
    document.getElementById('progressPercent').textContent = percent + '%';
    document.getElementById('progressBar').style.width = percent + '%';


  tasks.forEach((task, index) => {
  // Фильтр по категории
if (currentFilter !== 'Все' && task.category !== currentFilter) {
  return;
}

// Независимый фильтр задач без даты
if (showUndatedOnly && task.date) {
  return;
}

// Фильтр по дате календаря
if (filterDate.value && task.date !== filterDate.value) {
  return;
}
    const item = document.createElement('li');
    if (task.done) item.classList.add('done');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.done;

    checkbox.addEventListener('change', () => {
      tasks[index].done = checkbox.checked;
      saveTasks();
      renderTasks();
    });

   
const label = document.createElement('span');
label.className = 'task-label';
label.textContent = task.text;
label.title = 'Нажми, чтобы открыть комментарий';

const commentPanel = document.createElement('div');
commentPanel.className = 'comment-panel';
commentPanel.hidden = true;

const commentText = document.createElement('p');
commentText.className = 'comment-text';
commentText.textContent = task.comment || '';

const commentEditor = document.createElement('div');
commentEditor.className = 'comment-editor';

const commentArea = document.createElement('textarea');
commentArea.placeholder = 'Добавить или изменить комментарий...';
commentArea.value = task.comment || '';
commentArea.setAttribute('aria-label', 'Комментарий к задаче');

const saveCommentButton = document.createElement('button');
saveCommentButton.textContent = 'Сохранить комментарий';

const deleteCommentButton = document.createElement('button');
deleteCommentButton.textContent = 'Удалить комментарий';
deleteCommentButton.type = 'button';
deleteCommentButton.className = 'delete-comment-button';

deleteCommentButton.addEventListener('click', () => {
  tasks[index].comment = '';
  saveTasks();
  renderTasks();
});

const commentToggle = document.createElement('button');
commentToggle.className = 'comment-toggle';
commentToggle.type = 'button';
commentToggle.textContent = task.comment ? '📝 Заметка' : '+ Комментарий';
commentToggle.setAttribute('aria-label', 'Открыть комментарий');

function toggleComment() {
  commentPanel.hidden = !commentPanel.hidden;
  item.classList.toggle('comment-open', !commentPanel.hidden);
}

label.addEventListener('click', toggleComment);
commentToggle.addEventListener('click', toggleComment);

saveCommentButton.addEventListener('click', () => {
  tasks[index].comment = commentArea.value.trim();
  saveTasks();
  renderTasks();
});

commentEditor.append(
  commentArea,
  saveCommentButton,
  deleteCommentButton
);
commentPanel.append(commentText, commentEditor);

if (task.comment && task.comment.trim()) {
  item.classList.add('has-comment');
}


const categoryLabel = document.createElement('small');
categoryLabel.className = 'task-category';
categoryLabel.textContent = task.category;

const dateLabel = document.createElement('small');
dateLabel.className = 'task-date';

if (task.date) {
  const parts = task.date.split('-');
  dateLabel.textContent = `${parts[2]}.${parts[1]}.${parts[0]}`;
} else {
  dateLabel.textContent = 'Без срока';
}
if (task.date && task.date < getTodayDate() && !task.done) {
  dateLabel.classList.add('overdue');
}
    const removeButton = document.createElement('button');
    removeButton.textContent = 'Удалить';
    removeButton.addEventListener('click', () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    
item.append(
  checkbox,
  label,
  categoryLabel,
  dateLabel,
  commentToggle,
  removeButton,
  commentPanel
);

    list.appendChild(item);
  });
}

function addTask() {
  const text = input.value.trim();
  if (!text) return;



tasks.push({
  text: text,
  category: categoryInput.value,
  date: dateInput.value,
  comment: commentInput.value.trim(),
  done: false
});


saveTasks();
renderCalendar();
renderTasks();

  input.value = '';
  dateInput.value = '';
  commentInput.value = '';
  input.focus();
}

// Создание задачи на выбранную дату
createDatedTaskButton.addEventListener('click', () => {
  const date = filterDate.value;

  if (!date) {
    alert('Сначала выбери дату в календаре.');
    return;
  }

  dateInput.value = date;
  taskFormTitle.textContent = 'Задача на выбранную дату';
  addTaskForm.hidden = false;
  input.focus();
});

// Создание задачи без даты
createUndatedTaskButton.addEventListener('click', () => {
  dateInput.value = '';
  taskFormTitle.textContent = 'Задача без даты';
  addTaskForm.hidden = false;
  input.focus();
});

// Закрытие формы
cancelTaskButton.addEventListener('click', () => {
  addTaskForm.hidden = true;
input.value = '';
dateInput.value = '';
commentInput.value = '';
addTaskForm.hidden = true;

renderCalendar();
renderTasks();
});
document.getElementById('addButton').addEventListener('click', addTask);

input.addEventListener('keydown', event => {
  if (event.key === 'Enter') addTask();
});

document.querySelectorAll('.filter-button').forEach(button => {
  button.addEventListener('click', () => {
    currentFilter = button.dataset.category;

    document.querySelectorAll('.filter-button').forEach(item => {
      item.classList.remove('active');
    });

    button.classList.add('active');
    renderTasks();
  });
});

// Независимый фильтр «Без даты»
const undatedFilterButton = document.getElementById('undatedFilterButton');

undatedFilterButton.addEventListener('click', () => {
  showUndatedOnly = !showUndatedOnly;

  undatedFilterButton.classList.toggle('active', showUndatedOnly);
  undatedFilterButton.setAttribute('aria-pressed', String(showUndatedOnly));

  renderTasks();
});

filterDate.addEventListener('change', () => {
  renderTasks();
});

document.getElementById('clearDateFilter').addEventListener('click', () => {
  filterDate.value = '';
  renderTasks();
});

document.getElementById('prevMonth').addEventListener('click', () => {
  displayedMonth = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth() - 1,
    1
  );
  renderCalendar();
});

document.getElementById('nextMonth').addEventListener('click', () => {
  displayedMonth = new Date(
    displayedMonth.getFullYear(),
    displayedMonth.getMonth() + 1,
    1
  );
  renderCalendar();
});

document.getElementById('todayButton').addEventListener('click', () => {
  const today = getTodayDate();
  selectedDate = today;
  filterDate.value = today;

  const parts = today.split('-').map(Number);
  displayedMonth = new Date(parts[0], parts[1] - 1, 1);

  renderCalendar();
  renderTasks();
});

document.getElementById('clearDateFilter').addEventListener('click', () => {
  selectedDate = '';
  filterDate.value = '';

  renderCalendar();
  renderTasks();
});

renderCalendar();

renderTasks();

// Управление раскрытием календаря
const calendarCard = document.querySelector('.calendar-card');
const calendarToggle = document.getElementById('calendarToggle');
const calendarArrow = document.getElementById('calendarArrow');

// При открытии страницы календарь свёрнут
calendarCard.classList.add('collapsed');

calendarToggle.addEventListener('click', () => {
  const collapsed = calendarCard.classList.toggle('collapsed');

  calendarToggle.setAttribute('aria-expanded', String(!collapsed));
  calendarArrow.textContent = collapsed ? '▾' : '▴';
});