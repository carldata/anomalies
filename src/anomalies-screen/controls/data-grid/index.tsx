import * as _ from 'lodash';
import * as React from 'react';
import { FormGroup, Row, Col } from 'react-bootstrap';
import { CSVLink } from 'react-csv';
import * as ReactDataGrid from 'react-data-grid';
import { IDataGridRow } from './state';
import { RowRenderer } from './grid-renderer';

export interface IDataGridComponentProps {
  columns: ReactDataGrid.Column[];
  rows: IDataGridRow[];
}

interface IDataGridComponentState {
  selectedIndexes: any[];
}

interface IDataGridHeader {
  label: string;
  key: string;
}

export class DataGrid extends React.Component<IDataGridComponentProps, IDataGridComponentState> {
  constructor(props: IDataGridComponentProps, context: any) {
    super(props, context);
    this.state = { selectedIndexes: [] };
  }

  public render() {
    return (
      <div>
        <FormGroup>
          <ReactDataGrid
            columns={this.props.columns}
            rowGetter={(i: number) => this.props.rows[i]}
            rowsCount={this.props.rows.length}
            minHeight={500}
            rowRenderer={RowRenderer}/>
          <Row>
            <Col lg={12}>
              <div className='pull-left'>
                <CSVLink data={this.props.rows}
                  filename={'series.csv'}
                  headers={
                    _.map(this.props.columns, (x, y) => ({key: x.key, label: x.name} as IDataGridHeader))
                  }
                  className='btn btn-primary'
                  target='_blank'>
                  Export To CSV
              </CSVLink>
              </div>
            </Col>
          </Row>
        </FormGroup>
      </div>
    );
  }
}