import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, FormGroup, ListGroup, Navbar } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../state';
import {
  IGetAllProjectsActionCreator,
  getAllProjects,
  goToAnomaliesScreen,
  IGoToAnomaliesScreenActionCreator,
  showProjectDefinitionModalToAdd,
  showProjectDefinitionModalToEdit,
  IDeleteProjectActionCreator,
  deleteProject,
  IShowProjectDefinitionModalToAddActionCreator,
  IShowProjectDefinitionModalToEditActionCreator,
} from './action-creators';
import { ProjectComponent } from './project';
import { ProjectDefinitionModal } from './controls/project-definition-modal';
import { GeneralMessageModalContainer } from '../components/modal';
import { IProject } from '../models';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProjectComponentProps {
  projects: IProject[];
}

interface IProjectComponentActionCreators {
  goToAnomaliesScreen: IGoToAnomaliesScreenActionCreator;
  getAllProjects: IGetAllProjectsActionCreator;
  showProjectDefinitionModalToAdd: IShowProjectDefinitionModalToAddActionCreator;
  showProjectDefinitionModalToEdit: IShowProjectDefinitionModalToEditActionCreator;
  deleteProject: IDeleteProjectActionCreator;
}

class ProjectsComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators> {
  constructor(props: IProjectComponentProps & IProjectComponentActionCreators ) {
    super(props);
  }

  public componentDidMount() {
    this.props.getAllProjects();
  }

  public render() {
    return <>
      <GeneralMessageModalContainer />

      <Navbar>
        <Navbar.Header>
          <Navbar.Brand>
            <div>
              Anomaly Detection
            </div>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>

      <div className='container'>
        <Form>
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
                    this.props.showProjectDefinitionModalToEdit(projectArg);
                  }} />;
              })}
            </ListGroup>
          </FormGroup>
          <FormGroup>
            <Button id='btnAddProject' bsStyle='primary' onClick={() => this.props.showProjectDefinitionModalToAdd()}>
              <FontAwesomeIcon icon={['fal', 'plus-circle']}/> Create New Project
            </Button>
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
    showProjectDefinitionModalToAdd,
    showProjectDefinitionModalToEdit,
    deleteProject,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProjectsComponent);