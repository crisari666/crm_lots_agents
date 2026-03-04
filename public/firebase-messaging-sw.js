importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

fetch("/firebase-config.json")
.then((response) => {
  return response.json();
})
.then((jsContent) => {
  const config = eval(jsContent);
  console.log({config});
  
  firebase.initializeApp(config.firebaseConfig);
  //firebase.messaging();  
  firebase.messaging().onBackgroundMessage((payload) => {
      console.log('Received background message: ', payload);
      self.registration.showNotification(payload.notification.title, {
          body: payload.notification.body,
          icon: '/firebase-logo.png'
      });
  });
  
  self.addEventListener("push", function (event) {
    console.log("Push event received:", event);
    const data = event.data ? event.data.json() : {};
  
    const options = {
        body: data.body || "Default body text",
        icon: data.icon || "/default-icon.png",
        badge: data.badge || "/default-badge.png",
        tag: data.tag || "default-tag",
        data: { url: data.click_action || "/" } // Save URL for click action
    };
  
    event.waitUntil(self.registration.showNotification(data.title || "Default Title", options));
  });
  
  self.addEventListener("pushsubscriptionchange", function (event) {
    console.log("Push subscription changed:", event);
    event.waitUntil(
        self.registration.pushManager.subscribe({ userVisibleOnly: true }).then(function (newSubscription) {
            // Handle subscription update (send to server)
            console.log("New subscription:", newSubscription);
        })
    );
  });
  
  self.addEventListener("notificationclick", function (event) {
    console.log("Notification click received:", event);
    event.notification.close(); // Close the notification
    event.waitUntil(
        clients.matchAll({ type: "window", includeUncontrolled: true }).then(function (clientList) {
            if (clientList.length > 0) {
                return clientList[0].focus(); // Focus existing tab
            } else {
                return clients.openWindow(event.notification.data.url || "/"); // Open new window if no existing tab
            }
        })
    );
  });
})
.catch((error) => {
  console.error("Error initializing Firebase in service worker:", error);
});



