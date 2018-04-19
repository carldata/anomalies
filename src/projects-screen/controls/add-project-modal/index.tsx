import * as React from 'react';
import { Modal, Button, Form, FormGroup, FormControl, Col, ControlLabel } from 'react-bootstrap';
import { connect } from 'react-redux';
import { bindActionCreators, Dispatch } from "redux";
import { projectScreenActionCreators } from '../../action-creators';
import * as _ from 'lodash';

export interface IModalProject { // consider using IProject from general state
  id: string;
  name: string;
  site: string;
  raw: string;
  final: string;
}

interface IAddProjectModalComponentProps {
  showModal: boolean;
  id: string;
  name: string;
  site: string;
  raw: string;
  final: string;
}

interface IAddProjectModalComponentActionCreators {
  addProject?: (e: string) => any;
}

interface IAddProjectModalComponentState {
  showModal: boolean;
  name: string;
  site: string;
  raw: string;
  final: string;
}

class AddProjectModalComponent extends React.Component<IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators, IAddProjectModalComponentState> {
  constructor(props: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators){
    super(props)

    this.state = {
      showModal: true,
      name: '',
      site: '',
      raw: '',
      final: ''
    } as IAddProjectModalComponentState;

    this.hideModal = this.hideModal.bind(this);
    this.approveAddProject = this.approveAddProject.bind(this);
  }

  componentWillReceiveProps(nextProps: IAddProjectModalComponentProps & IAddProjectModalComponentActionCreators) {
    this.setState({
      showModal: nextProps.showModal,
      name: nextProps.name,
      site: nextProps.site,
      raw: nextProps.raw,
      final: nextProps.final
    });
  }

  render() {
    return <Modal show={this.state.showModal} onHide={this.hideModal}>
      <Modal.Body>
        <Form horizontal>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>
              Name:
            </Col>
            <Col sm={10}>
              <FormControl type='text' onChange={(e) => this.setState({ name: (e.target as HTMLInputElement).value })} value={this.state.name}></FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>
              Site:
            </Col>
            <Col sm={10}>
              <FormControl type='text' onChange={(e) => this.setState({ site: (e.target as HTMLInputElement).value })} value={this.state.site}></FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>
              Raw:
            </Col>
            <Col sm={10}>
              <FormControl type='text' onChange={(e) => this.setState({ raw: (e.target as HTMLInputElement).value })} value={this.state.raw} ></FormControl>
            </Col>
          </FormGroup>
          <FormGroup>
            <Col sm={2} componentClass={ControlLabel}>
              Final:
            </Col>
            <Col sm={10}>
              <FormControl type='text' onChange={(e) => this.setState({ final: (e.target as HTMLInputElement).value })} value={this.state.final} ></FormControl>
            </Col>
          </FormGroup>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button id='btnCancelAddProjectModal' onClick={this.hideModal}>
          Cancel
        </Button>
        <Button id='btnApproveAddProjectModal' bsStyle='primary' onClick={this.approveAddProject} >
          Add
        </Button>
      </Modal.Footer>
    </Modal>
  }

  hideModal() {
    this.setState({ showModal: false })
  }

  approveAddProject(){
    let project: IModalProject = {
      id: this.props.id,
      name: this.state.name,
      site:  this.state.site,
      final: this. state.final,
      raw: this.state.raw
    };

    console.log('project to add/edit: ', project);
    this.props.addProject("cokolwiek")
    this.hideModal();
  }
}

export const AddProjectModal = AddProjectModalComponent;
