import * as React from 'react';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup, Row, Col, Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { convertHpSliderScss, convertHpTimeSeriesChartScss, HpTimeSeriesScroller, IHpTimeSeriesChartState, HpSlider, EnumHandleType,
   IUnixFromTo, handleMovedCallback, HpTimeSeriesChart, hpTimeSeriesChartReducerAuxFunctions } from 'time-series-scroller';
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
import { Column } from 'react-data-grid';
import { ISite } from '../model';

interface IAnomaliesComponentProps {
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: { site: string, channel: string, chartState: IHpTimeSeriesChartState }[];
  gridState: IDataGridState;
  project: IProject;
  lastStartDate: string;
  lastEndDate: string;
}

interface IAnomaliesComponentActionCreators {
  goToProjectsScreen: () => any;
  saveProject: (project: IProject) => any;
  getAnomaliesForProject: (projectAndRange: any) => any;
  getSitesForProject: () => any;
  copyRawToEdited: () => any;
  showAddChannelModal: (mainChartEmpty: boolean) => any;
  deleteSupportingChannel: (idx: number) => any;
}

interface IAnomaliesComponentState {
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: { site: string, channel: string, chartState: IHpTimeSeriesChartState }[];
  gridState: IDataGridState;
  showModal: boolean;
  startDate: string;
  endDate: string;
  windowUnixFrom: number;
  windowUnixTo: number;
}

class AnomaliesComponent extends React.Component<IAnomaliesComponentProps & IAnomaliesComponentActionCreators, IAnomaliesComponentState> {
  private scss;

  constructor(props: IAnomaliesComponentProps & IAnomaliesComponentActionCreators, context: any) {
    super(props, context);

    this.scss = {
      slider: convertHpSliderScss(hpSliderScss),
      timeSeries: convertHpTimeSeriesChartScss(hpTimeSeriesChartScss)
    }

    this.state = {
      showModal: false,
      startDate: dateFns.format(dateFns.subMonths(dateFns.startOfDay(new Date()), 3), 'YYYY-MM-DDTHH:mm:ss'),
      endDate: dateFns.format(dateFns.startOfDay(new Date()), 'YYYY-MM-DDTHH:mm:ss'),
      windowUnixFrom: props.mainChartState.dateRangeUnixFrom,
      windowUnixTo: props.mainChartState.dateRangeUnixTo,
      mainChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
      finalChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
      supportingChannels: _.cloneDeep(props.supportingChannels),
      gridState: { rows: [] },
    }
  }

  public componentDidMount() {
    if (!_.isEmpty(this.props.project)) {
      this.props.getAnomaliesForProject({
        project: this.props.project,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      });
    }
  }

