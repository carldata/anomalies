import * as React from 'react';
import * as ReactDataGrid from 'react-data-grid'
import { IState } from '../../../state';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IAddChannelState } from './state';
import * as _ from 'lodash';
import update from 'immutability-helper';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup, Row, Col, DropdownButton, MenuItem, Modal } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';
import { ISite, IChannel } from '../../../model';
import { anomaliesScreenActionCreators } from '../../action-creators';

interface IAddChannelComponentProps {
  showModal: boolean;
  sites: ISite[];
  channels?: IChannel[];
}

interface IAddChannelComponentActionCreators {
  addAndPopulateChannel: (siteChannelInfo: any) => any;
  addEmptyChannel: (siteChannelIfno: any) => any;
  hideModal: () => any;
}

interface IAddChannelComponentState {
  channelType: string;
}

export class AddChannelModalComponent extends React.Component<IAddChannelComponentProps & IAddChannelComponentActionCreators, IAddChannelComponentState> {
  private siteId: string;
  private site: string;
  private channelId: string;
  private channel: string;

  constructor(props: IAddChannelComponentProps & IAddChannelComponentActionCreators, context: any) {
    super(props, context);
    this.siteId = '';
    this.site = '';
    this.channelId = '';
    this.channel = '';
    this.state = {
      channelType: '',
    };
  }

  // componentWillReceiveProps(props: IAddChannelComponentProps) {
  //   this.setState({ showModal: props.showModal, sites: props.sites });
  // };

  //approveAddChannel() {
  //   this.hideModal();
  //};


  public render() {
    return <Modal show={this.props.showModal} onHide={() => this.props.hideModal()}>
      <Modal.Body>
        <Form horizontal>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>
              Site:
            </Col>
            <Col sm={10}>
              <select id='selectProjectSiteAnomalies' className='form-control' onChange={(e) => {
                const selectElement = (e.target as HTMLSelectElement);
                console.log(selectElement.value);
                console.log(selectElement.options[selectElement.selectedIndex].innerText);
                this.siteId = selectElement.value;
                this.site = selectElement.value;
              }} >
                {
                  this.props.sites.map((el, idx) => (<option value={el.id} key={idx}>{el.name}</option>))
                }
              </select>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>
              Channel:
            </Col>
            <Col sm={10}>
              {/* <FormControl type='text' onChange={(e) => this.setState({ channelId: (e.target as HTMLInputElement).value })} value={this.state.channelId}></FormControl> */}
              <select id='selectProjectSiteAnomalies' className='form-control' onChange={(e) => {
                const selectChannelElement = (e.target as HTMLSelectElement);
                console.log(selectChannelElement.value);
                console.log(selectChannelElement.options[selectChannelElement.selectedIndex].innerText);
                this.channelId = selectChannelElement.value;
                this.channel = selectChannelElement.value;
              }} >
                {
                  this.props.channels.map((el, idx) => (<option value={el.id} key={idx}>{el.name}</option>))
                }
              </select>
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
        <Button id='btnApproveAddChannelModal' bsStyle='primary' onClick={() => this.addChannel({
          site: this.siteId,
          channel: this.channelId,
          type: this.state.channelType,
        })} >
          Add
        </Button>
      </Modal.Footer>
    </Modal>;
  }

 private addChannel(siteChannelInfo: any) {
   
}
}

function mapStateToProps(state: IState) {
  return {
    showModal: state.anomaliesScreen.showModal,
    sites: state.anomaliesScreen.sites,
    channels: state.anomaliesScreen.channels,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    addAndPopulateChannel: anomaliesScreenActionCreators.addAndPopulateChannel,
    addEmptyChannel: anomaliesScreenActionCreators.addEmptyChannel,
  }, dispatch);
}

export const AddChannelModal = AddChannelModalComponent;

