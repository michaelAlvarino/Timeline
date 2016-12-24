import styles from './index.scss'
import React from 'react'

import LoginModal from './loginModal.jsx'
import Footer from './footer.jsx'
import Description from './description.jsx'
import Actions from './actions/actions.jsx'
import TimelineActions from './actions/TimelineActions'
import Timeline from './timeline.jsx'

class App extends React.Component {
    constructor(props, context) {
        super(props)
    }

    componentDidMount() {
        const { store } = this.context
        // store.dispatch(TimelineActions.fetchTimelines())
    }

    render() {
        const { store } = this.context

        return <div className="container">
            <h1 className="row">Welcome to Timeline</h1>
            <Description/>
            <Timeline />
            <LoginModal/>
            <Footer/>
        </div>
    }
}

App.contextTypes = {
    store: React.PropTypes.object
}

module.exports = App;