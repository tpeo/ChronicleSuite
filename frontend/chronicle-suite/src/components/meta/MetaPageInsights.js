import { useEffect } from 'react';
import './../../App.css'
import { facebookAccountService } from './../../_services/facebook.account.service';


function MetaPageInsights() {


  useEffect(() => {
    facebookAccountService.getUserPageAccounts()
  }, [])

  return (
    <div className="col-md-6 offset-md-3 mt-5 text-center">
        <h1>Flexcel Page Insights</h1>
    </div>
  );
}

export default MetaPageInsights;
