//http://adazzle.github.io/react-data-grid/examples.html#/customRowRenderer
import * as React from 'react';
import * as ReactDataGrid from 'react-data-grid'
import { IState } from '../../../state';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IDataGridState } from './state';
import _ = require('lodash');

interface IDataGridComponentProps {
  gridState: IDataGridState;
}

interface IDataGridComponentActionCreators {
  
}

export class DataGrid extends React.Component<IDataGridComponentProps & IDataGridComponentActionCreators> {
  _columns: { key: string; name: string; }[];
  _rows: any;
  constructor(props: any, context: any) {
    super(props, context);
    this._columns = [
      { key: 'date', name: 'Date' },
      { key: 'rawValue', name: 'Raw Value' },
      { key: 'fixedValue', name: 'Fixed Value' } ];

    this.state = null;
  }

  rowGetter = (i: any) => {
    return this.props.gridState.series[i];
  };

  render() {
    return  (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this.props.gridState.series.length}
        minHeight={500} />);
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

export default connect(mapStateToProps, matchDispatchToProps)(DataGrid);