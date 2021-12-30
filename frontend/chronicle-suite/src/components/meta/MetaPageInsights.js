import { useEffect } from 'react';
import './../../App.css'
import { facebookAccountService } from './../../_services/facebook.account.service';
import * as constants from './../../constants'

function MetaPageInsights() {

  useEffect(() => {
    async function fetchPageInsights() {
      await facebookAccountService.getPageInsights(constants.FLEXCEL_PAGE_NAME);
    }
    fetchPageInsights();
  }, [])

  return (
    <div className="col-md-6 offset-md-3 mt-5 text-center">
        <h1>Flexcel Page Insights</h1>
    </div>
  );
}

export default MetaPageInsights;
