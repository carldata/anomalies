import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDataGrid from 'react-data-grid';
import { IState } from '../../../state';
import { Dispatch, bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { IHpTimeSeriesChartState } from 'time-series-scroller';
import { IDataGridState, IDataGridRow } from './state';
import { Button, ButtonGroup, ControlLabel, Form, FormControl, FormGroup, Row, Col } from 'react-bootstrap';
import { CSVLink, CSVDownload } from 'react-csv';
import { Column } from 'react-data-grid';
import { RowRenderer } from './grid-renderer';

export interface IDataGridComponentProps {
  columns: Column[];
  rows: IDataGridRow[];
}

interface IDataGridComponentState {
  selectedIndexes: any[];
}

export class DataGrid extends React.Component<IDataGridComponentProps, IDataGridComponentState> {
  constructor(props: IDataGridComponentProps, context: any) {
    super(props, context);
    this.state = { selectedIndexes: [] };
  }

  public shouldComponentUpdate(nextProps: IDataGridComponentProps, nextState: IDataGridComponentState) {
    return ((_.size(this.props.rows) !== _.size(nextProps.rows)) || (JSON.stringify(this.props.columns) !== JSON.stringify(nextProps.columns)));
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
            rowRenderer={RowRenderer} />
          <Row>
            <Col lg={12}>
              <div className='pull-left'>
                <CSVLink data={this.props.rows}
                  filename={'series.csv'}
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