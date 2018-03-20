import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Button } from 'react-bootstrap'
import { IState } from '../state'
import { projectScreenActionCreators } from './action-creators'


interface IProjectComponentProps {
  dummyText: string
}

interface IProjectComponentActionCreators {
  test: () => (dispatch: Dispatch<{}>) => {},
  goToAnomaliesScreen: () => (dispatch: Dispatch<{}>) => {}
}

class ProjectsComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators> {
  render() {
    return <div>
      <div>{this.props.dummyText}</div>
      <Button bsStyle="primary" onClick={() => this.props.test()} >Click me to see magic</Button>
      <Button bsStyle="success" onClick={() => this.props.goToAnomaliesScreen()} >Go to anomalies screen</Button>
    </div>
  }
}

function mapStateToProps(state: IState) {
  return {
    dummyText: state.projectsScreen.dummyText
  }
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    test: projectScreenActionCreators.test,
    goToAnomaliesScreen : projectScreenActionCreators.goToAnomaliesScreen
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(ProjectsComponent)