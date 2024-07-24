import firebase from "firebase/app";
import "firebase/messaging";
import store from "./src/store/store";
let getConfig = null;
function render() {
  getConfig =
    store.getState().websiteSetup?.websiteSetup?.payload?.firebase_info;
}
render();
store.subscribe(() => {
  render();
});
const firebaseCloudMessaging = {
  //initializing firebase app
  init: async function () {
    if (!firebase.apps.length && getConfig) {
      firebase.initializeApp({
        apiKey: getConfig.apiKey,
        authDomain: getConfig.authDomain,
        projectId: getConfig.projectId,
        storageBucket: getConfig.storageBucket,
        messagingSenderId: getConfig.messagingSenderId,
        appId: getConfig.appId,
        measurementId: getConfig.measurementId,
      });

      try {
        const messaging = firebase.messaging();
        //requesting notification permission from browser
        const status = await Notification.requestPermission();
        if (status && status === "granted") {
          //getting token from FCM
          const fcm_token = await messaging.getToken({
            vapidKey: getConfig.certificates,
          });

          if (fcm_token) {
            return fcm_token;
          }
        }
      } catch (error) {
        console.error(error);
        return null;
      }
    }
  },
};

export { firebaseCloudMessaging };
