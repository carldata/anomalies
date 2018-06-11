import * as _ from 'lodash';
import * as React from 'react';
import { Modal, Button, Form, FormGroup, FormControl, Col, ControlLabel, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { projectScreenActionCreators } from '../../action-creators';
import { IChannel, IProject, ISite } from '../../../models';
import { IState } from '../../../state';

interface IAddProjectModalComponentProps {
  showModal: boolean;
  sites: ISite[];
  channels: IChannel[];
}

interface IAddProjectModalComponentActionCreators {
  addProject: (p: IProject) => any;
  cancelModal: () => any;
  getChannels: (siteId: string) => any;
}

interface IAddProjectModalComponentState {
  projectName: string;
  siteId: string;
  siteName: string;
  rawChannelId: string;
  rawChannelName: string;
  finalChannelId: string;
  finalChannelName: string;
}

class AddProjectModalComponent extends React.Component<IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators, IAddProjectModalComponentState> {
  constructor(props: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    super(props);
    this.state = {
      projectName: '',
    } as IAddProjectModalComponentState;

    this.approveAddProject = this.approveAddProject.bind(this);
  }

  private modalIsShown = (nextProps: IAddProjectModalComponentProps): boolean => this.props.showModal && nextProps.showModal;
  private modalWillAppear = (nextProps: IAddProjectModalComponentProps): boolean => !this.props.showModal && nextProps.showModal;

  public componentWillReceiveProps(nextProps: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    if (this.modalWillAppear(nextProps)) {
      const channel: IChannel = _.isArray(nextProps.channels) && !_.isEmpty(nextProps.channels) ?
        _.head(nextProps.channels) : { id: '0', name: '' } as IChannel;
      this.setState({
        projectName: '',
        siteId: _.isEmpty(nextProps.sites) ? '' : _.head(nextProps.sites).id,
        siteName: _.isEmpty(nextProps.sites) ? '' : _.head(nextProps.sites).name,
        finalChannelId: channel.id,
        finalChannelName: channel.name,
        rawChannelId: channel.id,
        rawChannelName: channel.name,
      });
    } else if (this.modalIsShown(nextProps)) {
      const channel: IChannel = _.isArray(nextProps.channels) && !_.isEmpty(nextProps.channels) ?
        _.head(nextProps.channels) : { id: '0', name: '' } as IChannel;
      this.setState({
        finalChannelId: channel.id,
        finalChannelName: channel.name,
        rawChannelId: channel.id,
        rawChannelName: channel.name,
      });
    }
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
                onChange={(e) => this.setState({ projectName: (e.target as HTMLInputElement).value })}
                value={this.state.projectName}></FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Site:
            </Col>
            <Col sm={6}>
              <select id='selectProjectSite' className='form-control' onChange={(e) => {
                const selectElement = e.target as HTMLSelectElement;
                this.setState({
                  siteId: selectElement.value,
                  siteName: _.head(selectElement.selectedOptions).label,
                });
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
                this.setState({
                  rawChannelId: selectRawChannel.value,
                  rawChannelName: _.head(selectRawChannel.selectedOptions).label,
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
              <select id='selectChannelsFinal' className='form-control' onChange={(el) => {
                const selectFinalChannel = el.target as HTMLSelectElement;
                this.setState({
                  finalChannelId: selectFinalChannel.value,
                  finalChannelName: _.head(selectFinalChannel.selectedOptions).label,
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
        <Button id='btnCancelAddProjectModal' onClick={() => this.props.cancelModal()}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>;
  }

  private approveAddProject() {
    const project: IProject = {
      id: '',
      projectName: this.state.projectName,
      siteName: this.state.siteName,
      siteId: this.state.siteId,
      finalChannelName: this.state.finalChannelName,
      finalChannelId: this.state.finalChannelId,
      rawChannelName: this.state.rawChannelName,
      rawChannelId: this.state.rawChannelId,
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
