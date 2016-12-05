import styles from './index.scss';
import React from 'react';

import LoginModal from './loginModal.jsx'
import Footer from './footer.jsx'
import Description from './description.jsx'
import start from './actions'

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { store } = this.context;
        store.dispatch(start('test'));
        return (
            <div className={styles.masterWrapper}>
                <h1>Welcome to Timeline</h1>
                <Description/>
                <LoginModal/>
                <Footer/>
            </div>
        );
    }
}

// have to define contextType for any
// component that gets the store from
// the global provider.
// Also, to make async requests, we will
// have to pull in some middleware. Not
// sure how that works yet.
App.contextTypes = {
    store: React.PropTypes.object
}

module.exports = App;