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
import { ISite } from '../../../model';

interface IAddChannelComponentProps {
  showModal: boolean;
  sites: ISite[];
}

interface IAddChannelComponentActionCreators {
  addChannel: (siteChannelInfo: any) => any;
  hideModal: () => any;
}

interface IAddChannelComponentState {
  siteId: string;
  channelId: string;
  channelType: string;
  showModal: boolean;
  sites: ISite[];
}

export class AddChannelModalComponent extends React.Component<IAddChannelComponentProps & IAddChannelComponentActionCreators, IAddChannelComponentState> {
  constructor(props: IAddChannelComponentProps & IAddChannelComponentActionCreators, context: any) {
    super(props, context);
    this.state = {
      showModal: false,
      siteId: '',
      channelId: '',
      channelType: '',
      sites: [],
    }
  };

  componentWillReceiveProps(props: IAddChannelComponentProps) {
    this.setState({ showModal: props.showModal, sites: props.sites });
  };

  approveAddChannel() {
    //   this.hideModal();
  };

  render() {
    return <Modal show={this.state.showModal} onHide={() => this.props.hideModal()}>
      <Modal.Body>
        <Form horizontal>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>
              Site:
            </Col>
            <Col sm={10}>
              <select id='selectProjectSite' className='form-control' onChange={(e) => {
                const selectElement = (e.target as HTMLSelectElement);
                console.log(selectElement.value);
                console.log(selectElement.options[selectElement.selectedIndex].innerText);
              }} >
                {
                  this.state.sites.map((el, idx) => (<option value={el.id} key={idx}>{el.name}</option>))
                }
              </select>
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
        <Button id='btnCancelAddChannelModal' onClick={() => this.props.hideModal()}>
          Cancel
        </Button>
        <Button id='btnApproveAddChannelModal' bsStyle='primary' onClick={() => this.props.addChannel({
          site: this.state.siteId,
          channel: this.state.channelId,
          type: this.state.channelType,
        })} >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  };
};

export const AddChannelModal = AddChannelModalComponent;

