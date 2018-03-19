import * as React from 'react'
import { connect } from 'react-redux'
import { bindActionCreators, Dispatch } from 'redux'
import { IState } from '../state'


//TODO properties & action creators and render
class ProjectsComponent extends React.Component {
  render() {
    return <div>This will be projects component</div>
  }
}

//TODO add Props
function mapStateToProps(state : IState) {
  return {}
}

//TODO add action creators
function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({},dispatch)
}

//TODO export project with props and action creators connected
// export const Projects = connect(mapStateToProps,matchDispatchToProps)(ProjectsComponent)
export const Projects = ProjectsComponent