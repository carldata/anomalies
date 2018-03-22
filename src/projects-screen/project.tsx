import * as React from 'react';
import { FormGroup, ListGroupItem } from 'react-bootstrap';

interface IProjectComponentProps {
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
    return <ListGroupItem onClick={ () => this.props.goToProjectAnomalies() }>
      <FormGroup>

      </FormGroup>
    </ListGroupItem>;
  }
}