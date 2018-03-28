import * as React from 'react';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { convertHpSliderScss, convertHpTimeSeriesChartScss, hpTimeSeriesChartReducerAuxFunctions, HpTimeSeriesScroller, IHpTimeSeriesChartState } from 'time-series-scroller';
import * as hpSliderScss from 'time-series-scroller/lib/out/sass/hp-slider.scss';
import * as hpTimeSeriesChartScss from 'time-series-scroller/lib/out/sass/hp-time-series-chart.scss';
import { IState } from '../state';
import { anomaliesScreenActionCreators } from './action-creators';

interface IAnomaliesComponentProps {
  anotherDummyText: string;
}

interface IAnomaliesComponentActionCreators {
  goToProjectsScreen: () => any;
}

// TODO move that to props
interface IAnomaliesComponentState {
  timeSeriesState: IHpTimeSeriesChartState;
}

class AnomaliesComponent extends React.Component<IAnomaliesComponentProps & IAnomaliesComponentActionCreators, IAnomaliesComponentState> {
  // TODO remove this constructor when timeSeriesState is in props
  constructor(props: IAnomaliesComponentProps & IAnomaliesComponentActionCreators) {
    super(props);

    this.state = {
      timeSeriesState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
    };

  }

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
      </form>

      <div style={{maxHeight: 800}}>
        <HpTimeSeriesScroller
          chartState={this.state.timeSeriesState}
          sliderScss={convertHpSliderScss(hpSliderScss)}
          timeSeriesChartScss={convertHpTimeSeriesChartScss(hpTimeSeriesChartScss)} >
        </HpTimeSeriesScroller>
      </div>

      <div style={{ height: 80 }}></div> <br/>
      <Button bsStyle='primary' onClick={() => this.props.goToProjectsScreen()} >Go back to project screen</Button>
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