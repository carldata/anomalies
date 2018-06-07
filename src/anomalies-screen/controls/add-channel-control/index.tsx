import * as React from 'react';
import * as ReactDataGrid from 'react-data-grid';
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
  channels: IChannel[];
  mainChartEmpty: boolean;
  lastStartDate: string;
  lastEndDate: string;
}

interface IAddChannelComponentActionCreators {
  addAndPopulateChannel: (siteChannelInfo: any, startDate: string, endDate: string) => any;
  addEmptyChannel: (siteChannelInfo: any) => any;
  cancelShowModal: () => any;
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

    this.addChannel = this.addChannel.bind(this);
  }

  public componentWillReceiveProps(nextProps: IAddChannelComponentProps & IAddChannelComponentActionCreators) {
    if (!this.props.showModal && nextProps.showModal) {
      this.siteId = _.isEmpty(nextProps.sites) ? '' : _.head(nextProps.sites).id;
      this.site = _.isEmpty(nextProps.sites) ? '' : _.head(nextProps.sites).id;
    }
    const firstChannel: IChannel = _.head(nextProps.channels);
    this.channelId = _.isUndefined(firstChannel) ? '' : firstChannel.id;
    this.channel = _.isUndefined(firstChannel) ? '' : firstChannel.id;
  }

  public render() {
    return <Modal show={this.props.showModal} onHide={() => this.props.cancelShowModal()}>
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
        <Button id='btnCancelAddChannelModal' onClick={() => this.props.cancelShowModal()}>
          Cancel
        </Button>
        <Button id='btnApproveAddChannelModal' bsStyle='primary' onClick={() => this.addChannel()} >
          Add
        </Button>
      </Modal.Footer>
    </Modal>;
  }

  private addChannel() {
    if (this.props.mainChartEmpty) {
      this.props.addEmptyChannel({
        site: this.siteId,
        channel: this.channelId,
        type: this.state.channelType,
      });
    } else {
      this.props.addAndPopulateChannel({
        site: this.siteId,
        channel: this.channelId,
        type: this.state.channelType,
      },
        this.props.lastStartDate,
        this.props.lastEndDate);
    }
  }
}

function mapStateToProps(state: IState) {
  return {
    showModal: state.anomaliesScreen.showModal,
    sites: state.anomaliesScreen.sites,
    channels: state.anomaliesScreen.channels,
    mainChartEmpty: state.anomaliesScreen.mainChartEmpty,
    lastStartDate: state.anomaliesScreen.lastStartDate,
    lastEndDate: state.anomaliesScreen.lastEndDate,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    addAndPopulateChannel: anomaliesScreenActionCreators.addAndPopulateChannel,
    addEmptyChannel: anomaliesScreenActionCreators.addEmptyChannel,
    cancelShowModal: anomaliesScreenActionCreators.cancelShowAddChannel,
  }, dispatch);
}

export const AddChannelModal = connect(mapStateToProps, matchDispatchToProps)(AddChannelModalComponent);

