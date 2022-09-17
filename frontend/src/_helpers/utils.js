// utils.js
// Contains helper functions for
// modules across the project

import * as constants from "./constants";

export const utils = {
	getPageIdAndAccessToken,
	getDateAndTimeFromISOTimestamp,
};

// Get page id and page access token from user accounts
// data for the given pageName
function getPageIdAndAccessToken(accountsData, pageName) {
	for (var i = 0; i < accountsData.length; i++) {
		var curPageData = accountsData[i];
		if (curPageData.name === pageName) return [curPageData.id, curPageData.access_token];
	}
	return constants.PAGE_NOT_FOUND;
}

// Gets user readbale string format of date
// and time from ISO date format (2019-07-16T15:21:56+0000)
function getDateAndTimeFromISOTimestamp(isoTimestamp) {
	var d = new Date(isoTimestamp);
	var dateStr = d.getFullYear() + constants.HYPHEN + (d.getMonth() + 1) + constants.HYPHEN + d.getDate();
	var timeStr = d.toLocaleString("en-US", {
		hour: "numeric",
		minute: "numeric",
		hour12: true,
	});
	return [dateStr, timeStr];
}
