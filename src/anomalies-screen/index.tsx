import * as React from 'react';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';
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
      <form>
        <FormControl.Static style={{ color: '#30608f' }}>{'Project name'}</FormControl.Static>

        <Form componentClass='fieldset' inline>
          <FormGroup>
            <ControlLabel>Start Date:</ControlLabel>{' '}
            <FormControl.Static>{'Start Date'}</FormControl.Static>{' '}
            <ControlLabel>End Date:</ControlLabel>{' '}
            <FormControl.Static>{'End Date'}</FormControl.Static>{' '}
            <ControlLabel>Split Date:</ControlLabel>{' '}
            <FormControl.Static>{'Split Date'}</FormControl.Static>
          </FormGroup>
        </Form>

        <Form componentClass='fieldset' inline>
          <FormGroup>
            <FormControl.Static> <b>Channel:</b> </FormControl.Static >{' '}
            <FormControl componentClass='select' className='btn-primary' >
              <option value='Flow 1'>Flow 1</option>
              <option value='Flow 2'>Flow 2</option>
              <option value='Flow 3'>Flow 3</option>
              <option value='Flow 4'>Flow 4</option>
            </FormControl>{' '}
            <FormControl.Static> <b>Edited Channel:</b> </FormControl.Static>{' '}
            <FormControl.Static> {'Channel name'} </FormControl.Static>{' '}
            <Button bsStyle='success'>Load Timeseries</Button>
          </FormGroup>
        </Form>

        <FormGroup>
          <FormControl.Static></FormControl.Static>
          <Button bsStyle='primary' onClick={() => this.props.goToProjectsScreen()} >Go back to project screen</Button>
        </FormGroup>
      </form>
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