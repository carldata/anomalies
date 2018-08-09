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

interface ISiteOptionsSorted {
  sites: any;
}

interface IChannelOptionsSorted {
  channels: any;
}

class SiteOptionsSorted extends React.Component<ISiteOptionsSorted, {}> {
  public render() {

    let sortedSites = this.props.sites.map( site => site);

    sortedSites.sort((first, second) => {
      if ( first.name.toLowerCase() === second.name.toLowerCase() ) {
        return 0;
      }
      if ( first.name.toLowerCase() < second.name.toLowerCase() ) {
        return -1;
      } else {
        return 1;
      }
    });

    return (
      sortedSites.map( (el, idx) =>
        <option value={el.id} key={idx}>{el.name}</option>
      )
    );
  }
}

class ChannelOptionsSorted extends React.Component<IChannelOptionsSorted, {}> {
  public render() {

    let sortedChannels = this.props.channels.map( channel => channel);

    sortedChannels.sort((first, second) => {
      if ( first.name.toLowerCase() === second.name.toLowerCase() ) {
        return 0;
      }
      if ( first.name.toLowerCase() < second.name.toLowerCase() ) {
        return -1;
      } else {
        return 1;
      }
    });

    return (
      sortedChannels.map( (el, idx) =>
        <option value={el.id} key={idx}>{el.name}</option>
      )
    );
  }
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
        <h4 style={{marginBottom: 20}}>Add Supporting Channel to Project</h4>
        <Form horizontal>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Site:
            </Col>
            <Col sm={6}>
              <select id='selectSite' className='form-control' onChange={(e) => {
                const selectElement = (e.target as HTMLSelectElement);
                this.siteId = selectElement.value;
                this.siteName = _.head(selectElement.selectedOptions).label;
                this.props.getChannelsForSite(selectElement.value);
              }} >
                <SiteOptionsSorted sites={this.props.sites}/>
              </select>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Channel:
            </Col>
            <Col sm={6}>
              <select id='selectChannel' className='form-control' onChange={(e) => {
                const selectElement = (e.target as HTMLSelectElement);
                this.channelId = selectElement.value;
                this.channelName = _.head(selectElement.selectedOptions).label;
              }} >
                <ChannelOptionsSorted channels={this.props.channels} />
              </select>
            </Col>
          </FormGroup>
          {/*<FormGroup>*/}
            {/*<Col sm={4} componentClass={ControlLabel}>*/}
              {/*Type:*/}
            {/*</Col>*/}
            {/*<Col sm={6}>*/}
              {/*<FormControl type='text' onChange={(e) => this.setState({ channelType: (e.target as HTMLInputElement).value })} value={this.state.channelType}></FormControl>*/}
            {/*</Col>*/}
          {/*</FormGroup>*/}
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button id='btnApproveAddChannelModal' bsStyle='primary' onClick={() => this.addChannelClicked()} >
          Add
        </Button>
        <Button id='btnCancelAddChannelModal' onClick={() => this.props.cancelClicked()}>
          Cancel
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
    } as ISiteChannelInfo);
  }
}