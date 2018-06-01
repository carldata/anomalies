import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, FormGroup, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../state';
import { projectScreenActionCreators } from './action-creators';
import { ProjectComponent } from './project';
import { IProject } from './state';
import { AddProjectModal } from './controls/add-project-modal';

interface IProjectComponentProps {
  projects: IProject[];
}

interface IProjectComponentActionCreators {
  goToAnomaliesScreen: (project: IProject) => any;
  getAllProjectsAsyncCall: () => any;
  addProjectStart: (project: IProject) => any;
}

interface IProjectComponentState {
  showModal: boolean;
}

class ProjectsComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators, IProjectComponentState> {
  constructor(props: IProjectComponentProps & IProjectComponentActionCreators) {
    super(props);

    this.state = { showModal: false }
    this.showAddProjectModal.bind(this);
  }

  showAddProjectModal(show: boolean) {
    this.setState({ showModal: show });
  }

  public componentDidMount() {
    this.props.getAllProjectsAsyncCall();
  }

  public render() {
    return <div className='container'>
      <Form horizontal>
        <FormGroup>
          <ListGroup>
            {_.map(this.props.projects, (el, index) => {
              return <ProjectComponent key={index}
                id={el.id}
                name={el.name}
                site={el.site}
                raw={el.raw}
                final={el.final}
                goToProjectAnomalies={() => { this.props.goToAnomaliesScreen(_.find(this.props.projects, (proj) => proj.id === el.id)); }} />;
            })}
          </ListGroup>
        </FormGroup>
        <FormGroup>
          <Button id='btnAddProject' bsStyle='primary' onClick={() => this.showAddProjectModal(true)}>Add Project</Button>
        </FormGroup>
      </Form>
      <AddProjectModal id='' name='' site='' raw='' final='' showModal={this.state.showModal} addProject={(e) => this.props.addProjectStart(e)}
        hideModal={() => this.showAddProjectModal(false)}>
      </AddProjectModal>
    </div>;
  }
}

function mapStateToProps(state: IState) {
  return {
    projects: state.projectsScreen.projects
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    goToAnomaliesScreen: projectScreenActionCreators.goToAnomaliesScreen,
    getAllProjectsAsyncCall: projectScreenActionCreators.getAllProjectsAsyncCall,
    addProjectStart: projectScreenActionCreators.addProjectStart
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProjectsComponent);