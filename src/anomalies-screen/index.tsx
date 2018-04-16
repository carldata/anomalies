import * as React from 'react';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup, Row, Col, Nav, NavItem, Navbar, NavDropdown, MenuItem } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { convertHpSliderScss, convertHpTimeSeriesChartScss, HpTimeSeriesScroller, IHpTimeSeriesChartState } from 'time-series-scroller';
import * as hpSliderScss from 'time-series-scroller/lib/out/sass/hp-slider.scss';
import * as hpTimeSeriesChartScss from 'time-series-scroller/lib/out/sass/hp-time-series-chart.scss';
import { IState } from '../state';
import { anomaliesScreenActionCreators } from './action-creators';
import { DataGrid } from './controls/data-grid'
import { IDataGridState } from './controls/data-grid/state';
import { LinkContainer } from 'react-router-bootstrap';

interface IAnomaliesComponentProps {
  chartState: IHpTimeSeriesChartState;
  gridState: IDataGridState;
}

interface IAnomaliesComponentActionCreators {
  goToProjectsScreen: () => any;
  getAnomaliesForChannel: (channel: string) => any;
  copyRawToEdited: () => any;
}

class AnomaliesComponent extends React.Component<IAnomaliesComponentProps & IAnomaliesComponentActionCreators> {
  public render() {
    return <div>
      <div style={{ marginLeft: 20, marginRight: 20, marginTop: 10, marginBottom: 10 }}>
        <FormGroup>
          <Form componentClass='fieldset' inline>
            <Row>
              <Col lg={3}>
                {/* <Navbar inverse collapseOnSelect>
                  <Navbar.Header>
                    <Navbar.Brand>
                      <a href="#">Anomalies</a>
                    </Navbar.Brand>
                  </Navbar.Header>
                  <Navbar.Collapse>
                    <Nav>
                      <NavItem eventKey={1} href="#">Filter</NavItem>
                      <NavItem eventKey={2} href="#">Search</NavItem>
                    </Nav>
                    <Nav>
                      <NavItem eventKey={1} href="#">Sign Up</NavItem>
                      <NavItem eventKey={2} href="#">Login</NavItem>
                    </Nav>
                  </Navbar.Collapse>
                </Navbar> */}
                {/* <FormControl.Static style={{ color: '#30608f' }}>{'Project name'}</FormControl.Static> */}
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
                <FormControl.Static> {'Channel name'} </FormControl.Static>{' '}
              </Col>
              <Col lg={3}>
                <div className='pull-right'>
                  <FormControl.Static> <b>Channel:</b> </FormControl.Static >{' '}
                  <FormControl componentClass='select' className='btn-primary' >
                    <option value='Flow 1'>Flow 1</option>
                    <option value='Flow 2'>Flow 2</option>
                    <option value='Flow 3'>Flow 3</option>
                    <option value='Flow 4'>Flow 4</option>
                  </FormControl>{' '}
                  <Button bsStyle='success' onClick={() => this.props.getAnomaliesForChannel('7883-11762')} >Load Timeseries</Button>
                </div>
              </Col>
            </Row>
          </Form>
        </FormGroup>

        <Row>
          <Col lg={6}>
            <div>
              <DataGrid
                gridState={this.props.gridState} >
              </DataGrid>
            </div>
          </Col>

          <Col lg={6}>
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
          </Col>
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