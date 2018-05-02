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
import * as dateFns from 'date-fns';
import * as _ from 'lodash';

interface IAnomaliesComponentProps {
  chartState: IHpTimeSeriesChartState;
  gridState: IDataGridState;
  project: IProject;
}

interface IAnomaliesComponentActionCreators {
  goToProjectsScreen: () => any;
  getAnomaliesForProject: (projectAndRange: any) => any;
  copyRawToEdited: () => any;
}

interface IAnomaliesComponentState {
  showModal: boolean;
  startDate: string;
  endDate: string;
}

class AnomaliesComponent extends React.Component<IAnomaliesComponentProps & IAnomaliesComponentActionCreators, IAnomaliesComponentState> {
  constructor(props: IAnomaliesComponentProps & IAnomaliesComponentActionCreators, context: any) {
    super(props, context);
    this.state = {
      showModal: false,
      startDate: dateFns.format(dateFns.subMonths(dateFns.startOfDay(new Date()), 3), 'YYYY-MM-DDTHH:mm:ss'),
      endDate: dateFns.format(dateFns.startOfDay(new Date()), 'YYYY-MM-DDTHH:mm:ss'),
    }
  };

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
          <FormGroup className='pull-right'>
            <ControlLabel>Start Date:</ControlLabel>
            {' '}
            <FormControl type='text' value={this.state.startDate} onChange={(e) => this.setState({ startDate: (e.target as HTMLInputElement).value })}></FormControl>
            {' '}
            <ControlLabel>End Date:</ControlLabel>
            {' '}
            <FormControl type='text' value={this.state.endDate} onChange={(e) => this.setState({ endDate: (e.target as HTMLInputElement).value })}></FormControl>
          </FormGroup>
        </Form>

        <Form>
          <FormGroup style={{ maxHeight: 300 }}>
                  <HpTimeSeriesScroller
                    chartState={this.props.chartState}
                    sliderScss={convertHpSliderScss(hpSliderScss)}
                    timeSeriesChartScss={convertHpTimeSeriesChartScss(hpTimeSeriesChartScss)}
                    fitToParentSize={true}>
                  </HpTimeSeriesScroller>
           </FormGroup>
          <FormGroup>
              <Button style={{ marginTop: 100 }} className='btn-primary' onClick={() => this.setState({ showModal: true })} >Add Channel</Button>
           </FormGroup>
        </Form>
        <Row>
          <AddChannelModal showModal={this.state.showModal} addChannel={(arg) => { }}>

          </AddChannelModal>
        </Row>
      </div>
    </div>;
  }
}

function mapStateToProps(state: IState) {
  return {
    chartState: state.anomaliesScreen.chartState,
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