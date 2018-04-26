import * as React from 'react';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup, Row, Col, Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { convertHpSliderScss, convertHpTimeSeriesChartScss, HpTimeSeriesScroller, IHpTimeSeriesChartState } from 'time-series-scroller';
import * as hpSliderScss from 'time-series-scroller/lib/out/sass/hp-slider.scss';
import * as hpTimeSeriesChartScss from 'time-series-scroller/lib/out/sass/hp-time-series-chart.scss';
import { IState } from '../state';
import { IProject } from '../projects-screen/state'
import { anomaliesScreenActionCreators } from './action-creators';
import { DataGrid } from './controls/data-grid'
import { IDataGridState } from './controls/data-grid/state';
import { LinkContainer } from 'react-router-bootstrap';
import { AddChannelModal } from './controls/add-channel-control';

interface IAnomaliesComponentProps {
  chartState: IHpTimeSeriesChartState;
  gridState: IDataGridState;
  project?: IProject;
}

interface IAnomaliesComponentActionCreators {
  goToProjectsScreen: () => any;
  getAnomaliesForChannel: (channel: string) => any;
  copyRawToEdited: () => any;
}

interface IAnomaliesComponentState {
  showModal: boolean;
}

class AnomaliesComponent extends React.Component<IAnomaliesComponentProps & IAnomaliesComponentActionCreators, IAnomaliesComponentState> {
  constructor(props: IAnomaliesComponentProps & IAnomaliesComponentActionCreators, context: any) {
    super(props, context);
    this.state = {
      showModal: false
    }
  };

  public render() {
    return <div>
      <div style={{ marginLeft: 20, marginRight: 20, marginTop: 10, marginBottom: 10 }}>
        <FormGroup>
          <Form componentClass='fieldset' inline>
            <Row>
              <Col lg={3}>
                <Button className='btn-primary' onClick={() => this.props.goToProjectsScreen()} >Projects</Button>
              </Col>
              <Col lg={3}>
                <ControlLabel>Start Date:</ControlLabel>{' '}
                <FormControl.Static>{'Start Date'}</FormControl.Static>{' '}

                <ControlLabel>End Date:</ControlLabel>{' '}
                <FormControl.Static>{'End Date'}</FormControl.Static>{' '}
              </Col>
              <Col lg={3}>
                <FormControl.Static> <b>Edited Channel:</b> </FormControl.Static>{' '}
                <FormControl.Static> {this.props.project.final} </FormControl.Static>{' '}
              </Col>
              <Col lg={3}>
                <div className='pull-right'>
                  <FormControl.Static> <b>Channel:</b> </FormControl.Static >{' '}
                  <FormControl.Static> { this.props.project.raw } </FormControl.Static>{' '}
                  {/* <FormControl componentClass='select' className='btn-primary' >
                    <option value='Flow 1'>Flow 1</option>
                    <option value='Flow 2'>Flow 2</option>
                    <option value='Flow 3'>Flow 3</option>
                    <option value='Flow 4'>Flow 4</option>
                  </FormControl>{' '} */}
                  <Button bsStyle='success' onClick={() => this.props.getAnomaliesForChannel('7883-11762')} >Load Timeseries</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </FormGroup>

        <Row>
          <Col lg={12}>
            <div>
              <div style={{ maxHeight: 800, marginTop: 150 }}>
                <HpTimeSeriesScroller
                  chartState={this.props.chartState}
                  sliderScss={convertHpSliderScss(hpSliderScss)}
                  timeSeriesChartScss={convertHpTimeSeriesChartScss(hpTimeSeriesChartScss)}
                  fitToParentSize={true}>
                </HpTimeSeriesScroller>
              </div>
            </div>
            <Button style={{marginTop: 100}} className='btn-primary' onClick={() => this.setState({ showModal: true })} >Add Channel</Button> 

          </Col>
        </Row>
        <Row>
          <AddChannelModal showModal={this.state.showModal} addChannel={(arg) => {}}>

          </AddChannelModal>
        </Row>
      </div>
    </div>;
  }
}

function mapStateToProps(state: IState) {
  return {
    chartState: state.anomaliesScreen.chartState,
    gridState: state.anomaliesScreen.gridState
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    getAnomaliesForChannel: anomaliesScreenActionCreators.getAnomaliesForChannel,
    goToProjectsScreen: anomaliesScreenActionCreators.goToProjectsScreen,
    copyRawToEdited: anomaliesScreenActionCreators.copyRawToEdited
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AnomaliesComponent);