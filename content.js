let isScrollBlocked = false;
let originalScrollPosition = 0;
let settings = {
  blockShorts: true,
  hideRecommended: false,
  removeShorts: false,
  hideComments: false,
};

// Load settings when content script starts
chrome.storage.sync.get(
  {
    blockShorts: true,
    hideRecommended: false,
    removeShorts: false,
    hideComments: false,
  },
  (savedSettings) => {
    settings = savedSettings;
    applySettings();
  }
);

function preventScroll(e) {
  if (isScrollBlocked) {
    const commentsSection = document.querySelector(
      "#contents.ytd-item-section-renderer"
    );
    if (!commentsSection || !commentsSection.contains(e.target)) {
      e.preventDefault();
      window.scrollTo(0, originalScrollPosition);
    }
  }
}

function preventKeyScroll(e) {
  if (isScrollBlocked && e.key === "ArrowDown") {
    e.preventDefault();
  }
}

function removeNextButton() {
  const nextButton = document.querySelector('button[aria-label="Next video"]');
  if (nextButton) {
    nextButton.remove();
  }
}

function blockScrolling() {
  isScrollBlocked = true;
  originalScrollPosition = window.scrollY;
  document.body.style.overflow = "hidden";
  window.addEventListener("scroll", preventScroll, { passive: false });
  window.addEventListener("wheel", preventScroll, { passive: false });
  window.addEventListener("touchmove", preventScroll, { passive: false });
  window.addEventListener("keydown", preventKeyScroll);
  removeNextButton();

  // Allow scrolling in the comments section
  const commentsSection = document.querySelector(
    "#contents.ytd-item-section-renderer"
  );
  if (commentsSection) {
    commentsSection.style.overflow = "auto";
    commentsSection.style.maxHeight = "80vh"; // Adjust as needed
  }
}

function unblockScrolling() {
  isScrollBlocked = false;
  document.body.style.overflow = "";
  window.removeEventListener("scroll", preventScroll);
  window.removeEventListener("wheel", preventScroll);
  window.removeEventListener("touchmove", preventScroll);
  window.removeEventListener("keydown", preventKeyScroll);

  // Reset comments section style
  const commentsSection = document.querySelector(
    "#contents.ytd-item-section-renderer"
  );
  if (commentsSection) {
    commentsSection.style.overflow = "";
    commentsSection.style.maxHeight = "";
  }
}

function observePageChanges() {
  const observer = new MutationObserver((mutations) => {
    for (let mutation of mutations) {
      if (mutation.type === "childList") {
        const addedNodes = mutation.addedNodes;
        for (let node of addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            if (node.classList.contains("shorts-video-scrollbox")) {
              blockScrolling();
              return;
            }
          }
        }
      }
    }
    removeNextButton();
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function applySettings() {
  // Handle shorts blocking
  if (
    settings.blockShorts &&
    window.location.href.includes("youtube.com/shorts")
  ) {
    blockScrolling();
    observePageChanges();
  } else {
    unblockScrolling();
  }

  // Apply hiding styles based on settings
  const style =
    document.getElementById("yt-blocker-styles") ||
    document.createElement("style");
  style.id = "yt-blocker-styles";

  let css = "";
  if (settings.hideRecommended) {
    css += `
      ytd-browse[page-subtype="home"] #contents.ytd-rich-grid-renderer {
        display: none !important;
      }
    `;
  }

  if (settings.removeShorts) {
    css += `
      /* Hide Shorts button in sidebar */
      a#endpoint[title="Shorts"] {
        display: none !important;
      }

      /* Hide Shorts page content */
      ytd-shorts.ytd-page-manager {
        display: none !important;
      }

      /* Hide Shorts sections on homepage */
      ytd-rich-section-renderer ytd-rich-shelf-renderer[is-shorts] {
        display: none !important;
      }

      /* Hide Shorts sections in search results */
      ytd-reel-shelf-renderer {
        display: none !important;
      }
    `;
  }

  if (settings.hideComments) {
    css += `
      /* Hide comments button */
      #comments-button.button-container.style-scope.ytd-reel-player-overlay-renderer {
        display: none !important;
      }

      /* Hide comments panel */
      #anchored-panel.anchored-panel.style-scope.ytd-shorts {
        display: none !important;
      }
    `;
  }

  style.textContent = css;
  document.head.appendChild(style);
}

// Update the message listener to handle settings changes
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "settingsUpdated") {
    settings = { ...settings, ...message.settings };
    applySettings();
  } else if (message.action === "enableScrollBlocking") {
    if (settings.blockShorts) {
      blockScrolling();
      observePageChanges();
    }
  } else if (message.action === "disableScrollBlocking") {
    unblockScrolling();
  }
});

// Add mutation observer for recommended videos and shorts
const contentObserver = new MutationObserver((mutations) => {
  if (settings.hideRecommended || settings.hideShorts) {
    applySettings();
  }
});

contentObserver.observe(document.body, {
  childList: true,
  subtree: true,
});
