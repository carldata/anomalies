import { ISiteChannelInfo, IProject } from '../models';

// export const anomaliesScreenActionCreators = {
//   getTimeSeries: (projectInfo) => {
//     return { type: anomaliesScreenActionTypes.GET_TIME_SERIES_START, payload: projectInfo };
//   },
//   getChannelsForSite: (siteId: string) => {
//     return { type: anomaliesScreenActionTypes.GET_CHANNELS_FOR_SITE_START, payload: siteId };
//   },
//   addAndPopulateChannel: (siteChannelInfo: ISiteChannelInfo, unixFrom: number, unixTo: number) => {
//     return {
//       type: anomaliesScreenActionTypes.ADD_AND_POPULATE_CHANNEL_START,
//       payload: {
//         siteChannelInfo,
//         unixFrom,
//         unixTo,
//       },
//     };
//   },
//   addEmptyChannel: (siteChannelInfo: ISiteChannelInfo) => {
//     return {
//       type: anomaliesScreenActionTypes.ADD_EMPTY_CHANNEL_START,
//       payload: {
//         siteChannelInfo,
//       },
//     };
//   },
//   goToProjectsScreen: () => {
//     return { type: anomaliesScreenActionTypes.GO_TO_PROJECTS };
//   },
//   copyRawToEdited: () => {
//     return { type: anomaliesScreenActionTypes.COPY_RAW_TO_EDITED };
//   },
//   deleteSupportingChannel: (idx) => {
//     return {
//       type: anomaliesScreenActionTypes.DELETE_SUPPORTING_CHANNEL_START,
//       payload: idx,
//     };
//   },
//   saveProject: (project: IProject) => {
//     return {
//       type: anomaliesScreenActionTypes.SAVE_PROJECT_START,
//       payload: project,
//     };
//   },
//   showAddChannelModal: (mainChartEmpty: boolean) => {
//     return {
//       type: anomaliesScreenActionTypes.SHOW_ADD_CHANNEL_START,
//       payload: mainChartEmpty,
//     };
//   },
//   cancelShowAddChannel: () => {
//     return {
//       type: anomaliesScreenActionTypes.CANCEL_SHOW_ADD_CHANNEL,
//     };
//   },
// };