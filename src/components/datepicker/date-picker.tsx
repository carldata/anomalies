import * as moment from 'moment';
import * as React from 'react';
import { ControlLabel, Form, FormGroup } from 'react-bootstrap';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';
import 'react-datepicker/dist/react-datepicker.css';

interface IDatePickerWrapperComponentActionCreators {
    dateSelected: (startDate: string, endDate: string) => void;
}

interface IDatePickerWrapperComponentState {
    startDate: moment.Moment;
    endDate: moment.Moment;
}

export default class DatePickerWrapper extends React.Component< IDatePickerWrapperComponentActionCreators, IDatePickerWrapperComponentState> {
    private dateFormat: string = 'YYYY-MM-DDTHH:mm';
    private startDateInputEnterHit: boolean;
    private endDateInputEnterHit: boolean;
    constructor(props: IDatePickerWrapperComponentActionCreators, context: any) {
        super(props, context);
        const startOfDay = moment().startOf('day');
        this.state = {
            startDate: startOfDay.clone().subtract(3, 'months'),
            endDate: startOfDay,
        };
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
        this.startDateInputEnterHit = false;
        this.endDateInputEnterHit = false;
    }

    private handleChangeStart(date) {
        this.setState({
            startDate: date,
        });
        this.props.dateSelected(date.format(this.dateFormat), this.state.endDate.format(this.dateFormat));
    }

    private handleChangeEnd(date) {
        this.setState({
            endDate: date,
        });
        this.props.dateSelected(this.state.startDate.format(this.dateFormat), date.format(this.dateFormat));
    }

    public render() {
        return <Form inline>
            <FormGroup>
                <ControlLabel>Start Date:</ControlLabel>
            </ FormGroup>
            <FormGroup>
                <DatePicker 
                    disabledKeyboardNavigation
                    selected={this.state.startDate}
                    dateFormat={'YYYY-MM-DD HH:mm'}
                    onChange={() => { }}
                    onSelect={(e) => {
                        if (!this.startDateInputEnterHit) {
                            this.handleChangeStart(e);
                        } else {
                            this.startDateInputEnterHit = false;
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key == 'Enter') {
                            e.preventDefault();
                            this.startDateInputEnterHit = true;
                        }
                    }}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate} />
            </ FormGroup>
            <FormGroup>
                <ControlLabel>End Date:</ControlLabel>
            </ FormGroup>
            <FormGroup>
                <DatePicker
                    disabledKeyboardNavigation
                    selected={this.state.endDate}
                    dateFormat={'YYYY-MM-DD HH:mm'}
                    onChange={()=> {}}
                    onSelect={(e) => {
                        if (!this.endDateInputEnterHit) {
                            this.handleChangeEnd(e);
                        } else {
                            this.endDateInputEnterHit = false;
                        }
                    }}
                    onKeyDown={(e) => {
                        if (e.key == 'Enter') {
                            e.preventDefault();
                            this.endDateInputEnterHit = true;
                        }
                    }}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate} />
            </ FormGroup>
        </Form>;
    }
}

