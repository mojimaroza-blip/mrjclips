
const form = document.getElementById("projectForm");
const urlInput = document.getElementById("videoUrl");
const fileInput = document.getElementById("videoFile");
const message = document.getElementById("formMessage");
const projectList = document.getElementById("projectList");
const projectCount = document.getElementById("projectCount");
const projectLabel = document.getElementById("projectLabel");

let projects = [];

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

if (menuButton && sidebar) {
  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

if (fileInput) {
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) {
      message.textContent =
        "Selected: " + fileInput.files[0].name;
      message.style.color = "#a9e5c9";
    }
  });
}

if (form) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const url = urlInput.value.trim();
    const file = fileInput.files[0];

    if (!url && !file) {
      showMessage("Please choose a video or paste a link.", false);
      return;
    }

    if (url && !/^https?:\/\//i.test(url)) {
      showMessage("Please enter a valid video link.", false);
      return;
    }

    if (file && !file.type.startsWith("video/")) {
      showMessage("Please select a valid video file.", false);
      return;
    }

    const project = {
      id: Date.now(),
      title: file ? file.name : getVideoName(url),
      source: file ? "Uploaded video" : url,
      style: document.getElementById("clipStyle")?.value || "Funny moments",
      count: Number(document.getElementById("clipCount")?.value || 5),
      minDuration: 30,
      maxDuration: 60,
      status: "Waiting for AI connection",
      date: new Date().toLocaleString()
    };

    projects.unshift(project);
    renderProjects();

    showMessage(
      "Project created! Your 30–60 second clipping settings have been saved. The AI processing engine still needs to be connected.",
      true
    );

    urlInput.value = "";
    fileInput.value = "";
  });
}

function getVideoName(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return "Video project";
  }
}

function showMessage(text, success) {
  message.textContent = text;
  message.style.color = success ? "#a9e5c9" : "#ffb3b3";
}

function renderProjects() {
  projectCount.textContent = projects.length;

  projectLabel.textContent =
    projects.length + (projects.length === 1 ? " project" : " projects");

  projectList.innerHTML = "";

  projects.forEach((project) => {
    const item = document.createElement("div");
    item.className = "project-item";

    const info = document.createElement("div");

    const title = document.createElement("b");
    title.textContent = project.title;

    const details = document.createElement("small");
    details.textContent =
      project.style +
      " · " + project.count + " clips" +
      " · 30–60 seconds" +
      " · " + project.date;

    info.append(title, details);

    const status = document.createElement("span");
    status.className = "project-status";
    status.textContent = project.status;

    item.append(info, status);
    projectList.append(item);
  });
}
