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
  test: () => any;
  goToAnomaliesScreen: (name: string) => any;
  startTestAsyncCall: () => any;
  getAllProjectsAsyncCall: () => any;
}

class ProjectsComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators> {
  public componentDidMount(){
    this.props.getAllProjectsAsyncCall();
  }

  public render() {
    return <div>
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
      <Button onClick={() => this.props.test()} > Test changing initial text </Button>
      <Button bsStyle='primary' onClick={() => this.props.startTestAsyncCall()} > Test Async Call </Button>
    </div>;
  }
}

function mapStateToProps(state: IState) {
  return {
    dummyText: state.projectsScreen.dummyText,
    projects: state.projectsScreen.projects,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    goToAnomaliesScreen: projectScreenActionCreators.goToAnomaliesScreen,
    startTestAsyncCall: projectScreenActionCreators.startTestAsyncCall,
    getAllProjectsAsyncCall: projectScreenActionCreators.getAllProjectsAsyncCall,
    test: projectScreenActionCreators.test
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(ProjectsComponent);