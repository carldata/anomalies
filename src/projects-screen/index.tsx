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
  test: () => any,
  goToAnomaliesScreen: () => any,
  startTestAsyncCall: () => any
}

class ProjectsComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators> {
  render() {
    return <div>
      <div>{this.props.dummyText}</div>
      <Button onClick={() => this.props.test() } > Test changing initial text </Button>
      <Button bsStyle='primary' onClick={() => this.props.startTestAsyncCall()} > Test Async Call </Button>
      <Button bsStyle='success' onClick={() => this.props.goToAnomaliesScreen() } >Go to Anomalies screen</Button>
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
    goToAnomaliesScreen: projectScreenActionCreators.goToAnomaliesScreen,
    startTestAsyncCall: projectScreenActionCreators.startTestAsyncCall
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(ProjectsComponent)