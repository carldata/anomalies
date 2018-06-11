import { IAnomaliesScreenState } from '../anomalies-screen/state';
import { IProjectsScreenState } from '../models/projects-screen-state';
import { IModalState } from '../components/modal';

export interface IState {
  projectsScreen: IProjectsScreenState;
  anomaliesScreen: IAnomaliesScreenState;
  modalState: IModalState;
}