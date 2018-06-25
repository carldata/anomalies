import * as _ from 'lodash';
import * as React from 'react';
import { Button, ControlLabel, Form, FormControl, FormGroup, Col, Modal } from 'react-bootstrap';
import { connect } from 'react-redux';
import { Dispatch, bindActionCreators } from 'redux';
import { IState } from '@app-state/.';
import { IChannel, ISiteChannelInfo, ISite } from '@models/.';

interface IAddChannelModalProps {
  showModal: boolean;
  sites: ISite[];
  channels: IChannel[];
}

interface IAddChannelModalActionCreators {
  approveClicked: (siteChannelInfo: ISiteChannelInfo) => void;
  getChannelsForSite: (siteId: string) => any;
  cancelClicked: () => any;
}

interface IAddChannelModalState {
  channelType: string;
}

export class AddChannelModal extends React.Component<IAddChannelModalProps & IAddChannelModalActionCreators, IAddChannelModalState> {
  private siteId: string;
  private channelId: string;
  private siteName: string;
  private channelName: string;

  constructor(props: IAddChannelModalProps & IAddChannelModalActionCreators, context: any) {
    super(props, context);
    this.siteId = '';
    this.siteName = '';
    this.channelId = '';
    this.channelName = '';
    this.state = {
      channelType: '',
    };

    this.addChannelClicked = this.addChannelClicked.bind(this);
  }

  public componentWillReceiveProps(nextProps: IAddChannelModalProps & IAddChannelModalActionCreators) {
    if (!this.props.showModal && nextProps.showModal) {
      this.siteId = _.isEmpty(nextProps.sites) ? '' : _.head(nextProps.sites).id;
      this.siteName = _.isEmpty(nextProps.sites) ? '' : _.head(nextProps.sites).name;
    }
    const firstChannel: IChannel = _.head(nextProps.channels);
    this.channelId = _.isUndefined(firstChannel) ? '' : firstChannel.id;
    this.channelName = _.isUndefined(firstChannel) ? '' : firstChannel.name;
  }

  public render() {
    return <Modal show={this.props.showModal} onHide={() => this.props.cancelClicked()}>
      <Modal.Body>
        <Form inline>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>
              Site:
            </Col>
            <Col sm={10}>
              <select id='selectSite' className='form-control' onChange={(e) => {
                const selectElement = (e.target as HTMLSelectElement);
                this.siteId = selectElement.value;
                this.siteName = _.head(selectElement.selectedOptions).label;
                this.props.getChannelsForSite(selectElement.value);
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
              <select id='selectChannel' className='form-control' onChange={(e) => {
                const selectElement = (e.target as HTMLSelectElement);
                this.channelId = selectElement.value;
                this.channelName = _.head(selectElement.selectedOptions).label;
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
        <Button id='btnCancelAddChannelModal' onClick={() => this.props.cancelClicked()}>
          Cancel
        </Button>
        <Button id='btnApproveAddChannelModal' bsStyle='primary' onClick={() => this.addChannelClicked()} >
          Add
        </Button>
      </Modal.Footer>
    </Modal>;
  }

  private addChannelClicked() {
    this.props.approveClicked({
      siteId: this.siteId,
      siteName: this.siteName,
      channelId: this.channelId,
      channelName: this.channelName,
      type: this.state.channelType,
    });
  }
}