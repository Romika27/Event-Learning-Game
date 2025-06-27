const eventToTrack = [
  { id: 'clickbtn', event: 'click' },
  { id: 'bdlClickBtn', event: 'dblclick' },
  { id: 'inputBox', event: 'input' },
  { id: 'FocusBox', event: 'focus' },
  { id: 'FocusBox', event: 'blur' },
  { id: 'selectBox', event: 'change' },
  { id: 'submitForm', event: 'submit' },
  { id: 'scrollBox', event: 'scroll' },
  { id: 'dragItem', event: 'dragstart' },
  { id: 'dropZone', event: 'drop' },
  { id: 'dropZone', event: 'dragover' },
  { target: window, event: 'keydown' },
  { target: window, event: 'keyup' },
  { target: window, event: 'resize' },
  { target: window, event: 'load' }
];

let triggeredEvents = [];

const eventList = document.getElementById('event-list');
const progressSpan = document.querySelector('.Progress span');
const completedMsg = document.getElementById('completedMsg');
const resetBtn = document.getElementById('resetBtn');

function setupEventListener() {
  eventToTrack.forEach(({ id, event, target }) => {
    const el = target || (id && document.getElementById(id));
    if (el) {
      el.addEventListener(event, (e) => {
        if (event === 'drop' || event === 'dragover' || event === 'submit') {
          e.preventDefault();
        }

        if (id === 'FocusBox') {
          if (event === 'focus') {
            el.classList.add('focused');
            el.classList.remove('blurred');
          } else if (event === 'blur') {
            el.classList.add('blurred');
            el.classList.remove('focused');
          }
        }

        const key = `${id || target?.name || 'window'}-${event}`;
        markEventComplete(key);
      });
    }
  });
}

function markEventComplete(key) {
  if (!triggeredEvents.includes(key)) {
    triggeredEvents.push(key);
    updateProgressUI();
  }
}

function updateProgressUI() {
  eventList.innerHTML = "";
  let completeCount = 0;

  eventToTrack.forEach(({ id, event, target }) => {
    const key = `${id || target?.name || 'window'}-${event}`;
    const isDone = triggeredEvents.includes(key);
    const li = document.createElement('li');
    li.textContent = `Event: ${event} on ${id || 'window'}`;
    if (isDone) li.classList.add('completed');
    eventList.appendChild(li);
    if (isDone) completeCount++;
  });

  const percentage = Math.round((completeCount / eventToTrack.length) * 100);
  progressSpan.textContent = `Progress: ${percentage}%`;
  completedMsg.classList.toggle('hidden', completeCount !== eventToTrack.length);
}

resetBtn.addEventListener('click', () => {
  triggeredEvents = [];
  completedMsg.classList.add('hidden');
  updateProgressUI();
});

setupEventListener();
updateProgressUI();

