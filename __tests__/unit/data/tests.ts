import { gridDataSchema } from 'src/schemas/data';

describe('test data', () => {
    it('test #1', () => {
        expect(0.1+0.2).not.toBe(0.3);
      });
});

describe('data schema works properly', () => {
    it('null data', () => expect(gridDataSchema.isValidSync(null)).toEqual(false));
});