let isScrollBlocked = false;
let originalScrollPosition = 0;

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

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "enableScrollBlocking") {
    blockScrolling();
    observePageChanges();
  } else if (message.action === "disableScrollBlocking") {
    unblockScrolling();
  }
});

// Initial check
if (window.location.href.includes("youtube.com/shorts")) {
  blockScrolling();
  observePageChanges();
}
