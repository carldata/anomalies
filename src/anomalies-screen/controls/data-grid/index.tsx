import * as React from 'react';
import * as ReactDataGrid from 'react-data-grid'
import { IState } from '../../../state';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IDataGridState, IDataGridRow } from './state';
import _ = require('lodash');
import update from 'immutability-helper';

interface IDataGridComponentProps {
  gridState: IDataGridState;
}

interface IDataGridComponentActionCreators {
 
}

interface IDataGridComponentState{
  selectedIndexes: any[];
}

interface IRowRendererProps{
  row: IDataGridRow;
}

export class DataGrid extends React.Component<IDataGridComponentProps & IDataGridComponentActionCreators, IDataGridComponentState> {
  _columns: { key: string; name: string; editable?: boolean }[];

  constructor(props: IDataGridComponentProps & IDataGridComponentActionCreators, context: any) {
    super(props, context);
    this._columns = [
      { key: 'date', name: 'Date', editable: true },
      { key: 'rawValue', name: 'Raw Value', editable: true },
      { key: 'editedValue', name: 'Edited Value', editable: true },
      { key: 'fixedValue', name: 'Fixed Value', editable: true } ];

      this.state = { selectedIndexes: [] };
  }

  rowGetter = (i: any) => {
    return this.props.gridState.series[i];
  };

  handleGridRowsUpdated = ({ fromRow, toRow, updated }: any) => {
    for (let i = fromRow; i <= toRow; i++) {
      let rowToUpdate = this.props.gridState.series[i];
      let updatedRow = update(rowToUpdate, {$merge: updated});
      this.props.gridState.series[i] = updatedRow;
    }
  };

  onRowsSelected = (rows: any) => {
    this.setState({selectedIndexes: this.state.selectedIndexes.concat(rows.map( (r: any) => r.rowIdx))});
  };

  onRowsDeselected = (rows: any) => {
    let rowIndexes = rows.map((r: any) => r.rowIdx);
    this.setState({selectedIndexes: this.state.selectedIndexes.filter(i => rowIndexes.indexOf(i) === -1 )});
  };

  render() {
    return  (
      <ReactDataGrid
        enableCellSelect={true}
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.props.gridState.series.length}
        minHeight={700} 
        rowSelection={{
          showCheckbox: true,
          enableShiftSelect: true,
          onRowsSelected: this.onRowsSelected,
          onRowsDeselected: this.onRowsDeselected,
          selectBy: {
            indexes: this.state.selectedIndexes
          }
        }}
        rowRenderer={RowRenderer} 
        onGridRowsUpdated={this.handleGridRowsUpdated} />);
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
  //row: ReactDataGrid.Row;
  getRowStyle = () => {
    return {
      color: this.getRowBackground()
    };
  };

  getRowBackground = () => {
    let color = 'green'
    if(!_.isUndefined(this.props.row.fixedValue)) {
      color = '#ff0000';
    }

    return color;
  };
  //ref={ node => this.row = node }
  render() {
    return (<div style={this.getRowStyle()}><ReactDataGrid.Row  {...this.props}/></div>);
  }
}

export default connect(mapStateToProps, matchDispatchToProps)(DataGrid);

