import * as React from 'react';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { convertHpSliderScss, convertHpTimeSeriesChartScss, HpTimeSeriesScroller, IHpTimeSeriesChartState } from 'time-series-scroller';
import * as hpSliderScss from 'time-series-scroller/lib/out/sass/hp-slider.scss';
import * as hpTimeSeriesChartScss from 'time-series-scroller/lib/out/sass/hp-time-series-chart.scss';
import { IState } from '../state';
import { anomaliesScreenActionCreators } from './action-creators';
import { DataGrid } from './controls/datagrid'

interface IAnomaliesComponentProps {
  chartState: IHpTimeSeriesChartState;
}

interface IAnomaliesComponentActionCreators {
  goToProjectsScreen: () => any;
  getAnomaliesForChannel: (channel: string) => any;
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
            <Button bsStyle='success' onClick={() => this.props.getAnomaliesForChannel('7883-11762') } >Load Timeseries</Button>
          </FormGroup>
        </Form>
      </form>

      <div style={{maxHeight: 800}}>
        <HpTimeSeriesScroller
          chartState={this.props.chartState}
          sliderScss={convertHpSliderScss(hpSliderScss)}
          timeSeriesChartScss={convertHpTimeSeriesChartScss(hpTimeSeriesChartScss)} >
        </HpTimeSeriesScroller>
      </div>

      <div style={{ height: 80 }}></div> <br/>
      <Button bsStyle='primary' onClick={() => this.props.goToProjectsScreen()} >Go back to project screen</Button>

      <DataGrid />
    </div>;
  }
}

function mapStateToProps(state: IState) {
  return {
    chartState: state.anomaliesScreen.chartState,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    getAnomaliesForChannel: anomaliesScreenActionCreators.getAnomaliesForChannel,
    goToProjectsScreen: anomaliesScreenActionCreators.goToProjectsScreen,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AnomaliesComponent);