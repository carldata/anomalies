import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, FormGroup, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../state';
import { projectScreenActionCreators } from './action-creators';
import { ProjectComponent } from './project';
import { IProject } from './state';
import { AddProjectModal, IModalProject } from './controls/add-project-modal';

interface IProjectComponentProps {
  projects: IProject[];
}

interface IProjectComponentActionCreators {
  goToAnomaliesScreen: (name: string) => any;
  getAllProjectsAsyncCall: () => any;
  addProjectStart: (project: IModalProject) => any;
}

interface IProjectComponentState{
  showModal: boolean;
}

class ProjectsComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators, IProjectComponentState> {
  constructor(props: IProjectComponentProps & IProjectComponentActionCreators){
    super(props);

    this.state = { showModal: false }

    this.showAddProjectModal.bind(this);
  }
  
  showAddProjectModal(){
    this.setState({ showModal: true});
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
                startDate={el.startDate}
                endDate={el.endDate}
                splitDate={el.splitDate}
                goToProjectAnomalies={() => { this.props.goToAnomaliesScreen(el.name); }} />;
            })}
          </ListGroup>
        </FormGroup>
        <FormGroup> 
          <Button id='btnAddProject' bsStyle='primary' onClick={() => this.showAddProjectModal()}>Add Project</Button>
        </FormGroup>
      </Form>
      <AddProjectModal id='testid' name='name' site='site' raw='raw' final='final' showModal={this.state.showModal} addProject={(e) => this.props.addProjectStart(e)}>
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