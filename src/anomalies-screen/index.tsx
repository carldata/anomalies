import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, ControlLabel, Form, FormControl, FormGroup, Row, Col, Navbar } from 'react-bootstrap';
import { Column } from 'react-data-grid';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { convertHpSliderScss, convertHpTimeSeriesChartScss, IHpTimeSeriesChartState, HpSlider, EnumHandleType,
   IUnixFromTo, handleMovedCallback, HpTimeSeriesChart, hpTimeSeriesChartReducerAuxFunctions } from 'time-series-scroller';
import { IDomain, IHpSliderHandleValues } from 'time-series-scroller/lib/out/hp-slider/interfaces';
import * as hpSliderScss from 'time-series-scroller/lib/out/sass/hp-slider.scss';
import * as hpTimeSeriesChartScss from 'time-series-scroller/lib/out/sass/hp-time-series-chart.scss';
import { IState } from '../state';
import { anomaliesScreenActionCreators } from './action-creators';
import { DataGrid } from './controls/data-grid';
import { IDataGridState } from './controls/data-grid/state';
import { AddChannelModal } from './controls/add-channel-control';
import { ModalContainer } from '../components/modal';
import { IProject } from '../models';
import { gridSelector } from './selectors/grid-selector';
import { chartsSelector } from './selectors/charts-selector';
import { IAnomaliesScreenState } from './models/anomalies-screen-state';
import { ISiteChannelInfo } from '@models/site-channel-info';

interface IAnomaliesComponentProps {
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: IHpTimeSeriesChartState[];
  gridState: IDataGridState;
  screenState: IAnomaliesScreenState;
}

interface IAnomaliesComponentActionCreators {
  getTimeSeries: (projectInfo: any) => any;
  showAddChannelModal: (mainChartEmpty: boolean) => any;
  addAndPopulateChannel: (siteChannelInfo: ISiteChannelInfo, unixFrom: number, unixTo: number) => any;
  getChannelsForSite: (siteId: string) => any;
  deleteSupportingChannel: (idx: number) => any;
  saveProject: (project: IProject) => any;
  goToProjectsScreen: () => any;
}

