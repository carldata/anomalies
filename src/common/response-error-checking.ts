import * as _ from 'lodash';
export const checkResponseForError = (response: string) => {
    const arr = _.split(response, '\n');
    if (_.trim(_.head(arr)) === 'type:error') {
        throw _.last(arr);
    }
    return response;
};