import React, { Component, Fragment } from "react";
import { NavigationInjectedProps, NavigationRoute, NavigationScreenProp, withNavigation } from "react-navigation";

class Navigation extends Component<
    NavigationInjectedProps & {
        OnNavigationLoaded: (navigation: NavigationScreenProp<NavigationRoute>) => void;
    },
    { listenerAdded: boolean }
> {
    constructor(
        props: NavigationInjectedProps & {
            OnNavigationLoaded: (navigation: NavigationScreenProp<NavigationRoute>) => void;
        }
    ) {
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
        return <Fragment />;
    }
}

export const FocusDetectingNavigator = withNavigation(Navigation);
