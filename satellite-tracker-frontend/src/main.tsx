
import ReactDOM from "react-dom/client";

import App from "./App";

import "cesium/Build/Cesium/Widgets/widgets.css";
import "./index.css";


window.CESIUM_BASE_URL = "/cesium";


ReactDOM.createRoot(
  document.getElementById("root")!
).render(

    <App />
  
);
