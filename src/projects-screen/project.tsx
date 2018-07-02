import * as React from 'react';
import { Col, FormControl, FormGroup, ListGroupItem, Button } from 'react-bootstrap';
import { IProject } from '../models';

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
      <FormGroup>
        <Col sm={10}>
          <Button id='btnDeleteProject' onClick={() => { this.props.goToProjectAnomalies(); }}><strong> {this.props.project.projectName}</strong></Button>
        </Col>
        <Col sm={1}>
          <Button id='btnEditProject' bsStyle='primary' onClick={() => {
            this.props.editProject(this.props.project);
          }}>Edit</Button>
        </Col>
        <Col sm={1}>
          <Button id='btnDeleteProject' bsStyle='primary' onClick={() => {
            this.props.deleteProject(this.props.project.id);
          }}>Delete</Button>
        </Col>
      </FormGroup>
    </ListGroupItem>;
  }
}