interface IAnomaliesComponentState {
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannelsState: IHpTimeSeriesChartState[];
  gridState: IDataGridState;
  endDate: string;
  startDate: string;
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
    };

    this.state = {
      startDate: dateFns.format(dateFns.subMonths(dateFns.startOfDay(new Date()), 3), 'YYYY-MM-DDTHH:mm:ss'),
      endDate: dateFns.format(dateFns.startOfDay(new Date()), 'YYYY-MM-DDTHH:mm:ss'),
      windowUnixFrom: props.mainChartState.dateRangeUnixFrom,
      windowUnixTo: props.mainChartState.dateRangeUnixTo,
      mainChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
      finalChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
      supportingChannelsState: _.cloneDeep(props.supportingChannels),
      gridState: { rows: [] },
    };
  }

  public componentDidMount() {
    if (!_.isEmpty(this.props.screenState.project)) {
      this.props.getTimeSeries({
        project: this.props.screenState.project,
        startDate: this.state.startDate,
        endDate: this.state.endDate,
      });
    }
  }

  public componentWillReceiveProps(nextProps: IAnomaliesComponentProps) {
    this.setState({
      mainChartState: _.cloneDeep(nextProps.mainChartState),
      finalChartState: _.cloneDeep(nextProps.finalChartState),
      supportingChannelsState: _.cloneDeep(nextProps.supportingChannels),
      windowUnixFrom: nextProps.mainChartState.dateRangeUnixFrom,
      windowUnixTo: nextProps.mainChartState.dateRangeUnixTo,
      gridState: nextProps.gridState,
    });
  }

  public render() {
    return <>
      <ModalContainer />
      <div>
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
              <ControlLabel style={{ fontWeight: 'bold' }}>{_.isEmpty(this.props.screenState.project) ? ' ' : this.props.screenState.project.projectName}</ControlLabel>{' '}
              <Button disabled={_.isEmpty(this.props.screenState.project)} onClick={() => this.props.saveProject(this.props.screenState.project)} >Save Project</Button>{' '}
              <Button bsStyle='primary' disabled={_.isEmpty(this.props.screenState.project)} onClick={() => this.props.getTimeSeries({
                project: this.props.screenState.project,
                startDate: this.state.startDate,
                endDate: this.state.endDate,
              })}>Load Timeseries</Button>
            </FormGroup>
          </Form>

          <Form inline>
            <FormGroup>
              <ControlLabel>Site: </ControlLabel>
              <FormControl.Static>{_.isEmpty(this.props.screenState.project) ? 'No site' : this.props.screenState.project.siteName}</FormControl.Static>
            </FormGroup>
            {' '}
            <FormGroup>
              <ControlLabel>Source: </ControlLabel>
              <FormControl.Static>{_.isEmpty(this.props.screenState.project) ? 'No source ' : this.props.screenState.project.rawChannelName}</FormControl.Static>
            </FormGroup>
            {' '}
            <FormGroup>
              <ControlLabel>Final: </ControlLabel>
              <FormControl.Static>{_.isEmpty(this.props.screenState.project) ? 'No final' : this.props.screenState.project.finalChannelName}</FormControl.Static>
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
                    supportingChannelsState: _.map(this.state.supportingChannelsState, (el) => ({
                        ...el,
                        windowUnixFrom,
                        windowUnixTo,
                      } as IHpTimeSeriesChartState)),
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

          {_.map(this.state.supportingChannelsState, (el, idx) => {
            return <div style={{ background: '#F8F8F8' }}>
              <Row>
                <Col md={12} >
                  <div style={{ height: 250 }} >
                    <p style={{ fontWeight: 'bold', marginLeft: this.scss.timeSeries.paddingLeftPx }}>
                      {`${this.props.screenState.project.supportingChannels[idx].site}-${this.props.screenState.project.supportingChannels[idx].channel}`}
                    </p>
                    <HpTimeSeriesChart
                      scss={this.scss.timeSeries}
                      state={el}
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
                    _.map(this.state.supportingChannelsState, (c, idx) => ({
                      key: `extendedValue${_.indexOf(this.state.supportingChannelsState, c) + 1}`,
                      name: `${this.props.screenState.project.supportingChannels[idx].site}-${this.props.screenState.project.supportingChannels[idx].channel}`,
                    }) as Column))}
                rows={this.state.gridState.rows}
              />
            </Col>
          </Row>
          <Row>
            <AddChannelModal
              approveClicked={(siteChannelInfo: ISiteChannelInfo) => {
                this.props.addAndPopulateChannel(siteChannelInfo,
                                                 this.state.mainChartState.dateRangeUnixFrom,
                                                 this.state.mainChartState.dateRangeUnixTo);
              }}
              addEmptyChannel={(e) => null}
              cancelClicked={() => null}
              channels={this.props.screenState.channels}
              sites={this.props.screenState.sites}
              showModal={this.props.screenState.showAddSupportingChannelModal}
              getChannelsForSite={this.props.getChannelsForSite}
              mainChartEmpty={false}
              />
          </Row>
        </div>
      </div>;
    </>
  }
}

function mapStateToProps(state: IState) {
  const chartsState = chartsSelector(state);
  return {
    mainChartState: chartsState.mainChartState,
    gridState: gridSelector(state),
    finalChartState: chartsState.finalChartState,
    supportingChannels: chartsState.supportingChannels,
    screenState: state.anomaliesScreen,
  } as IAnomaliesComponentProps;
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    getTimeSeries: anomaliesScreenActionCreators.getTimeSeries,
    showAddChannelModal: anomaliesScreenActionCreators.showAddChannelModal,
    addAndPopulateChannel: anomaliesScreenActionCreators.addAndPopulateChannel,
    getChannelsForSite: anomaliesScreenActionCreators.getChannelsForSite,
    deleteSupportingChannel: anomaliesScreenActionCreators.deleteSupportingChannel,
    saveProject: anomaliesScreenActionCreators.saveProject,
    goToProjectsScreen: anomaliesScreenActionCreators.goToProjectsScreen,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AnomaliesComponent);