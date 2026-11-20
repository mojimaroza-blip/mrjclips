
const form = document.getElementById("projectForm");
const urlInput = document.getElementById("videoUrl");
const fileInput = document.getElementById("videoFile");
const message = document.getElementById("formMessage");
const projectList = document.getElementById("projectList");
const projectCount = document.getElementById("projectCount");
const projectLabel = document.getElementById("projectLabel");

const API_URL =
  "https://mojimaro-ai-engin.mojimaroza.workers.dev";

let projects = [];

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

if (menuButton && sidebar) {
  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

function showMessage(text, success = false) {
  message.textContent = text;
  message.style.color = success ? "#a9e5c9" : "#ffb3b3";
}

if (fileInput) {
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) {
      showMessage(
        "Selected: " + fileInput.files[0].name +
        ". Link processing is being connected first.",
        true
      );
    }
  });
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const url = urlInput.value.trim();
  const file = fileInput.files[0];

  if (file) {
    showMessage(
      "Video upload processing is not connected yet. Please test with a supported video link."
    );
    return;
  }

  if (!url) {
    showMessage("Please paste a video link.");
    return;
  }

  let clipCount = Number(
    document.getElementById("clipCount")?.value || 5
  );

  const clipStyle =
    document.getElementById("clipStyle")?.value ||
    "Funny moments";

  const project = {
    title: "Video clipping project",
    source: url,
    style: clipStyle,
    count: clipCount,
    minDuration: 30,
    maxDuration: 60,
    date: new Date().toLocaleString(),
    status: "Connecting"
  };

  projects.unshift(project);
  renderProjects();

  const button = form.querySelector(
    'button[type="submit"], input[type="submit"]'
  );

  if (button) button.disabled = true;

  showMessage("Connecting to Mojimaro AI engine...", true);

  try {
    const result = await fetch(API_URL + "/api/clip", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        videoUrl: url,
        clipStyle: clipStyle,
        clipCount: clipCount,
        minDuration: 30,
        maxDuration: 60
      })
    });

    const data = await result.json();

    if (data.status === "processor_not_connected") {
      project.status = "Processor not connected";
      renderProjects();

      showMessage(
        "Mojimaro received your link successfully! The actual video processing engine still needs to be installed.",
        true
      );
    } else if (data.success) {
      project.status = "Processing";
      renderProjects();
      showMessage(data.message || "Request accepted.", true);
    } else {
      project.status = "Failed";
      renderProjects();
      showMessage(data.error || "Unable to process this link.");
    }

  } catch (error) {
    project.status = "Connection error";
    renderProjects();

    showMessage(
      "Could not connect to Mojimaro. Check your internet connection and try again."
    );
  } finally {
    if (button) button.disabled = false;
  }
});

function renderProjects() {
  projectCount.textContent = projects.length;

  projectLabel.textContent =
    projects.length +
    (projects.length === 1 ? " project" : " projects");

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
