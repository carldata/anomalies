import * as React from 'react';
import { Modal, Button, Form, FormGroup, FormControl, Col, ControlLabel, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { projectScreenActionCreators } from '../../action-creators';
import * as _ from 'lodash';
import { IProject, IProjectSupportingChannel, IProjectsScreenState } from '../../state';
import { ISite, IChannel } from '../../../model';
import { IState } from '../../../state';

interface IAddProjectModalComponentProps {
  showModal: boolean;
  sites: ISite[];
  channels: IChannel[];
}

interface IAddProjectModalComponentActionCreators {
  addProject: (e: IProject) => any;
  cancelModal: () => any;
  getChannels: (siteId: string) => any;
}

interface IAddProjectModalComponentState {
  name: string;
}

class AddProjectModalComponent extends React.Component<IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators, IAddProjectModalComponentState> {
  private siteId: string;
  private site: string;
  private rawId: string;
  private raw: string;
  private finalId: string;
  private final: string;

  constructor(props: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    super(props);

    this.state = {
      name: '',
    } as IAddProjectModalComponentState;

    this.approveAddProject = this.approveAddProject.bind(this);
  }

  public componentWillReceiveProps(nextProps: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    this.siteId = _.isEmpty(nextProps.sites) ? '' : _.head(nextProps.sites).id;
    this.site = _.isEmpty(nextProps.sites) ? '' : _.head(nextProps.sites).id; // todo chage it to name when UI and projects will be adjusted
    const channelId = _.isEmpty(nextProps.channels) ? '' : _.head(nextProps.channels).id;
    this.rawId = channelId;
    this.raw = channelId; // todo change it to name of channel later
    this.finalId = channelId;
    this.final = channelId; // todo change it to name of channel later
  }

  public render() {
    return <Modal show={this.props.showModal} onHide={() => this.props.cancelModal()}>
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
              <select id='selectProjectSite' className='form-control' onChange={(e) => {
                const selectElement = e.target as HTMLSelectElement;
                // selectElement.options[selectElement.selectedIndex].innerText;
                this.siteId = selectElement.value;
                this.site = selectElement.value; // todo later change it to selected option name
                this.props.getChannels(selectElement.value);
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
              <select id='selectChannelsRaw' className='form-control' onChange={(el) => {
                const selectRawChannel = el.target as HTMLSelectElement;
                // selectRawChannel.options[selectRawChannel.selectedIndex].innerText;
                this.rawId = selectRawChannel.value;
                this.raw = selectRawChannel.value; // todo change it later to element name
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
              <select id='selectChannelsFinal' className='form-control' onChange={(el) => {
                const selectFinalChannel = el.target as HTMLSelectElement;
                // selectFinalChannel.options[selectFinalChannel.selectedIndex].innerText;
                this.finalId = selectFinalChannel.value;
                this.final = selectFinalChannel.value; // todo change it later to element name
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
        <Button id='btnCancelAddProjectModal' onClick={() => this.props.cancelModal()}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>;
  }

  private approveAddProject() {
    const project: IProject = {
      id: '',
      name: this.state.name,
      site: this.site,
      siteId: this.siteId,
      final: this.final,
      finalId: this.finalId,
      raw: this.raw,
      rawId: this.rawId,
      supportingChannels: [],
    };

    this.props.addProject(project);
  }
}

function mapStateToProps(state: IState) {
  return {
    showModal: state.projectsScreen.showModal,
    sites: state.projectsScreen.sites,
    channels: state.projectsScreen.channels,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    addProject: projectScreenActionCreators.addProjectStart,
    cancelModal: projectScreenActionCreators.cancelShowAddProject,
    getChannels: projectScreenActionCreators.getChannels,
  }, dispatch);
}

export const AddProjectModal = connect(mapStateToProps, matchDispatchToProps)(AddProjectModalComponent);
