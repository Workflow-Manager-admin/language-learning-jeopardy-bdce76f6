/* 
  This code is adapted from Create React App's CRA serviceWorkerRegistration.js.
  It registers a service worker for full offline support, using public/service-worker.js.
*/

/**
 * PUBLIC_INTERFACE
 * Registers the service worker if PWA mode is supported.
 */
export function register() {
  if (
    process.env.NODE_ENV === "production" &&
    "serviceWorker" in navigator
  ) {
    window.addEventListener("load", () => {
      const swUrl = `${process.env.PUBLIC_URL}/service-worker.js`;
      navigator.serviceWorker
        .register(swUrl)
        .then((registration) => {
          registration.onupdatefound = () => {
            const installingWorker = registration.installing;
            if (installingWorker) {
              installingWorker.onstatechange = () => {
                if (
                  installingWorker.state === "installed" &&
                  navigator.serviceWorker.controller
                ) {
                  // New content is available; notify user
                  // Optionally, prompt user to update
                  // (Can also show banner here if needed)
                }
              };
            }
          };
        })
        .catch((error) => {
          // Optionally log error
        });
    });
  }
}

export function unregister() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker.ready.then((registration) => {
      registration.unregister();
    });
  }
}
