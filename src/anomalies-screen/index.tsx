import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { Button } from 'react-bootstrap'
import { IState } from '../state'
import { anomaliesScreenActionCreators } from './action-creators'

interface IAnomaliesComponentProps {
  anotherDummyText: string
}

interface IAnomaliesComponentActionCreators {
  goToProjectsScreen: () => any
}

class AnomaliesComponent extends React.Component<IAnomaliesComponentProps & IAnomaliesComponentActionCreators>{
  render() {
    return <div>
      <div> {this.props.anotherDummyText} </div>
      <Button bsStyle='danger' onClick={() => this.props.goToProjectsScreen()} >Go back to project screen</Button>
    </div>
  }
}

function mapStateToProps(state: IState) {
  return {
    anotherDummyText: state.anomaliesScreen.anotherDummyText
  }
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    goToProjectsScreen: anomaliesScreenActionCreators.goToProjectsScreen
  }, dispatch)
}

export default connect(mapStateToProps, matchDispatchToProps)(AnomaliesComponent)