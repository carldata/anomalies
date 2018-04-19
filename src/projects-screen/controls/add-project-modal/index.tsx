import * as React from 'react';
import { Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { AnyAction, bindActionCreators, Dispatch } from "redux";
import { projectScreenActionCreators } from '../../action-creators';
import * as _ from 'lodash';

export interface IModalProject {
  name: string;
  site: string;
  raw: string;
  final: string;
}

interface IAddProjectModalProps {
  showModal: boolean;
  project: IModalProject;
}

interface IAddProjectModalActionCreators {
  addProject: (project: IModalProject) => any;
}

interface IAddProjectModalState {
  project: IModalProject;
}

class AddProjectModalComponent extends React.Component<IAddProjectModalProps & IAddProjectModalActionCreators, IAddProjectModalState> {

  componentWillReceiveProps(nextProps: IAddProjectModalProps) {
    if (!_.isEqual(nextProps.project, this.state.project)) {
      this.setState({ project: nextProps.project })
    }
  }

  render() {
    return <div> </div>
  }
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    addProject: projectScreenActionCreators.addProjectStart
  }, dispatch);
}

export const AddProjectModal = connect(null, matchDispatchToProps)(AddProjectModalComponent);
