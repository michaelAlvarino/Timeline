import styles from './index.scss';
import React from 'react';

import LoginModal from './loginModal.jsx'

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div>
                    <h1>Welcome to Timeline</h1>
                    <p>We were inspired to create a website where you could combine your knowledge of history to other's. Add your knowledge, discuss, ask questions, and learn.</p>
                </div>
                <LoginModal/>
            </div>
        );
    }
}

module.exports = App;