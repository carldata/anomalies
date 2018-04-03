//http://adazzle.github.io/react-data-grid/examples.html#/customRowRenderer
import * as React from 'react';
import * as ReactDataGrid from 'react-data-grid'

class DataGrid extends React.Component {
  _columns: { key: string; name: string; }[];
  _rows: { id: number; title: string; count: number; }[];
  constructor(props: any, context: any) {
    super(props, context);
    this.createRows();
    this._columns = [
      { key: 'id', name: 'ID' },
      { key: 'title', name: 'Title' },
      { key: 'count', name: 'Count' } ];

    this.state = null;
  }

  createRows = () => {
    let rows = [];
    for (let i = 1; i < 1000000; i++) {
      rows.push({
        id: i,
        title: 'Title ' + i,
        count: i
      });
    }

    this._rows = rows;
  };

  rowGetter = (i: any) => {
    return this._rows[i];
  };

  render() {
    return  (
      <ReactDataGrid
        columns={this._columns}
        rowGetter={this.rowGetter}
        rowsCount={this._rows.length}
        minHeight={500} />);
  }
};

export default DataGrid;