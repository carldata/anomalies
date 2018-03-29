import * as React from 'react';
import { Col, ControlLabel, FormControl, FormGroup, ListGroupItem } from 'react-bootstrap';

interface IProjectComponentProps {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  splitDate: string;
}

interface IProjectComponentActionCreators {
  goToProjectAnomalies: () => any;
}

export class ProjectComponent extends React.Component<IProjectComponentProps & IProjectComponentActionCreators> {
  public render() {
    return <ListGroupItem onClick={() => this.props.goToProjectAnomalies()}>
      <FormGroup>
        <Col sm={12}>
          <FormControl.Static style={{ color: '#30608f' }}>
            {this.props.name} - {this.props.id}
          </FormControl.Static>
        </Col>
      </FormGroup>
      <FormGroup>
        <Col sm={12}> <b>Start Date:</b> {this.props.startDate} <b>End Date:</b> {this.props.endDate} <b>Split Date:</b> {this.props.splitDate}  </Col>
      </FormGroup>
    </ListGroupItem>;
  }
}