import * as React from 'react';
import * as moment from 'moment';
import { connect } from 'react-redux';
import DatePicker from 'react-datepicker';
import { IState } from '../../state';
import { bindActionCreators, Dispatch } from 'redux';
import { ControlLabel, Form, FormGroup } from 'react-bootstrap';
import 'react-datepicker/dist/react-datepicker.css';
import 'react-datepicker/dist/react-datepicker-cssmodules.css';

interface IDatePickerWrapperComponentProps {

}

interface IDatePickerWrapperComponentActionCreators {
    dateSelected: (startDate: string, endDate: string) => void;
}

interface IDatePickerWrapperComponentState {
    startDate: moment.Moment;
    endDate: moment.Moment;
}

export class DatePickerWrapper extends React.Component<IDatePickerWrapperComponentProps & IDatePickerWrapperComponentActionCreators, IDatePickerWrapperComponentState> {
    private dateFormat: string = 'YYYY-MM-DDTHH:mm';
    constructor(props: IDatePickerWrapperComponentProps & IDatePickerWrapperComponentActionCreators, context: any) {
        super(props, context);
        this.state = {
            startDate: moment().hours(0).minutes(0),
            endDate: moment().hours(0).minutes(0),
        };
        this.handleChangeStart = this.handleChangeStart.bind(this);
        this.handleChangeEnd = this.handleChangeEnd.bind(this);
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
                    selectsStart
                    selected={this.state.startDate}
                    dateFormat='YYYY-MM-DD HH:mm'
                    onChange={this.handleChangeStart}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate} />
            </ FormGroup>
            <FormGroup>
                <ControlLabel>End Date:</ControlLabel>
            </ FormGroup>
            <FormGroup>
                <DatePicker
                    selectsEnd
                    selected={this.state.endDate}
                    dateFormat='YYYY-MM-DD HH:mm'
                    onChange={this.handleChangeEnd}
                    startDate={this.state.startDate}
                    endDate={this.state.endDate} />
            </ FormGroup>
        </Form>;
    }
}

function mapStateToProps(state: IState) {
    return {

    } as IDatePickerWrapperComponentProps;
}

function matchDispatchToProps(dispatch: Dispatch<{}>) {
    return bindActionCreators({

    }, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(DatePickerWrapper);

