import * as React from 'react';
import * as ReactDataGrid from 'react-data-grid'
import { IState } from '../../../state';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IAddChannelState } from './state';
import _ = require('lodash');
import update from 'immutability-helper';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup, Row, Col, DropdownButton, MenuItem, Modal } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';

interface IAddChannelComponentProps {
  showModal: boolean;
}

interface IAddChannelComponentActionCreators {
  addChannel: (channel: any) => any;
}

interface IAddChannelComponentState {
  siteId: string;
  channelId: string;
  channelType: string;
  showModal: boolean;
}

export class AddChannelModalComponent extends React.Component<IAddChannelComponentProps & IAddChannelComponentActionCreators, IAddChannelComponentState> {
  constructor(props: IAddChannelComponentProps & IAddChannelComponentActionCreators, context: any) {
    super(props, context);
    this.state = {
      showModal: false,
      siteId: '0',
      channelId: '0',
      channelType: ''
    }

    this.hideModal = this.hideModal.bind(this);
    this.approveAddChannel = this.approveAddChannel.bind(this);
  };

  componentWillReceiveProps(props: IAddChannelComponentProps) {
    this.setState({ showModal: props.showModal });
  };

  hideModal() {
    this.setState({ showModal: false });
  };

  approveAddChannel() {
    this.hideModal();
  };

  render() {
    return <Modal show={this.state.showModal} onHide={this.hideModal}>
        <Modal.Body>
          <Form horizontal>
            <FormGroup>
              <Col sm={2} componentClass={ControlLabel}>
                Site:
            </Col>
              <Col sm={10}>
                <FormControl type='text' onChange={(e) => this.setState({ siteId: (e.target as HTMLInputElement).value })} value={this.state.siteId}></FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={2} componentClass={ControlLabel}>
                Channel:
            </Col>
              <Col sm={10}>
                <FormControl type='text' onChange={(e) => this.setState({ channelId: (e.target as HTMLInputElement).value })} value={this.state.channelId}></FormControl>
              </Col>
            </FormGroup>
            <FormGroup>
              <Col sm={2} componentClass={ControlLabel}>
                Type:
            </Col>
              <Col sm={10}>
                <FormControl type='text' onChange={(e) => this.setState({ channelType: (e.target as HTMLInputElement).value })} value={this.state.channelType}></FormControl>
              </Col>
            </FormGroup>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button id='btnCancelAddChannelModal' onClick={this.hideModal}>
            Cancel
        </Button>
          <Button id='btnApproveAddChannelModal' bsStyle='primary' onClick={this.approveAddChannel} >
            Add
        </Button>
        </Modal.Footer>
      </Modal>
  };
};

function mapStateToProps(state: IState) {
  return {
    // showModal: state.
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({

  }, dispatch);
}

export const AddChannelModal = connect(mapStateToProps, matchDispatchToProps)(AddChannelModalComponent);

