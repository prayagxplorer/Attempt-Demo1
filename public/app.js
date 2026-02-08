const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");
const healthStatus = document.getElementById("health-status");
const openBriefButton = document.getElementById("open-brief");
const viewDashboardButton = document.getElementById("view-dashboard");

const updateHealth = async () => {
  try {
    const response = await fetch("/api/health");
    if (!response.ok) {
      throw new Error("Health check failed");
    }
    const data = await response.json();
    healthStatus.textContent = `Online · ${new Date(data.time).toLocaleTimeString()}`;
  } catch (error) {
    healthStatus.textContent = "Offline";
  }
};

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  statusEl.textContent = "Sending your details...";

  const formData = new FormData(form);
  const payload = Object.fromEntries(formData.entries());

  try {
    const response = await fetch("/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || "Something went wrong.");
    }

    form.reset();
    statusEl.textContent = "Thanks! We'll be in touch within 24 hours.";
  } catch (error) {
    statusEl.textContent = error.message;
  }
});

openBriefButton.addEventListener("click", () => {
  document.getElementById("contact").scrollIntoView({ behavior: "smooth" });
});

viewDashboardButton.addEventListener("click", () => {
  window.alert("Live status is synced from the backend health endpoint.");
});

updateHealth();
setInterval(updateHealth, 30000);
