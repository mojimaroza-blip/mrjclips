const form = document.getElementById('projectForm');
const urlInput = document.getElementById('videoUrl');
const fileInput = document.getElementById('videoFile');
const message = document.getElementById('formMessage');
const projectList = document.getElementById('projectList');
const projectCount = document.getElementById('projectCount');
const projectLabel = document.getElementById('projectLabel');
let projects = [];

document.getElementById('menuButton').addEventListener('click', () => {
  document.getElementById('sidebar').classList.toggle('open');
});

fileInput.addEventListener('change', () => {
  if (fileInput.files[0]) {
    message.textContent = `Selected: ${fileInput.files[0].name}. This starter does not upload or process files yet.`;
  }
});

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const url = urlInput.value.trim();
  const file = fileInput.files[0];
  if (!url && !file) {
    message.textContent = 'Please paste a video link or choose a video file first.';
    message.style.color = '#ffb3b3';
    return;
  }
  if (url && !/^https?:\/\//i.test(url)) {
    message.textContent = 'Please enter a valid link beginning with https://';
    message.style.color = '#ffb3b3';
    return;
  }

  const project = {
    title: file ? file.name : new URL(url).hostname,
    source: file ? 'Uploaded file selected' : url,
    style: document.getElementById('clipStyle').value,
    count: document.getElementById('clipCount').value,
    date: new Date().toLocaleDateString()
  };
  projects.unshift(project);
  renderProjects();
  message.textContent = 'Project saved in this browser preview. AI processing will be connected in a later step.';
  message.style.color = '#a9e5c9';
  urlInput.value = '';
  fileInput.value = '';
});

function renderProjects() {
  projectCount.textContent = projects.length;
  projectLabel.textContent = `${projects.length} project${projects.length === 1 ? '' : 's'}`;
  projectList.className = '';
  projectList.innerHTML = '';
  projects.forEach((project) => {
    const item = document.createElement('div');
    item.className = 'project-item';
    const info = document.createElement('div');
    const title = document.createElement('b');
    title.textContent = project.title;
    const details = document.createElement('small');
    details.textContent = `${project.style} · ${project.count} clip ideas · ${project.date}`;
    info.append(title, details);
    const status = document.createElement('span');
    status.className = 'project-status';
    status.textContent = 'Setup preview';
    item.append(info, status);
    projectList.append(item);
  });
}
