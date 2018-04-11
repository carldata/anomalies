import * as React from 'react';
import * as ReactDataGrid from 'react-data-grid'
import { IState } from '../../../state';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IDataGridState, IDataGridRow } from './state';
import _ = require('lodash');
import update from 'immutability-helper';
import { Button } from 'react-bootstrap';

interface IDataGridComponentProps {
  gridState: IDataGridState;
}

interface IDataGridComponentActionCreators {
  
}

interface IDataGridComponentState{
  selectedIndexes: any[];
  series: IDataGridRow[];
}

interface IRowRendererProps{
  row: IDataGridRow;
}

export class DataGrid extends React.Component<IDataGridComponentProps & IDataGridComponentActionCreators, IDataGridComponentState> {
  canvasContext: any;
  canvas: any;
  _columns: { key: string; name: string; editable?: boolean, width?: number, resizable?: boolean }[];

  constructor(props: IDataGridComponentProps & IDataGridComponentActionCreators, context: any) {
    super(props, context);
    this._columns = [
      { key: 'date', name: 'Date', resizable: true },
      { key: 'rawValue', name: 'Raw Value', resizable: true },
      { key: 'editedValue', name: 'Edited Value', editable: true, resizable: true },
      { key: 'fixedValue', name: 'Fixed Value', resizable: true } ];

      this.state = { selectedIndexes: [], series: [] };
  }
  
  componentWillReceiveProps(props: IDataGridComponentProps) {
    this.setState({series: props.gridState.series});

    var data = {
      rows: props.gridState.series,
      columns: this._columns
    }

    // if(data.rows.length != 0) {
    //   this.setState({selectedIndexes: [], series: this.formatColumns(data)}); 
    // }
  }

  rowGetter = (i: any) => {
    return this.state.series[i];
  };

  formatColumns(data: any) {
    const gridWidth = parseInt(document.querySelector(".react-grid-Container").clientWidth, 10); //selector for grid
    let combinedColumnWidth = 0;

    for (let i = 0; i < data.columns.length; i++) {
      data.columns[i].width = this.getTextWidth(data, i);
      combinedColumnWidth += data.columns[i].width;
    }

    if (combinedColumnWidth < gridWidth) {
      data.columns = this.distributeRemainingSpace(
        combinedColumnWidth,
        data.columns,
        gridWidth
      );
    }

    this._columns = data.columns;

    return data.rows;
  }

  getTextWidth(data: any, i: any) {
    const rowValues = [];

    const reducer = (a: any, b: any) => {
      if(_.isUndefined(a)) {
        a = ' ';
      }

      if(_.isUndefined(b)) {
        b = ' ';
      }

      a.length > b.length ? a : b
    };

    const cellPadding = 16;
    const arrowWidth = 18;
    let longestCellData,
      longestCellDataWidth,
      longestColName,
      longestColNameWidth,
      longestString;

    for (let row of data.rows) {
      rowValues.push(row[data.columns[i].key]);
    }


    longestCellData = rowValues.reduce(reducer);
    longestColName = data.columns[i].name;
    longestCellDataWidth = Math.ceil(
      this.getCanvas().measureText(longestCellData).width
    );
    longestColNameWidth =
      Math.ceil(this.getCanvas("bold ").measureText(longestColName).width) +
      arrowWidth;

    longestString = Math.max(longestCellDataWidth, longestColNameWidth);

    return longestString + cellPadding;
  }

  getCanvas(fontWeight = "") {
    if (!this.canvas) {
      this.canvas = document.createElement("canvas");
      this.canvasContext = this.canvas.getContext("2d");
    }
    this.canvasContext.font = `${fontWeight}16px sans-serif`;

    return this.canvasContext;
  }

  distributeRemainingSpace(combinedColumnWidth: any, columns: any, gridWidth: any) {
    const spaceLeftOver = gridWidth - combinedColumnWidth;
    const remainder = spaceLeftOver % columns.length;
    const equalSpaceLeft = spaceLeftOver - remainder;

    columns[0].width += remainder; //any remaining space after distributing equally should go on first column

    for (let col of columns) {
      col.width += equalSpaceLeft / columns.length;
    }
    return columns;
  }

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

  copyRawToEdited = () => {
    let selectedIndexes = this.state.selectedIndexes;
    let newSeries = _.cloneDeep(this.state.series)
    for(let index = 0; index < selectedIndexes.length; index++) {
      let selectedIndex = selectedIndexes[index];
      newSeries[selectedIndex].editedValue = newSeries[selectedIndex].rawValue;
    }
    
    this.setState({ series: newSeries, selectedIndexes: []});
  };

  copyFixedToEdited = () => {
    let selectedIndexes = this.state.selectedIndexes;
    let newSeries = _.cloneDeep(this.state.series)
    for(let index = 0; index < selectedIndexes.length; index++) {
      let selectedIndex = selectedIndexes[index];
      newSeries[selectedIndex].editedValue = newSeries[selectedIndex].fixedValue;
    }
    
    this.setState({series: newSeries, selectedIndexes: []});
  };

  render() {
    return  (
      <div>
        <ReactDataGrid
          enableCellSelect={true}
          columns={this._columns}
          rowGetter={this.rowGetter}
          rowsCount={this.props.gridState.series.length}
          minHeight={950} 
          // minHeight={this.props.gridState.series.length * 35 + 50} 
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
          onGridRowsUpdated={this.handleGridRowsUpdated} />

          <Button bsStyle='primary' onClick={() => this.copyRawToEdited() }>Copy Selected Raw Values to Edited</Button>
          <Button bsStyle='primary' onClick={() => this.copyFixedToEdited() }>Copy Selected Fixed Values to Edited</Button>
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
    if(!_.isUndefined(this.props.row.fixedValue)) {
      color = '#ff0000';
    }

    return color;
  };
  
  render() {
    return (<div style={this.getRowStyle()}><ReactDataGrid.Row  {...this.props}/></div>);
  }
}

export default connect(mapStateToProps, matchDispatchToProps)(DataGrid);

