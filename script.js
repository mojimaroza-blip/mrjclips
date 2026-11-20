
const form = document.getElementById("projectForm");
const urlInput = document.getElementById("videoUrl");
const fileInput = document.getElementById("videoFile");
const message = document.getElementById("formMessage");
const projectList = document.getElementById("projectList");
const projectCount = document.getElementById("projectCount");
const projectLabel = document.getElementById("projectLabel");

const API_URL = "https://mojimaro-ai-engin.mojimaroza.workers.dev";

let projects = [];

const menuButton = document.getElementById("menuButton");
const sidebar = document.getElementById("sidebar");

if (menuButton && sidebar) {
  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });
}

function showMessage(text, success = false) {
  if (!message) return;
  message.textContent = text;
  message.style.color = success ? "#a9e5c9" : "#ffb3b3";
}

if (fileInput) {
  fileInput.addEventListener("change", () => {
    if (fileInput.files[0]) {
      showMessage(
        "Selected: " + fileInput.files[0].name +
        ". File processing is not connected yet.",
        true
      );
    }
  });
}

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const url = urlInput?.value.trim();
    const file = fileInput?.files[0];

    if (file) {
      showMessage("Video file processing is not connected yet.");
      return;
    }

    if (!url) {
      showMessage("Please paste a video link.");
      return;
    }

    try {
      const parsedUrl = new URL(url);

      if (parsedUrl.protocol !== "https:") {
        showMessage("Please enter a secure HTTPS video link.");
        return;
      }
    } catch {
      showMessage("Please enter a valid video link.");
      return;
    }

    const clipCount = Number(
      document.getElementById("clipCount")?.value || 5
    );

    const clipStyle =
      document.getElementById("clipStyle")?.value || "Funny moments";

    const project = {
      title: "Video clipping project",
      source: url,
      style: clipStyle,
      count: clipCount,
      date: new Date().toLocaleString(),
      status: "Connecting"
    };

    projects.unshift(project);
    renderProjects();

    const button = form.querySelector('button[type="submit"]');

    if (button) button.disabled = true;

    showMessage("Connecting to Mojimaro AI engine...", true);

    try {
      const response = await fetch(API_URL + "/api/clip", {
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

      const data = await response.json();

      console.log("Mojimaro HTTP status:", response.status);
      console.log("Mojimaro response:", data);

      if (data.status === "processor_not_connected") {
        project.status = "Processor not connected";
        showMessage(
          "Mojimaro received your link! The actual AI video processor still needs to be connected.",
          true
        );
      } else if (response.ok && data.success) {
        project.status = "Request accepted";
        showMessage(data.message || "Request accepted.", true);
      } else {
        project.status = "Request error";
        showMessage(
          "Mojimaro response: " +
          (data.error || data.message || "Unknown error") +
          " (HTTP " + response.status + ")"
        );
      }

    } catch (error) {
      console.error("Mojimaro connection error:", error);

      project.status = "Connection error";

      showMessage(
        "Connection failed: " + error.message +
        ". Please check the browser Console for details."
      );

    } finally {
      renderProjects();
      if (button) button.disabled = false;
    }
  });
}

function renderProjects() {
  if (!projectList || !projectCount || !projectLabel) return;

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
      project.style + " · " +
      project.count + " clips · " +
      project.date;

    info.append(title, details);

    const status = document.createElement("span");
    status.className = "project-status";
    status.textContent = project.status;

    item.append(info, status);
    projectList.append(item);
  });
}
