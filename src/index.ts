import "./style.scss";
import App from "./components/app/app";
import { handleLocation, route } from "./components/utils/router";
import { profileLinks, pages } from "./components/header/data/linkArrays";
import { getProducts } from "./sdk/sdk";

function initializeApp(): void {
  App.createView();
  const currentPath = window.location.pathname;
  const currentLink = [...profileLinks, ...pages].find(
    (link) => link.href === currentPath,
  );
  if (currentLink) {
    handleLocation(currentLink.callback);
  } else {
    handleLocation();
  }
}

window.addEventListener("DOMContentLoaded", initializeApp);

declare global {
  interface Window {
    route: (e: MouseEvent) => void;
  }
}

window.route = route;


getProducts().then((res)=>console.log(res.body.results))