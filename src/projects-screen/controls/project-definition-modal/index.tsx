import * as _ from 'lodash';
import * as React from 'react';
import { Modal, Button, Form, FormGroup, FormControl, Col, ControlLabel, ButtonGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from 'redux';
import { ISite, IChannel, IProject } from '@models/.';
import { IState } from '@app-state/.';
import {
  IHideProjectDefintionModalActionCreator,
  hideProjectProjectDefinitionModal,
  getChannelsForSite,
  IGetChannelsForSiteActionCreator,
} from '../../action-creators';
import { EnumProjectModalMode } from '../../models/projects-screen-state';

interface IAddProjectModalComponentProps {
  mode: EnumProjectModalMode;
  editedProject: IProject;
  sites: ISite[];
  channels: IChannel[];
}

interface IAddProjectModalComponentActionCreators {
  getChannels: IGetChannelsForSiteActionCreator;
  hide: IHideProjectDefintionModalActionCreator;
}

interface IAddProjectModalComponentState {
  id: string;
  projectName: string;
  siteId: string;
  siteName: string;
  rawChannelId: string;
  rawChannelName: string;
  finalChannelId: string;
  finalChannelName: string;
  siteChanged: boolean;
}

class ProjectDefinitionModalComponent extends React.Component<IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators, IAddProjectModalComponentState> {
  constructor(props: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    super(props);
    this.state = {
      projectName: '',
    } as IAddProjectModalComponentState;

    this.approveAddProject = this.approveAddProject.bind(this);
  }

  private modalIsShown = (nextProps: IAddProjectModalComponentProps): boolean =>
    (this.props.mode !== EnumProjectModalMode.Hidden) && (nextProps.mode !== EnumProjectModalMode.Hidden)
  private modalWillAppear = (nextProps: IAddProjectModalComponentProps): boolean =>
    (this.props.mode === EnumProjectModalMode.Hidden) && (nextProps.mode !== EnumProjectModalMode.Hidden)

  public componentWillReceiveProps(nextProps: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    if (this.modalWillAppear(nextProps)) {
      const id = _.isEmpty(nextProps.editedProject.id) ? '' : nextProps.editedProject.id;
      const projectName = _.isEmpty(nextProps.editedProject.projectName) ? '' : nextProps.editedProject.projectName;
      const siteId = _.isEmpty(nextProps.editedProject.siteId) ? '' : nextProps.editedProject.siteId;
      const siteName = _.isEmpty(nextProps.editedProject.siteName) ? '' : nextProps.editedProject.siteName;
      const finalChannelId = _.isEmpty(nextProps.editedProject.finalChannelId) ? '' : nextProps.editedProject.finalChannelId;
      const finalChannelName = _.isEmpty(nextProps.editedProject.finalChannelName) ? '' : nextProps.editedProject.finalChannelName;
      const rawChannelId = _.isEmpty(nextProps.editedProject.rawChannelId) ? '' : nextProps.editedProject.rawChannelId;
      const rawChannelName = _.isEmpty(nextProps.editedProject.rawChannelName) ? '' : nextProps.editedProject.rawChannelName;

      this.setState({
        id,
        projectName,
        siteId,
        siteName,
        finalChannelId,
        finalChannelName,
        rawChannelId,
        rawChannelName,
        siteChanged: false,
      });
    } else if (this.modalIsShown(nextProps)) {
      let finalChannelId;
      let finalChannelName;
      let rawChannelId;
      let rawChannelName;

      const channel: IChannel = _.isArray(nextProps.channels) && !_.isEmpty(nextProps.channels) ?
        _.head(nextProps.channels) : { id: '0', name: '' } as IChannel;

      if (nextProps.mode === EnumProjectModalMode.Edit) {
        finalChannelId = this.state.finalChannelId;
        finalChannelName = this.state.finalChannelName;
        rawChannelId = this.state.rawChannelId;
        rawChannelName = this.state.rawChannelName;
      }

      if (_.isEmpty(finalChannelId) || this.state.siteChanged === true) {
        finalChannelId = channel.id;
        finalChannelName = channel.name;
      }

      if (_.isEmpty(rawChannelId) || this.state.siteChanged === true) {
        rawChannelId = channel.id;
        rawChannelName = channel.name;
      }

      if(_.isEmpty(this.state.siteId)) {
        const site = _.head(nextProps.sites);
        this.setState({
          siteId: site.id,
          siteName: site.name,
        });
      }

      this.setState({
        finalChannelId,
        finalChannelName,
        rawChannelId,
        rawChannelName,
        siteChanged: false,
      });
    }
  }

  public render() {
    let okButton;
    if (this.props.mode === EnumProjectModalMode.AddNew) {
      okButton = <Button id='btnApproveAddProjectModal' bsStyle='primary' onClick={this.approveAddProject}>Add Project</Button>;
    } else if (this.props.mode === EnumProjectModalMode.Edit) {
      okButton = <Button id='btnApproveAddProjectModal' bsStyle='primary' onClick={this.approveAddProject}>Approve Edit</Button>;
    }

    return <Modal show={this.props.mode !== EnumProjectModalMode.Hidden} onHide={() => this.props.hide(null, false)}>
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
                onChange={(e) => this.setState({ projectName: (e.target as HTMLInputElement).value, siteChanged: false })}
                value={this.state.projectName}>
              </FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={4} componentClass={ControlLabel}>
              Site:
            </Col>
            <Col sm={6}>
              <select id='selectProjectSite' className='form-control' value={this.state.siteId} onChange={(e) => {
                const selectElement = e.target as HTMLSelectElement;
                this.setState({
                  siteId: selectElement.value,
                  siteName: _.head(selectElement.selectedOptions).label,
                  siteChanged: true,
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
              <select id='selectChannelsRaw' className='form-control' value={this.state.rawChannelId} onChange={(el) => {
                const selectRawChannel = el.target as HTMLSelectElement;
                this.setState({
                  rawChannelId: selectRawChannel.value,
                  rawChannelName: _.head(selectRawChannel.selectedOptions).label,
                  siteChanged: false,
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
              <select id='selectChannelsFinal' className='form-control' value={this.state.finalChannelId} onChange={(el) => {
                const selectFinalChannel = el.target as HTMLSelectElement;
                this.setState({
                  finalChannelId: selectFinalChannel.value,
                  finalChannelName: _.head(selectFinalChannel.selectedOptions).label,
                  siteChanged: false,
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

        {okButton}

        <Button id='btnCancelAddProjectModal' onClick={() => this.props.hide(null, false)}>
          Cancel
        </Button>
      </Modal.Footer>
    </Modal>;
  }

  private approveAddProject() {
    const project: IProject = {
      id: _.isEmpty(this.state.id) ? '' : this.state.id,
      projectName: this.state.projectName,
      siteName: this.state.siteName,
      siteId: this.state.siteId,
      finalChannelName: this.state.finalChannelName,
      finalChannelId: this.state.finalChannelId,
      rawChannelName: this.state.rawChannelName,
      rawChannelId: this.state.rawChannelId,
      supportingChannels: [],
    };

    this.props.hide(project, true);
  }
}

function mapStateToProps(state: IState) {
  return {
    mode: state.projectsScreen.mode,
    sites: state.projectsScreen.sites,
    channels: state.projectsScreen.channels,
    editedProject: state.projectsScreen.editedProject,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({
    getChannels: getChannelsForSite,
    hide: hideProjectProjectDefinitionModal,
  }, dispatch);
}

export const ProjectDefinitionModal = connect(mapStateToProps, matchDispatchToProps)(ProjectDefinitionModalComponent);
