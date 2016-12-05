import styles from './index.scss';
import React from 'react';

import LoginModal from './loginModal.jsx'
import Footer from './footer.jsx'
import Description from './description.jsx'

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
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

module.exports = App;