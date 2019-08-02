import * as React from 'react';
import { connect } from 'react-redux';
import { IState } from '@app-state/.';

class Startup extends React.Component<any, any> {

    public render() {
        return this.props.configLoaded
            ? this.props.children
            : (<p>Loading...</p>);
    }

}

function mapStateToProps(state: IState) {
    return {
        configLoaded: state.configuration.loaded
    };
}

export default connect(
    mapStateToProps,
)(Startup);