import * as React from 'react';
import { Col, ControlLabel, FormControl, FormGroup, ListGroupItem } from 'react-bootstrap';

interface IProjectComponentProps {
  id: string;
  name: string;
  site: string;
  raw: string;
  final: string;
}

interface IProjectComponentActionCreators {
  goToProjectAnomalies: () => any;
}

export class ProjectComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators> {
  public render() {
    return <ListGroupItem onClick={() => this.props.goToProjectAnomalies()}>
      <FormGroup>
        <Col sm={12}>
          <FormControl.Static style={{ color: '#4E84F3' }} >
            <strong> {this.props.name} </strong>
          </FormControl.Static>
        </Col>
      </FormGroup>
    </ListGroupItem>;
  }
}