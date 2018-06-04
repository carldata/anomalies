import * as React from 'react';
import { Modal, Button, Form, FormGroup, FormControl, Col, ControlLabel, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { projectScreenActionCreators } from '../../action-creators';
import * as _ from 'lodash';
import { IProject, IProjectSupportingChannel } from '../../state';
import { ISite, IChannel } from '../../../model';

interface IAddProjectModalComponentProps {
  showModal: boolean;
  id: string;
  name: string;
  site: string;
  raw: string;
  final: string;
  sites: ISite[];
  channels: IChannel[];
}

interface IAddProjectModalComponentActionCreators {
  addProject: (e: IProject) => any;
  hideModal?: () => any;
}

interface IAddProjectModalComponentState {
  showModal: boolean;
  name: string;
  site: string;
  siteId: string;
  raw: string;
  rawId: string;
  final: string;
  finalId: string;
}

class AddProjectModalComponent extends React.Component<IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators, IAddProjectModalComponentState> {
  constructor(props: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    super(props);

    this.state = {
      showModal: false,
      name: '',
      site: '',
      siteId: '',
      raw: '',
      rawId: '',
      final: '',
      finalId: '',
    } as IAddProjectModalComponentState;

    this.approveAddProject = this.approveAddProject.bind(this);
  }

  public componentWillReceiveProps(nextProps: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    // this.setState({
    //   showModal: nextProps.showModal,
    //   name: nextProps.name,
    //   site: nextProps.site,
    //   raw: nextProps.raw,
    //   final: nextProps.final,
    // });

    this.setState({
      showModal: nextProps.showModal,
    });
  }

  public render() {
    return <Modal show={this.state.showModal} onHide={() => this.props.hideModal()}>
      <Modal.Body>
        <Form horizontal>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Name:
            </Col>
            <Col sm={6}>
              <FormControl id='txtProjectName'
                type='text'
                placeholder='Enter Name'
                onChange={(e) => this.setState({ name: (e.target as HTMLInputElement).value })}
                value={this.state.name}></FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Site:
            </Col>
            <Col sm={6}>
              <select id='selectProjectSite' className='form-control' value={this.state.siteId} onChange={(e) => {
                const selectElement = e.target as HTMLSelectElement;
                console.log(selectElement.value);
                console.log(selectElement.options[selectElement.selectedIndex].innerText);
                this.setState({
                  siteId: selectElement.value,
                  site: selectElement.options[selectElement.selectedIndex].innerText,
                });
              }} >
                {
                  this.props.sites.map((el, idx) => (<option value={el.id} key={idx}>{el.name}</option>))
                }
              </select>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Source Channel:
            </Col>
            <Col sm={6}>
              {/* <FormControl id='txtProjectSourceChannel'
                type='text'
                placeholder='Enter Channel'
                onChange={(e) => this.setState({ raw: (e.target as HTMLInputElement).value })}
                value={this.state.raw} ></FormControl> */}
              <select id='selectChannelsRaw' className='form-control' value={this.state.rawId} onChange={(el) => {
                const selectRawChannel = el.target as HTMLSelectElement;
                console.log(selectRawChannel.value);
                console.log(selectRawChannel.options[selectRawChannel.selectedIndex].innerText);
                this.setState({
                  raw: selectRawChannel.options[selectRawChannel.selectedIndex].innerText,
                  rawId: selectRawChannel.value,
                });
              }}>
                {
                  this.props.channels.map((el, idx) => (<option value={el.id} key={idx}>{el.name}</option>))
                }
              </select>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Final Channel:
            </Col>
            <Col sm={6}>
              {/* <FormControl id='txtProjectFinalChannel'
                type='text'
                placeholder='Enter Channel'
                onChange={(e) => this.setState({ final: (e.target as HTMLInputElement).value })}
                value={this.state.final} ></FormControl> */}
              <select id='selectChannelsFinal' className='form-control' value={this.state.finalId} onChange={(el) => {
                const selectFinalChannel = el.target as HTMLSelectElement;
                console.log(selectFinalChannel.value);
                console.log(selectFinalChannel.options[selectFinalChannel.selectedIndex].innerText);
                this.setState({
                  final: selectFinalChannel.options[selectFinalChannel.selectedIndex].innerText,
                  finalId: selectFinalChannel.value,
                });
              }}>
                {
                  this.props.channels.map((el, idx) => (<option value={el.id} key={idx}>{el.name}</option>))
                }
              </select>
            </Col>
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button id='btnApproveAddProjectModal' bsStyle='primary' onClick={this.approveAddProject} >
          Add Project
        </Button>
        <Button id='btnCancelAddProjectModal' onClick={() => this.props.hideModal()}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>
  }

  private approveAddProject() {
    const project: IProject = {
      id: this.props.id,
      name: this.state.name,
      site: this.state.site,
      siteId: '',
      final: this.state.final,
      finalId: '',
      raw: this.state.raw,
      rawId: '',
      supportingChannels: [],
    };

    this.props.addProject(project);
    this.props.hideModal();
  }
}

export const AddProjectModal = AddProjectModalComponent;
