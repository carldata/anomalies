import * as React from 'react';
import { Col, FormControl, FormGroup, ListGroupItem } from 'react-bootstrap';
import { IProject } from '../models';

interface IProjectComponentActionCreators {
  goToProjectAnomalies: () => any;
}

export class ProjectComponent extends React.Component<IProject & IProjectComponentActionCreators> {
  public render() {
    return <ListGroupItem onClick={() => this.props.goToProjectAnomalies()}>
      <FormGroup>
        <Col sm={12}>
          <FormControl.Static style={{ color: '#4E84F3' }} >
            <strong> {this.props.projectName}</strong>
          </FormControl.Static>
        </Col>
      </FormGroup>
    </ListGroupItem>;
  }
}