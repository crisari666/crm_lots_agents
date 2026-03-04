import React from "react"
import ReactDOM from "react-dom/client"
import { Provider } from "react-redux"
import { store } from "./app/store"
import "./index.css"
import { RouterProvider } from "react-router-dom"
import router from "./app/router"
import { LocalizationProvider } from "@mui/x-date-pickers"
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment"

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((registration) => {
      console.log("Registration successful");

    })
    .catch((error) => {
      console.log("Service worker registration failed");
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  // <React.StrictMode>
    <LocalizationProvider dateAdapter={AdapterMoment}>
      <Provider store={store}>
        <RouterProvider router={router} />
      </Provider>
    </LocalizationProvider>
  // </React.StrictMode>,
)