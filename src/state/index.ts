import { IAnomaliesScreenState } from '../anomalies-screen/state';
import { IModalState } from '../components/modal';
import { IProjectsScreenState } from '../models';

export interface IState {
  projectsScreen: IProjectsScreenState;
  anomaliesScreen: IAnomaliesScreenState;
  modalState: IModalState;
}