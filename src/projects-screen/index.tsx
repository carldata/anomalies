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
import { ISite, IChannel } from '../model';

interface IProjectComponentProps {
  projects: IProject[];
  sites: ISite[];
  channels: IChannel[];
}

interface IProjectComponentActionCreators {
  goToAnomaliesScreen: (project: IProject) => any;
  getAllProjectsAsyncCall: () => any;
  addProjectStart: (project: IProject) => any;
  getSites: (db: string) => any;
  getChannels: (siteId: string) => any;
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
          <Button id='btnAddProject' bsStyle='primary' onClick={() => this.addProject()}>Add Project</Button>
        </FormGroup>
      </Form>
      <AddProjectModal
        id=''
        name=''
        site=''
        raw=''
        final=''
        sites={this.props.sites}
        channels={this.props.channels}
        showModal={this.state.showModal}
        addProject={(e) => this.props.addProjectStart(e)}
        hideModal={() => this.showAddProjectModal(false)}>
      </AddProjectModal>
    </div>;
  }

  private showAddProjectModal(show: boolean) {
    this.setState({ showModal: show });
  }

  private addProject() {
    this.props.getSites('FlowMetrix');
    this.showAddProjectModal(true);
  }

}

function mapStateToProps(state: IState) {
  return {
    projects: state.projectsScreen.projects,
    sites: state.projectsScreen.sites,
    channels: state.projectsScreen.channels,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    goToAnomaliesScreen: projectScreenActionCreators.goToAnomaliesScreen,
    getAllProjectsAsyncCall: projectScreenActionCreators.getAllProjectsAsyncCall,
    addProjectStart: projectScreenActionCreators.addProjectStart,
    getSites: projectScreenActionCreators.getSites,
    getChannels: projectScreenActionCreators.getChannels,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProjectsComponent);