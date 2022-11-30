import React, { Component, Fragment } from "react";
import { withNavigation } from "react-navigation";
class Navigation extends Component {
    constructor(props) {
        super(props);
        this.state = { listenerAdded: false };
    }
    componentDidMount() {
        console.log("navigation:" + this.props.navigation);
    }
    componentDidUpdate() {
        // Typical usage (don't forget to compare props):
        if (this.props.navigation && !this.state.listenerAdded) {
            this.props.OnNavigationLoaded(this.props.navigation);
            this.setState({ listenerAdded: true });
        }
    }
    render() {
        return React.createElement(Fragment, null);
    }
}
export const FocusDetectingNavigator = withNavigation(Navigation);
//# sourceMappingURL=FocusDetectingNavigator.js.map