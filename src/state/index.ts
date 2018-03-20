import { IProjectsScreenState } from '../projects-screen/state'
import { IAnomaliesScreenState } from '../anomalies-screen/state'

export interface IState {
  projectsScreen: IProjectsScreenState
  anomaliesScreen: IAnomaliesScreenState
}