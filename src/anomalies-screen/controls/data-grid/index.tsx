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

export class DataGrid extends React.Component<IDataGridComponentProps, IDataGridComponentActionCreators> {
  _columns: { key: string; name: string; }[];
  _rows: any;//{ id: number; title: string; count: number; }[];
  constructor(props: any, context: any) {
    super(props, context);
    this.createRows();
    this._columns = [
      { key: 'date', name: 'Date' },
      { key: 'rawvalue', name: 'Raw Value' },
      { key: 'anomalyvalue', name: 'Anomaly Value' } ];

    this.state = null;
  }

  createRows = () => {
    let rows = [];
    if(!_.isUndefined(this.props.gridState))
    {
      var series = this.props.gridState.series;
      if(series.length > 0)
      {
        for (let i = 1; i < series.length; i++) 
        {
          rows.push({
            date: series[i].date,
            rawvalue: series[i].rawValue,
            anomalyvalue: series[i].anomalyValue
          });
        }
      }
    }
    this._rows = rows;
  };

  rowGetter = (i: any) => {
    return this._rows[i];
  };

  render() {
    this.createRows();

    return  (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this._rows.length}
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