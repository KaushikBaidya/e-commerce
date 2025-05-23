import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import store from "./store/store";
import { Toaster } from "./components/ui/sonner";
import ScrollToTop from "./ScrollToTop";

createRoot(document.getElementById("root")).render(
	<BrowserRouter>
		<ScrollToTop />
		<Provider store={store}>
			<App />
			<Toaster />
		</Provider>
	</BrowserRouter>
);
