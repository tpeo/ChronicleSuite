import './App.css';
import { facebookAccountService } from './_services/facebook.account.service';


function App() {
  return (
    <div className="col-md-6 offset-md-3 mt-5 text-center">
      <div className="card">
        <h4 className="card-header">React - Facebook Login Example</h4>
        <div className="card-body">
          <button className="btn btn-facebook" onClick={facebookAccountService.login}>
            <i className="fa fa-facebook mr-1"></i>
            Login with Facebook
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
