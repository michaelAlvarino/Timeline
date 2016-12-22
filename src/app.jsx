import styles from './index.scss';
import React from 'react';

import LoginModal from './loginModal.jsx'
import Footer from './footer.jsx'
import Description from './description.jsx'
import Actions from './actions/actions.jsx'
import Timeline from './timeline.jsx'

class App extends React.Component {
    constructor(props, context) {
        super(props)
        //console.log(this.context.store)
        //this.context.store.dispatch(Actions.FetchTimeline(1))
    }

    render() {
        return (
            <div className="container">
                <h1 className="row">Welcome to Timeline</h1>
                <Description/>
                <Timeline/>
                <LoginModal/>
                <Footer/>
            </div>
        );
    }
}

App.contextTypes = {
    store: React.PropTypes.object
}

module.exports = App;