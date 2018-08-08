import * as React from 'react';
import { Col, FormControl, FormGroup, ListGroupItem, Button } from 'react-bootstrap';
import { IProject } from '../models';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IProjectComponentActionCreators {
  goToProjectAnomalies: () => any;
  deleteProject: (projectId: string) => any;
  editProject: (project: IProject) => any;
}

interface IProjectComponentProps {
  project: IProject;
}

export class ProjectComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators, IProject> {
  public render() {
    return <ListGroupItem>
      <div>
          <Button id='btnDeleteProject' bsStyle='link' onClick={() => { this.props.goToProjectAnomalies(); }}>
            <FontAwesomeIcon icon={['fal', 'edit']}/> <strong>{this.props.project.projectName}</strong>
          </Button>
          <div className='pull-right'>
            <Button id='btnEditProject' bsStyle='default' onClick={() => {
              this.props.editProject(this.props.project);
            }}>
              <FontAwesomeIcon icon={['fal', 'cog']}/> Settings
            </Button>
            <Button id='btnDeleteProject' bsStyle='link' onClick={() => {
              this.props.deleteProject(this.props.project.id);
            }}>
              <FontAwesomeIcon icon={['fal', 'trash-alt']}/> Delete
            </Button>
          </div>
      </div>
    </ListGroupItem>;
  }
}