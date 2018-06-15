import { gridDataSchema } from '../../../src/schemas/data';
import { IDataGridRow, IDataGridState } from '../../../src/anomalies-screen/controls/data-grid/state';

describe('data schema works properly', () => {
    it('null data', () => expect(gridDataSchema.isValidSync(null)).toEqual(false));
    it('grid row with undefined attributes 1', () => expect((gridDataSchema.isValidSync({
        rows: [
            { date: new Date('2014-11-01'), rawValue: 1, editedValue: 2, fixedValue: 3 },
            { date: undefined, rawValue: 1, editedValue: 2, fixedValue: 3 }
        ],
    } as IDataGridState))).toEqual(false));
    it('grid row with undefined attributes 2', () => expect((gridDataSchema.isValidSync({
        rows: [
            { date: undefined, rawValue: 1, editedValue: 2, fixedValue: 3 },
            { date: new Date('2014-11-01'), rawValue: 1, editedValue: 2, fixedValue: 3 },
        ],
    } as IDataGridState))).toEqual(false));
    it('grid row with properly formed attributes', () => expect((gridDataSchema.isValidSync({
        rows: [
            { date: new Date('2014-11-01'), rawValue: 1, editedValue: 2, fixedValue: 3 },
            { date: new Date('2014-11-02'), rawValue: 1, editedValue: 2, fixedValue: 3 },
        ],
    } as IDataGridState))).toEqual(true));
    it('grid row with same dates', () => expect((gridDataSchema.isValidSync({
        rows: [
            { date: new Date('2014-11-01'), rawValue: 1, editedValue: 2, fixedValue: 3 },
            { date: new Date('2014-11-01'), rawValue: 1, editedValue: 2, fixedValue: 3 },
        ],
    } as IDataGridState))).toEqual(false));
});
