import { IAnomaliesScreenState } from '../anomalies-screen/state';
import { IProjectsScreenState } from '../projects-screen/state';

export interface IState {
  projectsScreen: IProjectsScreenState;
  anomaliesScreen: IAnomaliesScreenState;
}