  public componentWillReceiveProps(nextProps: IAnomaliesComponentProps) {
    this.setState({
      mainChartState: _.cloneDeep(nextProps.mainChartState),
      finalChartState: _.cloneDeep(nextProps.finalChartState),
      supportingChannels: _.cloneDeep(nextProps.supportingChannels),
      windowUnixFrom: nextProps.mainChartState.dateRangeUnixFrom,
      windowUnixTo: nextProps.mainChartState.dateRangeUnixTo,
      gridState: nextProps.gridState,
    });
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
            <Button disabled={_.isEmpty(this.props.project)} onClick={() => this.props.saveProject(this.props.project)} >Save Project</Button>{' '}
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
            <FormControl.Static>{_.isEmpty(this.props.project) ? 'No site' : this.props.project.site}</FormControl.Static>
          </FormGroup>
          {' '}
          <FormGroup>
            <ControlLabel>Source: </ControlLabel>
            <FormControl.Static>{_.isEmpty(this.props.project) ? 'No source ' : this.props.project.raw}</FormControl.Static>
          </FormGroup>
          {' '}
          <FormGroup>
            <ControlLabel>Final: </ControlLabel>
            <FormControl.Static>{_.isEmpty(this.props.project) ? 'No final' : this.props.project.final}</FormControl.Static>
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

        <Row style={{ minHeight: this.scss.slider.heightPx, marginLeft: this.scss.timeSeries.paddingLeftPx, marginTop: 20, marginBottom: 20 }}>
          <Col>
            <HpSlider
              scss={convertHpSliderScss(hpSliderScss)}
              domain={{ domainMin: this.props.mainChartState.dateRangeUnixFrom, domainMax: this.props.mainChartState.dateRangeUnixTo } as IDomain<number>}
              displayDragBar={true}
              handleValues={{ left: this.state.windowUnixFrom, right: this.state.windowUnixTo } as IHpSliderHandleValues<number>}
              handleMoved={(value: number | number[], type: EnumHandleType) => {
                const { windowUnixFrom, windowUnixTo } = handleMovedCallback(value, type, {
                  windowUnixFrom: this.state.windowUnixFrom,
                  windowUnixTo: this.state.windowUnixTo,
                } as IUnixFromTo);

                const newSupportingChannelsState = _.map(this.state.supportingChannels, (el) => {
                  return {
                    site: el.site,
                    channel: el.channel,
                    chartState: {
                      ...el.chartState,
                      windowUnixFrom,
                      windowUnixTo,
                    } as IHpTimeSeriesChartState,
                  };
                });

                this.setState({
                  windowUnixFrom,
                  windowUnixTo,
                  mainChartState: {
                    ...this.state.mainChartState,
                    windowUnixFrom,
                    windowUnixTo,
                  } as IHpTimeSeriesChartState,
                  finalChartState: {
                    ...this.state.finalChartState,
                    windowUnixFrom,
                    windowUnixTo,
                  } as IHpTimeSeriesChartState,
                  supportingChannels: newSupportingChannelsState,
                });

              }}
              fitToParent={{ toWidth: true }}
            ></HpSlider>
          </Col>
        </Row>

        <Row>
          <Col lg={12}>
            <div>
              <div style={{ height: 250 }} >
                <p style={{ fontWeight: 'bold', marginLeft: this.scss.timeSeries.paddingLeftPx }}>ML Corrections</p>
                <HpTimeSeriesChart
                  scss={this.scss.timeSeries}
                  state={this.state.mainChartState}
                  fitToParent={{ toHeight: true, toWidth: true }}
                ></HpTimeSeriesChart>
              </div>
            </div>
          </Col>
        </Row>

        <Row>
          <Col md={12} >
            <div style={{ height: 250 }} >
              <p style={{ fontWeight: 'bold', marginLeft: this.scss.timeSeries.paddingLeftPx }}>Final</p>
              <HpTimeSeriesChart
                scss={this.scss.timeSeries}
                state={this.state.finalChartState}
                fitToParent={{ toHeight: true, toWidth: true }}
              ></HpTimeSeriesChart>
            </div>
          </Col>
        </Row>

        {_.map(this.state.supportingChannels, (el, idx) => {
          return <div style={{ background: '#F8F8F8' }}>
            <Row>
              <Col md={12} >
                <div style={{ height: 250 }} >
                  <p style={{ fontWeight: 'bold', marginLeft: this.scss.timeSeries.paddingLeftPx }}>{el.site + '-' + el.channel}</p>
                  <HpTimeSeriesChart
                    scss={this.scss.timeSeries}
                    state={el.chartState}
                    fitToParent={{ toHeight: true, toWidth: true }}
                  ></HpTimeSeriesChart>
                </div>
              </Col>
            </Row>
            <Row>
              <Col md={12}>
                <Button className='pull-right' bsStyle='primary' onClick={() => this.props.deleteSupportingChannel(idx)}>Delete</Button>
              </Col>
            </Row>
          </div>
        })}

        <Row style={{ marginTop: 4 }}>
          <Col sm={12}>
            <Button className='pull-right' bsStyle='primary' onClick={ () => {
              this.props.showAddChannelModal( (this.state.mainChartState.series.length === 1) && _.isEmpty(_.head(this.state.mainChartState.series).points));
              } }>Add Channel</Button>
          </Col>
        </Row>
        <Row>
          <Col md={12}>
            <DataGrid
              columns={
                _.concat(
                  [
                    { key: 'date', name: 'Timestamp' },
                    { key: 'rawValue', name: 'Raw' },
                    { key: 'editedValue', name: 'Final' },
                    { key: 'fixedValue', name: 'Fixed' },
                  ] as Column[],
                  _.map(this.state.supportingChannels, (c) => ({
                    key: `extendedValue${_.indexOf(this.state.supportingChannels, c) + 1}`,
                    name: `${c.site} ${c.channel}`,
                  }) as Column))}
              rows={this.state.gridState.rows}
            />
          </Col>
        </Row>
        <Row>
          <AddChannelModal/>
        </Row>
      </div>
    </div>;
  }
}

function mapStateToProps(state: IState) {
  return {
    mainChartState: state.anomaliesScreen.mainChartState,
    gridState: state.anomaliesScreen.gridState,
    finalChartState: state.anomaliesScreen.finalChartState,
    supportingChannels: state.anomaliesScreen.supportingChannels,
    project: state.anomaliesScreen.project,
    lastStartDate: state.anomaliesScreen.lastStartDate,
    lastEndDate: state.anomaliesScreen.lastEndDate,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    saveProject: anomaliesScreenActionCreators.saveProject,
    getAnomaliesForProject: anomaliesScreenActionCreators.getAnomaliesForProject,
    goToProjectsScreen: anomaliesScreenActionCreators.goToProjectsScreen,
    copyRawToEdited: anomaliesScreenActionCreators.copyRawToEdited,
    deleteSupportingChannel: anomaliesScreenActionCreators.deleteSupportingChannel,
    showAddChannelModal: anomaliesScreenActionCreators.showAddChannel,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AnomaliesComponent);