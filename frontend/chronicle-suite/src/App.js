import { BrowserRouter, Route, Routes } from 'react-router-dom';
import './App.css';
import Meta from './components/meta/Meta';
import TwitterLogin from './components/twitter/TwitterLogin';

function App() {
	return <TwitterLogin />;
	// <BrowserRouter>
	// 	<Routes>
	// 		<Route path='/' element={<TwitterLogin />} />
	// 		<Route path='/meta' element={<Meta />} />
	// 	</Routes>
	// </BrowserRouter>;
}

export default App;
