// utils.js  
// Contains helper functions for 
// functions across the project

import * as constants from './../constants'

export const utils = {
    getPageIdAndAccessToken
}

// Get page id from user accounts data
function getPageIdAndAccessToken(accountsData, pageName) {
    for (var i = 0; i < accountsData.length; i++) {
        var curPageData = accountsData[i];
        if (curPageData.name == pageName) 
            return [curPageData.id, curPageData.access_token]
    }
    return constants.PAGE_NOT_FOUND 
}