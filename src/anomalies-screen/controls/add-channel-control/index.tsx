import * as React from 'react';
import * as ReactDataGrid from 'react-data-grid'
import { IState } from '../../../state';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IAddChannelState } from './state';
import _ = require('lodash');
import update from 'immutability-helper';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup, Row, Col, DropdownButton, MenuItem } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';

interface IAddChannelComponentProps {
  controlState: IAddChannelState;
}

interface IAddChannelComponentActionCreators {

}

interface IAddChannelComponentState {
  siteId: number;
  channelId: number;
  channelType: string;
}

export class AddChannelControl extends React.Component<IAddChannelComponentProps & IAddChannelComponentActionCreators, IAddChannelComponentState> {
  constructor(props: IAddChannelComponentProps & IAddChannelComponentActionCreators, context: any) {
    super(props, context);
  }

  componentWillReceiveProps(props: IAddChannelComponentProps) {
    this.setState({});
  }

  render() {
    return (
      <div>
        <FormGroup>
          <Row>
            <Col lg={12}>
              <FormControl
                type="text"
                value={this.state.siteId}
                placeholder="Enter Channel ID"
              />
              <DropdownButton
                title=''
                id='qwer'>
                
                <MenuItem eventKey="1">Action</MenuItem>
                <MenuItem eventKey="2">Another action</MenuItem>
                <MenuItem eventKey="3" active>Active Item</MenuItem>
                <MenuItem divider />
                <MenuItem eventKey="4">Separated link</MenuItem>
              </DropdownButton>
            </Col>
          </Row>
        </FormGroup>
      </div>
    );
  }
};

function mapStateToProps(state: IState) {
  return {
    // controlState: state.anomaliesScreen.gridState,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({

  }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(AddChannelControl);

