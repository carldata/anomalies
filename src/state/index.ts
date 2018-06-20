import { IGeneralMessageModalState } from '../components/modal';
import { IAnomaliesScreenState } from '../anomalies-screen/models/anomalies-screen-state';
import { IProjectsScreenState } from '../projects-screen/models/projects-screen-state';

export interface IState {
  projectsScreen: IProjectsScreenState;
  anomaliesScreen: IAnomaliesScreenState;
  modalState: IGeneralMessageModalState;
}