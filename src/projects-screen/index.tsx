import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, FormGroup, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../state';
import {
  IGetAllProjectsActionCreator,
  getAllProjects,
  goToAnomaliesScreen,
  IGoToAnomaliesScreenActionCreator,
  showProjectProjectDefinitionModalToAdd,
  IShowProjectDefintionModalToAddActionCreator,
  IDeleteProjectActionCreator,
  deleteProject,
  IEditProjectActionCreator,
} from './action-creators';
import { ProjectComponent } from './project';
import { ProjectDefinitionModal } from './controls/project-definition-modal';
import { GeneralMessageModalContainer } from '../components/modal';
import { IProject } from '../models';

interface IProjectComponentProps {
  projects: IProject[];
}

interface IProjectComponentActionCreators {
  goToAnomaliesScreen: IGoToAnomaliesScreenActionCreator;
  getAllProjects: IGetAllProjectsActionCreator;
  showProjectProjectDefinitionModalToAdd: IShowProjectDefintionModalToAddActionCreator;
  deleteProject: IDeleteProjectActionCreator;
  editProject: IEditProjectActionCreator;
}

class ProjectsComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators> {
  constructor(props: IProjectComponentProps & IProjectComponentActionCreators) {
    super(props);
  }

  public componentDidMount() {
    this.props.getAllProjects();
  }

  public render() {
    return <>
      <GeneralMessageModalContainer />
      <div className='container'>
        <Form horizontal>
          <FormGroup>
            <ListGroup>
              {_.map(this.props.projects, (project: IProject, index) => {
                return <ProjectComponent
                  key={index}
                  project={project}
                  goToProjectAnomalies={() => {
                    this.props.goToAnomaliesScreen(_.find(this.props.projects, (proj) => proj.id === project.id));
                  }}
                  deleteProject={(projectId: string) => {
                    this.props.deleteProject(projectId);
                  }}
                  editProject={(projectArg: IProject) => {
                    // TODO: call a different action here !
                  }} />;
              })}
            </ListGroup>
          </FormGroup>
          <FormGroup>
            <Button id='btnAddProject' bsStyle='primary' onClick={() => this.props.showProjectProjectDefinitionModalToAdd()}>Add Project</Button>
          </FormGroup>
        </Form>
        <ProjectDefinitionModal></ProjectDefinitionModal>
      </div>
    </>;
  }

}

function mapStateToProps(state: IState) {
  return {
    projects: state.projectsScreen.projects,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    goToAnomaliesScreen,
    getAllProjects,
    showProjectProjectDefinitionModalToAdd,
    deleteProject,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProjectsComponent);