import * as React from 'react';
import { Button, Col, Dropdown, Form, FormControl, FormGroup } from 'react-bootstrap';
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
      <Form>
        <FormGroup>
          <Col sm={12}>
            <FormControl.Static style={{ color: '#30608f' }}>
              {'Here will be project name'}
            </FormControl.Static>
          </Col>
        </FormGroup>
        <FormGroup>
          <Col sm={12}> <b>Start Date:</b> {'Place for Start Date'} <b>End Date:</b> {'Place for End Date'} <b>Split Date:</b> {'Place for Split Date'}  </Col>
        </FormGroup>
        <FormGroup>
          {/* <Col sm={12}> <b>Channel:</b> <Dropdown id='dpChannels' children={['flow']}/> </Col> */}
        </FormGroup>
      </Form>
      <div> {this.props.anotherDummyText} </div>
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