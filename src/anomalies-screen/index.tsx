import * as React from 'react';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup, Row, Col, Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { convertHpSliderScss, convertHpTimeSeriesChartScss, HpTimeSeriesScroller, IHpTimeSeriesChartState, HpSlider, EnumHandleType, IUnixFromTo, handleMovedCallback } from 'time-series-scroller';
import * as hpSliderScss from 'time-series-scroller/lib/out/sass/hp-slider.scss';
import * as hpTimeSeriesChartScss from 'time-series-scroller/lib/out/sass/hp-time-series-chart.scss';
import { IState } from '../state';
import { IProject } from '../projects-screen/state'
import { anomaliesScreenActionCreators } from './action-creators';
import { DataGrid } from './controls/data-grid'
import { IDataGridState } from './controls/data-grid/state';
import { LinkContainer } from 'react-router-bootstrap';
import { AddChannelModal } from './controls/add-channel-control';
import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import { IDomain, IHpSliderHandleValues } from 'time-series-scroller/lib/out/hp-slider/interfaces';

interface IAnomaliesComponentProps {
  mainChartState: IHpTimeSeriesChartState;
  finalChartState?: IHpTimeSeriesChartState;
  supportingChannels?: { site: string, channel: string, IHpTimeSeriesChartState }[];
  gridState: IDataGridState;
  project: IProject;
}

interface IAnomaliesComponentActionCreators {
  goToProjectsScreen: () => any;
  getAnomaliesForProject: (projectAndRange: any) => any;
  copyRawToEdited: () => any;
}

interface IAnomaliesComponentState {
  mainChartState?: IHpTimeSeriesChartState;
  finalChartState?: IHpTimeSeriesChartState;
  supportingChannels?: { site: string, channel: string, chartState: IHpTimeSeriesChartState }[];
  showModal: boolean;
  startDate: string;
  endDate: string;
  windowUnixFrom: number;
  windowUnixTo: number;
}

class AnomaliesComponent extends React.Component<IAnomaliesComponentProps & IAnomaliesComponentActionCreators, IAnomaliesComponentState> {
  constructor(props: IAnomaliesComponentProps & IAnomaliesComponentActionCreators, context: any) {
    super(props, context);
    this.state = {
      showModal: false,
      startDate: dateFns.format(dateFns.subMonths(dateFns.startOfDay(new Date()), 3), 'YYYY-MM-DDTHH:mm:ss'),
      endDate: dateFns.format(dateFns.startOfDay(new Date()), 'YYYY-MM-DDTHH:mm:ss'),
      windowUnixFrom: props.mainChartState.dateRangeUnixFrom,
      windowUnixTo: props.mainChartState.dateRangeUnixTo,
    }
  };

  componentWillReceiveProps(nextProps: IAnomaliesComponentProps & IAnomaliesComponentActionCreators) {

  }

  public render() {
    return <div>
      <Navbar fluid>
        <Navbar.Header>
          <Navbar.Brand>
            <div style={{ cursor: 'pointer' }} onClick={() => this.props.goToProjectsScreen()}>Anomaly</div>
          </Navbar.Brand>
        </Navbar.Header>
      </Navbar>
      <div style={{ marginLeft: 20, marginRight: 20, marginTop: 10, marginBottom: 10 }}>
        <Form>
          <FormGroup>
            <ControlLabel style={{ fontWeight: 'bold' }}>{_.isEmpty(this.props.project) ? ' ' : this.props.project.name}</ControlLabel>{' '}
            <Button bsStyle='primary' disabled={_.isEmpty(this.props.project)} onClick={() => this.props.getAnomaliesForProject({
              project: this.props.project,
              startDate: this.state.startDate,
              endDate: this.state.endDate,
            })}>Load Timeseries</Button>
          </FormGroup>
        </Form>

        <Form inline>
          <FormGroup>
            <ControlLabel>Site: </ControlLabel>
            <FormControl.Static>{_.isEmpty(this.props.project) ? ' ' : this.props.project.site}</FormControl.Static>
          </FormGroup>
          {' '}
          <FormGroup>
            <ControlLabel>Source: </ControlLabel>
            <FormControl.Static>{_.isEmpty(this.props.project) ? ' ' : this.props.project.raw}</FormControl.Static>
          </FormGroup>
          {' '}
          <FormGroup>
            <ControlLabel>Final: </ControlLabel>
            <FormControl.Static>{_.isEmpty(this.props.project) ? ' ' : this.props.project.final}</FormControl.Static>
          </FormGroup>
          {' '}
          <FormGroup>
            <ControlLabel>Start Date:</ControlLabel>
            {' '}
            <FormControl type='text' value={this.state.startDate} onChange={(e) => this.setState({ startDate: (e.target as HTMLInputElement).value })}></FormControl>
            {' '}
            <ControlLabel>End Date:</ControlLabel>
            {' '}
            <FormControl type='text' value={this.state.endDate} onChange={(e) => this.setState({ endDate: (e.target as HTMLInputElement).value })}></FormControl>
          </FormGroup>
        </Form>

        {/* <Row style={{ maxHeight: 300 }} >
          <Col sm={12}>
            <HpTimeSeriesScroller
              chartState={this.props.mainChartState}
              sliderScss={convertHpSliderScss(hpSliderScss)}
              timeSeriesChartScss={convertHpTimeSeriesChartScss(hpTimeSeriesChartScss)}
              fitToParentSize={true}>
            </HpTimeSeriesScroller>
          </Col>
        </Row> */}

        <Row style={{ minHeight: 80, marginLeft: 0 }}>
          <Col sm={12}>
            <HpSlider
              scss={convertHpSliderScss(hpSliderScss)}
              domain={{ domainMin: this.props.mainChartState.dateRangeUnixFrom, domainMax: this.props.mainChartState.dateRangeUnixTo } as IDomain<number>}
              displayDragBar={true}
              handleValues={{ left: this.state.windowUnixFrom, right: this.state.windowUnixTo } as IHpSliderHandleValues<number>}
              handleMoved={(value: number | number[], type: EnumHandleType) => {
                let { windowUnixFrom, windowUnixTo } = handleMovedCallback(value, type, { 
                  windowUnixFrom: this.state.windowUnixFrom, 
                  windowUnixTo: this.state.windowUnixTo } as IUnixFromTo)

                  this.setState({
                    windowUnixFrom: windowUnixFrom,
                    windowUnixTo: windowUnixTo,
                  })
              }}
              fitToParent={{ toWidth: true, offsetWidth: 35 }}
            ></HpSlider>

          </Col>
        </Row>

        <Row>
          <Col sm={12}>
            <Button style={{ marginTop: 100 }} className='btn-primary' onClick={() => this.setState({ showModal: true })} >Add Channel</Button>
          </Col>
        </Row>
        {/* </Form> */}
        <Row>
          <AddChannelModal showModal={this.state.showModal} addChannel={(arg) => { }}>

          </AddChannelModal>
        </Row>

        {_.map(this.state.supportingChannels, (el, idx) => {
          return (<p>{el.site}</p>)
        })}
      </div>
    </div>;
  }
}

function mapStateToProps(state: IState) {
  return {
    mainChartState: state.anomaliesScreen.chartState,
    gridState: state.anomaliesScreen.gridState,
    project: state.anomaliesScreen.project,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    getAnomaliesForProject: anomaliesScreenActionCreators.getAnomaliesForProject,
    goToProjectsScreen: anomaliesScreenActionCreators.goToProjectsScreen,
    copyRawToEdited: anomaliesScreenActionCreators.copyRawToEdited
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AnomaliesComponent);