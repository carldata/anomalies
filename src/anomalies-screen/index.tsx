import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, ControlLabel, Form, FormControl, FormGroup, Row, Col, Navbar } from 'react-bootstrap';
import { Column } from 'react-data-grid';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
  convertHpSliderScss, convertHpTimeSeriesChartScss, IHpTimeSeriesChartState, HpSlider, EnumHandleType,
  IUnixFromTo, handleMovedCallback, HpTimeSeriesChart, hpTimeSeriesChartReducerAuxFunctions,
} from 'time-series-scroller';
import { IDomain, IHpSliderHandleValues } from 'time-series-scroller/lib/out/hp-slider/interfaces';
import * as hpSliderScss from 'time-series-scroller/lib/out/sass/hp-slider.scss';
import * as hpTimeSeriesChartScss from 'time-series-scroller/lib/out/sass/hp-time-series-chart.scss';
import { IState } from '../state';
import { DataGrid } from './controls/data-grid';
import { IDataGridState } from './controls/data-grid/state';
import { AddChannelModal } from './controls/add-channel-control';
import { GeneralMessageModalContainer } from '../components/modal';
import { IProject } from '../models';
import { gridSelector } from './selectors/grid-selector';
import { chartsSelector } from './selectors/charts-selector';
import { IAnomaliesScreenState } from './models/anomalies-screen-state';
import { ISiteChannelInfo } from '@models/site-channel-info';
import {
  getTimeSeries,
  showSupportingChannelModal,
  hideSupportingChannelModal,
  addAndPopulateChannel,
  deleteSupportingChannel,
  saveProject,
  goToProjectsScreen,
  IGetTimeSeriesActionCreator,
  IShowSupportingChannelModalActionCreator,
  IAddAndPopulateChanneActionCreator,
  IDeleteSupportingChannelActionCreator,
  ISaveProjectActionCreator,
  IGoToProjectsScreenActionCreator,
  IHideSupportingChannelModalActionCreator,
} from './action-creators';
import {
  getChannelsForSite,
  IGetChannelsForSiteActionCreator,
} from '../projects-screen/action-creators';
import { ITimeSeriesLoadContext } from './models/time-series-load-context';
import DatePickerWrapper from '../components/datepicker/date-picker';

interface IAnomaliesComponentProps {
  rawChartState: IHpTimeSeriesChartState;
  mainChartState: IHpTimeSeriesChartState;
  finalChartState: IHpTimeSeriesChartState;
  supportingChannels: IHpTimeSeriesChartState[];
  gridState: IDataGridState;
  screenState: IAnomaliesScreenState;
}

interface IAnomaliesComponentActionCreators {
  getTimeSeries: IGetTimeSeriesActionCreator;
  showSupportingChannelModal: IShowSupportingChannelModalActionCreator;
  hideSupportingChannelModal: IHideSupportingChannelModalActionCreator;
  addAndPopulateChannel: IAddAndPopulateChanneActionCreator;
  getChannelsForSite: IGetChannelsForSiteActionCreator;
  deleteSupportingChannel: IDeleteSupportingChannelActionCreator;
  saveProject: ISaveProjectActionCreator;
  goToProjectsScreen: IGoToProjectsScreenActionCreator;
}

interface IAnomaliesComponentState {
  rawChartState: IHpTimeSeriesChartState;
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
      timeSeries: convertHpTimeSeriesChartScss(hpTimeSeriesChartScss),
    };

    this.state = {
      startDate: dateFns.format(dateFns.subMonths(dateFns.startOfDay(new Date()), 3), 'YYYY-MM-DDTHH:mm:ss'),
      endDate: dateFns.format(dateFns.startOfDay(new Date()), 'YYYY-MM-DDTHH:mm:ss'),
      windowUnixFrom: props.mainChartState.dateRangeUnixFrom,
      windowUnixTo: props.mainChartState.dateRangeUnixTo,
      rawChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
      mainChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
      finalChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
      supportingChannelsState: _.cloneDeep(props.supportingChannels),
      gridState: { rows: [] },
    };
  }

  public componentDidMount() {
    if (!_.isEmpty(this.props.screenState.project)) {
      this.props.getTimeSeries({
        dateFrom: this.state.startDate,
        dateTo: this.state.endDate,
      } as ITimeSeriesLoadContext);
    }
  }

  public componentWillReceiveProps(nextProps: IAnomaliesComponentProps) {
    this.setState({
      rawChartState: _.cloneDeep(nextProps.rawChartState),
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
      <GeneralMessageModalContainer />
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
              <Button
                disabled={_.isEmpty(this.props.screenState.project)}
                onClick={() => this.props.saveProject(this.props.screenState.project)}>
                Save Project
              </Button>
              {' '}
              <Button
                bsStyle='primary'
                disabled={_.isEmpty(this.props.screenState.project)}
                onClick={() => this.props.getTimeSeries({ dateFrom: this.state.startDate, dateTo: this.state.endDate } as ITimeSeriesLoadContext)}>
                Load Timeseries</Button>
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
            <FormGroup >
              <DatePickerWrapper dateSelected={(startDate, endDate) => {
                this.setState({ startDate, endDate });
              }} />
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
                    rawChartState: {
                      ...this.state.rawChartState,
                      windowUnixFrom,
                      windowUnixTo,
                    },
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
                  <p style={{ fontWeight: 'bold', marginLeft: this.scss.timeSeries.paddingLeftPx }}>
                    {
                      `${this.props.screenState.project.siteName}-${this.props.screenState.project.rawChannelName}`
                    }
                  </p>
                  <HpTimeSeriesChart
                    scss={this.scss.timeSeries}
                    state={this.state.rawChartState}
                    fitToParent={{ toHeight: true, toWidth: true }}
                  ></HpTimeSeriesChart>
                </div>
              </div>
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
                <p style={{ fontWeight: 'bold', marginLeft: this.scss.timeSeries.paddingLeftPx }}>
                  {
                    `${this.props.screenState.project.siteName}-${this.props.screenState.project.finalChannelName}`
                  }
                </p>
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
                      {`${this.props.screenState.project.supportingChannels[idx].siteName}-${this.props.screenState.project.supportingChannels[idx].channelName}`}
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
            </div>;
          })}

          <Row style={{ marginTop: 4 }}>
            <Col sm={12}>
              <Button className='pull-right' bsStyle='primary' onClick={() => this.props.showSupportingChannelModal()}>
                Add Channel
              </Button>
            </Col>
          </Row>
          <Row>
            <Col md={12}>
              <DataGrid
                columns={
                  _.concat(
                    [
                      { key: 'date', name: 'Timestamp' },
                      { key: 'rawValue', name: `${this.props.screenState.project.siteName}-${this.props.screenState.project.rawChannelName}` },
                      { key: 'editedValue', name: `${this.props.screenState.project.siteName}-${this.props.screenState.project.finalChannelName}` },
                      { key: 'fixedValue', name: 'ML Corrections' },
                    ] as Column[],
                    _.map(this.state.supportingChannelsState, (c, idx) => ({
                      key: `extendedValue${_.indexOf(this.state.supportingChannelsState, c) + 1}`,
                      name: `${this.props.screenState.project.supportingChannels[idx].siteName}-${this.props.screenState.project.supportingChannels[idx].channelName}`,
                    }) as Column))}
                rows={this.state.gridState.rows}
              />
            </Col>
          </Row>
          <Row>
            <AddChannelModal
              approveClicked={(siteChannelInfo: ISiteChannelInfo) => {
                this.props.addAndPopulateChannel(siteChannelInfo, this.state.startDate, this.state.endDate);
              }}
              cancelClicked={() => this.props.hideSupportingChannelModal()}
              channels={this.props.screenState.channels}
              sites={this.props.screenState.sites}
              showModal={this.props.screenState.supportingChannelModalShown}
              getChannelsForSite={this.props.getChannelsForSite} />
          </Row>
        </div>
      </div>;
    </>;
  }
}

function mapStateToProps(state: IState) {
  const chartsState = chartsSelector(state);
  return {
    rawChartState: chartsState.rawChartState,
    mainChartState: chartsState.mainChartState,
    gridState: gridSelector(state),
    finalChartState: chartsState.finalChartState,
    supportingChannels: chartsState.supportingChannels,
    screenState: state.anomaliesScreen,
  } as IAnomaliesComponentProps;
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    getTimeSeries,
    showSupportingChannelModal,
    hideSupportingChannelModal,
    addAndPopulateChannel,
    getChannelsForSite,
    deleteSupportingChannel,
    saveProject,
    goToProjectsScreen,
  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AnomaliesComponent);