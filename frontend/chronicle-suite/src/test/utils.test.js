import { utils } from './../_helpers/utils';
import * as constants from './../constants';
import {expect} from "chai";

const assert = require(constants.CHAI_IMPORT).assert;

// Testing functions in utils.js
describe('utils', function () {
    it('testing getDateAndTimeFromISOTimestamp_0', function () {
        let r = utils.getDateAndTimeFromISOTimestamp(constants.ISO_TIMESTAMP_0);
        expect(r).to.eql(constants.ISO_DATE_TIME_STR_0);
    });
});