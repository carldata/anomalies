import * as React from 'react';
import { Button, ButtonToolbar, Col, Dropdown, DropdownButton, Form, FormControl, FormGroup, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { IState } from '../state';
import { anomaliesScreenActionCreators } from './action-creators';

interface IAnomaliesComponentProps {
  anotherDummyText: string;
}

interface IAnomaliesComponentActionCreators {
  goToProjectsScreen: () => any;
}

class AnomaliesComponent extends React.Component<IAnomaliesComponentProps & IAnomaliesComponentActionCreators> {
  public render() {
    return <div>
      <Form horizontal>
        <FormGroup>
          <Col sm={12}>
            <FormControl.Static style={{ color: '#30608f' }}>
              {'Project name'}
            </FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={12}> <b>Start Date:</b> {'Start Date'} <b>End Date:</b> {'End Date'} <b>Split Date:</b> {'Split Date'}  </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={12}>
            <b>Channel: </b>
            <FormControl componentClass='select' className='btn-primary' style={{ width: '15%', display: 'inline' }}>
              <option value='Flow 1'>Flow 1</option>
              <option value='Flow 2'>Flow 2</option>
              <option value='Flow 3'>Flow 3</option>
              <option value='Flow 4'>Flow 4</option>
            </FormControl>
            <b> Edited Channel: </b> {'Channel name' } <span/>
            <Button bsStyle='success'>Load Timeseries</Button>
          </Col>
        </FormGroup>
      </Form>
      <Button bsStyle='danger' onClick={() => this.props.goToProjectsScreen()} >Go back to project screen</Button>
    </div>;
  }
}

function mapStateToProps(state: IState) {
  return {
    anotherDummyText: state.anomaliesScreen.anotherDummyText,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    goToProjectsScreen: anomaliesScreenActionCreators.goToProjectsScreen,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AnomaliesComponent);