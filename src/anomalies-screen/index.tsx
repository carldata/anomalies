import * as dateFns from 'date-fns';
import * as _ from 'lodash';
import * as React from 'react';
import { Button, ControlLabel, Form, FormControl, FormGroup, Row, Col, Navbar, Nav, NavItem } from 'react-bootstrap';
import { Column } from 'react-data-grid';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import {
  convertHpSliderScss, convertHpTimeSeriesChartScss, IHpTimeSeriesChartState, HpSlider, EnumHandleType,
  IUnixFromTo, handleMovedCallback, HpTimeSeriesChart, hpTimeSeriesChartReducerAuxFunctions,
} from 'time-series-scroller';
import { IDomain, IHpSliderHandleValues } from 'time-series-scroller/lib/out/hp-slider/interfaces';
import * as hpTimeSeriesChartScss from 'time-series-scroller/lib/out/sass/hp-time-series-chart.scss';
import * as hpSliderScss from '../../styles/hp-slider/hp-slider.scss';
import { hpTimeSeriesChartCalculations } from 'time-series-scroller';
import { IState } from '../state';
import { DataGrid } from './controls/data-grid';
import { IDataGridState, IDataGridRow } from './controls/data-grid/state';
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
import { EnumHpTimeSeriesChartMode } from '../../node_modules/time-series-scroller/lib/out/hp-time-series-chart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IAnomaliesComponentProps {
  scrollbarChartState: IHpTimeSeriesChartState;
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
  scrollbarChartState: IHpTimeSeriesChartState;
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
      scrollbarChartState: hpTimeSeriesChartReducerAuxFunctions.buildInitialState(),
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
      scrollbarChartState: _.cloneDeep(nextProps.scrollbarChartState),
      rawChartState: _.cloneDeep(nextProps.rawChartState),
      mainChartState: _.cloneDeep(nextProps.mainChartState),
      finalChartState: _.cloneDeep(nextProps.finalChartState),
      supportingChannelsState: _.cloneDeep(nextProps.supportingChannels),
      windowUnixFrom: nextProps.mainChartState.dateRangeUnixFrom,
      windowUnixTo: nextProps.mainChartState.dateRangeUnixTo,
      gridState: _.cloneDeep(nextProps.gridState),
    });
  }

  public render() {
    return <>
      <GeneralMessageModalContainer />
      <div>
        <Navbar fluid>
          <Navbar.Header>
            <Navbar.Text style={{marginLeft: 0}}>
              <a href='#' onClick={() => this.props.goToProjectsScreen()}>
                <FontAwesomeIcon icon={['fal', 'angle-left']}/> Back
              </a>
            </Navbar.Text>
            <Navbar.Brand>
              Anomaly Detection: {_.isEmpty(this.props.screenState.project) ? ' ' : this.props.screenState.project.projectName}
            </Navbar.Brand>
          </Navbar.Header>
        </Navbar>
        <div className='container-fluid'>

          {/*<a onClick={() => this.props.goToProjectsScreen()}><FontAwesomeIcon icon={['fal', 'angle-left']}/> Back</a>*/}

          <Form inline style={{marginBottom: 40}}>
            <div className='row'>
              <div className='col-sm-6'>
                <FormGroup style={{marginRight: '16px'}}>
                  <ControlLabel style={{marginRight: '4px'}}>Site:</ControlLabel>
                  <FormControl.Static>{_.isEmpty(this.props.screenState.project) ? 'No site' : this.props.screenState.project.siteName}</FormControl.Static>
                </FormGroup>
                <FormGroup style={{marginRight: '16px'}}>
                  <ControlLabel style={{marginRight: '4px'}}>Source:</ControlLabel>
                  <FormControl.Static>{_.isEmpty(this.props.screenState.project) ? 'No source ' : this.props.screenState.project.rawChannelName}</FormControl.Static>
                </FormGroup>
                <FormGroup>
                  <ControlLabel style={{marginRight: '4px'}}>Final:</ControlLabel>
                  <FormControl.Static>{_.isEmpty(this.props.screenState.project) ? 'No final' : this.props.screenState.project.finalChannelName}</FormControl.Static>
                </FormGroup>
              </div>
              <div className='col-sm-6 text-right'>
                <FormGroup style={{marginRight: '4px'}} >
                  <DatePickerWrapper dateSelected={(startDate, endDate) => {
                    this.setState({ startDate, endDate });
                  }} />
                </FormGroup>
                <Button
                  bsStyle='link'
                  disabled={_.isEmpty(this.props.screenState.project)}
                  onClick={() => this.props.getTimeSeries({ dateFrom: this.state.startDate, dateTo: this.state.endDate } as ITimeSeriesLoadContext)}>
                  <FontAwesomeIcon icon={['fal', 'sync']}/> Update</Button>
              </div>
            </div>
          </Form>

          <div style={{ minHeight: this.scss.slider.heightPx, marginLeft: this.scss.timeSeries.paddingLeftPx, marginBottom: 40 }}>
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
                  gridState: {
                    rows: this.props.gridState.rows.filter((el: IDataGridRow) => el.epoch >= windowUnixFrom && el.epoch <= windowUnixTo),
                  } as IDataGridState,
                });
              }}
              fitToParent={{ toWidth: true }}>
              <HpTimeSeriesChart
                scss={((scss) => ({
                  heightPx: scss.heightPx,
                  widthPx: scss.widthPx,
                  paddingBottomPx: 5,
                  paddingLeftPx: 0,
                  paddingRightPx: 0,
                  paddingTopPx: 5,
                }))(convertHpSliderScss(hpSliderScss))}
                state={this.state.scrollbarChartState}
                mode={EnumHpTimeSeriesChartMode.SliderEmbedded}
                fitToParent={{ toWidth: true, offsetWidth: 0 }}
              />
            </HpSlider>
          </div>

          <div style={{ height: 250, marginBottom: 40 }} >
            <h4 style={{ fontWeight: 'bold', marginLeft: this.scss.timeSeries.paddingLeftPx }}>
              {`${this.props.screenState.project.siteName}-${this.props.screenState.project.rawChannelName}`}
            </h4>
            <HpTimeSeriesChart
              scss={this.scss.timeSeries}
              state={this.state.rawChartState}
              fitToParent={{ toHeight: true, toWidth: true }}
              scaleLinearDomain={() => hpTimeSeriesChartCalculations.findMinMaxValuesBasedOnWindow(this.state.rawChartState)}>
            </HpTimeSeriesChart>
          </div>

          <div style={{ height: 250, marginBottom: 40 }} >
            <h4 style={{ fontWeight: 'bold', marginLeft: this.scss.timeSeries.paddingLeftPx }}>ML Corrections</h4>
            <HpTimeSeriesChart
              scss={this.scss.timeSeries}
              state={this.state.mainChartState}
              fitToParent={{ toHeight: true, toWidth: true }}
              scaleLinearDomain={() => hpTimeSeriesChartCalculations.findMinMaxValuesBasedOnWindow(this.state.mainChartState)}>
            </HpTimeSeriesChart>
          </div>

          <div style={{ height: 250, marginBottom: 40 }}>
            <h4 style={{ fontWeight: 'bold', marginLeft: this.scss.timeSeries.paddingLeftPx }}>
              {
                `${this.props.screenState.project.siteName}-${this.props.screenState.project.finalChannelName}`
              }
            </h4>
            <HpTimeSeriesChart
              scss={this.scss.timeSeries}
              state={this.state.finalChartState}
              fitToParent={{ toHeight: true, toWidth: true }}
              scaleLinearDomain={() => hpTimeSeriesChartCalculations.findMinMaxValuesBasedOnWindow(this.state.finalChartState)}>
            </HpTimeSeriesChart>
          </div>

          {_.map(this.state.supportingChannelsState, (el, idx) => {
            return <div key={idx} style={{ background: '#f5f5f5', marginBottom: 40, padding: 15 }}>
              <h4 style={{ fontWeight: 'bold', marginLeft: this.scss.timeSeries.paddingLeftPx }}>
                {`${this.props.screenState.project.supportingChannels[idx].siteName}-${this.props.screenState.project.supportingChannels[idx].channelName}`}
              </h4>
              <div style={{ height: 250, marginBottom: 15 }} >
                <HpTimeSeriesChart
                  scss={this.scss.timeSeries}
                  state={el}
                  fitToParent={{ toHeight: true, toWidth: true }}
                  scaleLinearDomain={() => hpTimeSeriesChartCalculations.findMinMaxValuesBasedOnWindow(el)}>
                </HpTimeSeriesChart>
              </div>
              <div className='clearfix'>
                <Button className='pull-right' bsStyle='default' onClick={() => this.props.deleteSupportingChannel(idx)}>
                  <FontAwesomeIcon icon={['fal', 'times']}/> Remove
                </Button>
              </div>
            </div>;
          })}

          <div className='clearfix' style={{marginBottom: 40}}>
            <Button className='pull-right' bsStyle='primary' onClick={() => this.props.showSupportingChannelModal()}>
              <FontAwesomeIcon icon={['fal', 'plus-circle']}/> Add Supporting Channel
            </Button>
          </div>

          <DataGrid
            columns={
              _.concat(
                [
                  { key: 'date', name: 'Timestamp' },
                  { key: 'rawValue', name: `${this.props.screenState.project.siteName}-${this.props.screenState.project.rawChannelName}` },
                  { key: 'fixedValue', name: 'ML Corrections' },
                  { key: 'editedValue', name: `${this.props.screenState.project.siteName}-${this.props.screenState.project.finalChannelName}` },
                ] as Column[],
                _.map(this.state.supportingChannelsState, (c, idx) => ({
                  key: `extendedValue${_.indexOf(this.state.supportingChannelsState, c) + 1}`,
                  name: `${this.props.screenState.project.supportingChannels[idx].siteName}-${this.props.screenState.project.supportingChannels[idx].channelName}`,
                }) as Column))}
            rows={this.state.gridState.rows}
          />

          <AddChannelModal
            approveClicked={(siteChannelInfo: ISiteChannelInfo) => {
              this.props.addAndPopulateChannel(siteChannelInfo, this.state.startDate, this.state.endDate);
            }}
            cancelClicked={() => this.props.hideSupportingChannelModal()}
            channels={this.props.screenState.channels}
            sites={this.props.screenState.sites}
            showModal={this.props.screenState.supportingChannelModalShown}
            getChannelsForSite={this.props.getChannelsForSite} />

          <Button
            style={{marginRight: 4}}
            bsStyle='primary'
            disabled={_.isEmpty(this.props.screenState.project)}
            onClick={() => this.props.saveProject(this.props.screenState.project)}>
            Save Project
          </Button>
          <Button bsStyle='default' onClick={() => this.props.goToProjectsScreen()}>Cancel</Button>
        </div>
      </div>;
    </>;
  }
}

function mapStateToProps(state: IState) {
  const chartsState = chartsSelector(state);
  return {
    scrollbarChartState: chartsState.scrollbarChartState,
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