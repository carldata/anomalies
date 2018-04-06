import * as _ from 'lodash';
import * as React from 'react';
import { Button, Form, FormGroup, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../state';
import { projectScreenActionCreators } from './action-creators';
import { ProjectComponent } from './project';
import { IProject } from './state';

interface IProjectComponentProps {
  dummyText: string;
  projects: IProject[];
}

interface IProjectComponentActionCreators {
  goToAnomaliesScreen: (name: string) => any;
  getAllProjectsAsyncCall: () => any;
}

class ProjectsComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators> {
  public componentDidMount(){
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
      </Form>
      <div>{this.props.dummyText}</div>
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
    getAllProjectsAsyncCall: projectScreenActionCreators.getAllProjectsAsyncCall
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProjectsComponent);