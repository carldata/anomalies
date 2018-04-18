import * as React from 'react';
import * as ReactDataGrid from 'react-data-grid'
import { IState } from '../../../state';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IDataGridState, IDataGridRow } from './state';
import _ = require('lodash');
import update from 'immutability-helper';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup, Row, Col } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';

interface IDataGridComponentProps {
  gridState: IDataGridState;
}

interface IDataGridComponentActionCreators {

}

interface IDataGridComponentState {
  selectedIndexes: any[];
  series: IDataGridRow[];
  selectedKey: any;
}

interface IRowRendererProps {
  row: IDataGridRow;
}

export class DataGrid extends React.Component<IDataGridComponentProps & IDataGridComponentActionCreators, IDataGridComponentState> {
  canvasContext: any;
  canvas: any;
  _columns: { key: string; name: string; editable?: boolean, width?: number, resizable?: boolean }[];

  constructor(props: IDataGridComponentProps & IDataGridComponentActionCreators, context: any) {
    super(props, context);
    this._columns = [
      { key: 'date', name: 'Timestamp' },
      { key: 'rawValue', name: 'Raw' },
      { key: 'editedValue', name: 'Final', editable: true },
      { key: 'fixedValue', name: 'Fixed' }];

    this.state = { selectedIndexes: [], series: [], selectedKey: '' };
  }

  componentWillReceiveProps(props: IDataGridComponentProps) {
    this.setState({ series: props.gridState.series, selectedIndexes: [] });

    var data = {
      rows: props.gridState.series,
      columns: this._columns
    }
  }

  rowGetter = (i: any) => {
    return this.state.series[i];
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }: any) => {
    let newSeries = _.cloneDeep(this.state.series)
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = newSeries[i];
      let updatedRow = update(rowToUpdate, { $merge: updated });
      newSeries[i] = updatedRow;
    }

    this.setState({ series: newSeries, selectedIndexes: this.state.selectedIndexes })
  };

  onRowsSelected = (rows: any) => {
    this.setState({ selectedIndexes: this.state.selectedIndexes.concat(rows.map((r: any) => r.rowIdx)) });
  };

  onRowsDeselected = (rows: any) => {
    let rowIndexes = rows.map((r: any) => r.rowIdx);
    this.setState({ selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1) });
  };

  copyRawToEdited = () => {
    let selectedIndexes = this.state.selectedIndexes;
    let newSeries = _.cloneDeep(this.state.series)
    for (let index = 0; index < selectedIndexes.length; index++) {
      let selectedIndex = selectedIndexes[index];
      newSeries[selectedIndex].editedValue = newSeries[selectedIndex].rawValue;
    }

    this.setState({ series: newSeries, selectedIndexes: [] });
  };

  copyFixedToEdited = () => {
    let selectedIndexes = this.state.selectedIndexes;
    let newSeries = _.cloneDeep(this.state.series)
    for (let index = 0; index < selectedIndexes.length; index++) {
      let selectedIndex = selectedIndexes[index];
      newSeries[selectedIndex].editedValue = newSeries[selectedIndex].fixedValue;
    }

    this.setState({ series: newSeries, selectedIndexes: [] });
  };

  render() {
    return (
      <div>
        <FormGroup>
          <ReactDataGrid
            enableCellSelect={true}
            columns={this._columns}
            rowGetter={this.rowGetter}
            rowsCount={this.state.series.length}
            minHeight={900}
            onGridRowsUpdated={this.handleGridRowsUpdated}
            rowSelection={{
              showCheckbox: true,
              enableShiftSelect: true,
              onRowsSelected: this.onRowsSelected,
              onRowsDeselected: this.onRowsDeselected,
              selectBy: {
                indexes: this.state.selectedIndexes
              }
            }}
            rowRenderer={RowRenderer} />
          <Row>
            <Col lg={3}>
              <Button bsStyle='primary' onClick={() => this.copyRawToEdited()}>Copy Raw to Final</Button>
            </Col>
            <Col lg={3}>
              <Button bsStyle='primary' onClick={() => this.copyFixedToEdited()}>Copy Fixed to Final</Button>
            </Col>
            <Col lg={6}>
              <div className='pull-right'>
                <CSVLink data={this.state.series}
                  filename={"series.csv"}
                  className="btn btn-primary"
                  target="_blank">
                  Export To CSV
              </CSVLink>
              </div>
            </Col>
          </Row>
        </FormGroup>
      </div>
    );
  }
};

function mapStateToProps(state: IState) {
  return {
    gridState: state.anomaliesScreen.gridState,
  };
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
  return bindActionCreators({

  }, dispatch);
}

class RowRenderer extends React.Component<IRowRendererProps> {
  getRowStyle = () => {
    return {
      color: this.getRowBackground()
    };
  };

  getRowBackground = () => {
    let color = 'green'
    if (!_.isUndefined(this.props.row.fixedValue)) {
      color = '#ff0000';
    }

    return color;
  };

  render() {
    return (<div style={this.getRowStyle()}><ReactDataGrid.Row  {...this.props} /></div>);
  }
}

export default connect(mapStateToProps, matchDispatchToProps)(DataGrid);

