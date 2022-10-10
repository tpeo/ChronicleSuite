import { Navigate, Route, Routes } from "react-router-dom";
import DefaultLayout from "../components/layouts/DefaultLayout";
import FullscreenLayout from "../components/layouts/FullscreenLayout";
import Overview from "../components/Overview";
import LoginPage from "../pages/login/LoginPage.js";
import SignupPage from "../pages/signup/SignupPage.js";

function Navigation(props) {
	return (
		<Routes>
			<Route path="/">
				<Route index element={<Navigate to="/login" />}></Route>
				<Route path="login" element={<FullscreenLayout></FullscreenLayout>}>
					<Route index element={<LoginPage />}></Route>
				</Route>
				<Route path="signup" element={<DefaultLayout></DefaultLayout>}>
					<Route index element={<SignupPage />}></Route>
					<Route path="facebook" element={<LoginPage />}></Route>
				</Route>
				<Route path="dashboard" element={<DefaultLayout tabs></DefaultLayout>}>
					<Route index element={<Navigate to="overview" />}></Route>
					<Route path="overview" element={<Overview />}></Route>
					<Route path="facebook" element={<div>facebook</div>}></Route>
					<Route path="instagram" element={<div>instagram</div>}></Route>
					<Route path="twitter" element={<div>twitter</div>}></Route>
				</Route>
			</Route>
		</Routes>
	);
}

export default Navigation;
