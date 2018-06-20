import * as _ from 'lodash';
import { object, string, number, date, array } from 'yup';
import { IDataGridRow, IDataGridState } from '../anomalies-screen/controls/data-grid/state';

export const gridDataRowSchema = object({
    date: date().required(),
    rawValue: number().required(),
    editedValue: number().required(),
    fixedValue: number().required(),
});

export const gridDataSchema = object({
    rows: array(gridDataRowSchema)
        .min(1)
        .required(),
}).test('Data integrity OK',
    'Data integrity NOT OK',
    (state: IDataGridState) => {
        let minDate = state.rows[0].date;
        let maxDate = state.rows[state.rows.length - 1].date;
        let returnValue = true;

        if (_.isUndefined(minDate)) {
            returnValue = false;
        }
        if (_.isUndefined(maxDate)) {
            returnValue = false;
        }

        if (+minDate === +maxDate) {
            returnValue = false;
        }

        return returnValue;
    },
);
