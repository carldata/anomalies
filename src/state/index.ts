import { IGeneralMessageModalState } from '../components/modal';
import { IAnomaliesScreenState } from '../anomalies-screen/models/anomalies-screen-state';
import { IProjectsScreenState } from '../projects-screen/models/projects-screen-state';
import { IConfigurationState } from '@business-logic/configuration/models/state';

export interface IState {
  configuration: IConfigurationState;
  projectsScreen: IProjectsScreenState;
  anomaliesScreen: IAnomaliesScreenState;
  modalState: IGeneralMessageModalState;
}