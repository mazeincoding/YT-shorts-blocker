document.addEventListener("DOMContentLoaded", () => {
  chrome.storage.sync.get(
    {
      blockShorts: true,
      hideRecommended: false,
      removeShorts: false,
      hideComments: false,
    },
    (settings) => {
      document.getElementById("blockShorts").checked = settings.blockShorts;
      document.getElementById("hideRecommended").checked =
        settings.hideRecommended;
      document.getElementById("removeShorts").checked = settings.removeShorts;
      document.getElementById("hideComments").checked = settings.hideComments;
    }
  );

  // Add feedback button handler
  document.getElementById("feedbackButton").addEventListener("click", () => {
    const feedbackUrl =
      "https://github.com/mazeincoding/YT-shorts-blocker/issues/new";
    chrome.tabs.create({ url: feedbackUrl });
  });
});

const inputs = [
  "blockShorts",
  "hideRecommended",
  "removeShorts",
  "hideComments",
];
inputs.forEach((id) => {
  document.getElementById(id).addEventListener("change", (e) => {
    const setting = {};
    setting[id] = e.target.checked;
    chrome.storage.sync.set(setting, () => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: "settingsUpdated",
          settings: { [id]: e.target.checked },
        });
      });
    });
  });
});
