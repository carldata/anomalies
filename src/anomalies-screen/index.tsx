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
  test: () => (dispatch: Dispatch<{}>) => {},
  goBackToProjectsScreen: () => (dispatch: Dispatch<{}>) => {}
}

class AnomaliesComponent extends React.Component<IAnomaliesComponentProps & IAnomaliesComponentActionCreators>{
  render() {
    return <div>
      <div> {this.props.anotherDummyText} </div>
      <Button bsStyle="primary" onClick={()=>this.props.test()} >Click to change text</Button>
      <Button bsStyle="success" onClick={()=>this.props.goBackToProjectsScreen()}>Click to go to projects screen</Button>
    </div>
  }
}

function mapStateToProps(state: IState){
  return {
    anotherDummyText: state.anomaliesScreen.anotherDummyText
  }
}

function matchDispatchToProps(dispatch: Dispatch<{}>){
  return bindActionCreators({
    test: anomaliesScreenActionCreators.test,
    goBackToProjectsScreen: anomaliesScreenActionCreators.goBackToProjectsScreen 
  },dispatch)
}

export default connect(mapStateToProps,matchDispatchToProps)(AnomaliesComponent)