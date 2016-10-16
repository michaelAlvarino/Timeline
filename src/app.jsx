import styles from './index.scss';
import React from 'react';

class App extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <div className={styles.fullWidth}>
                    <img className={styles.placeholder} 
                        src="http://trampkiwpodrozy.staszewski.pro/wp-content/uploads/2015/12/party.gif" 
                        id="wow"
                        alt="wow" />
                </div>

                <div id="login-modal" className={styles.modal + ' ' + styles.modalHide}>
                    <form>
                        <label>Email</label><br/>
                        <input type="email" placeholder="huge.jackedman@xmen.com" /><br/>
                        <br/>
                        <label>Password</label><br/>
                        <input type="password" placeholder="thisisnotapassword1337" /><br/>
                        <br/>

                        <button id="jk">Login</button>
                        <button id="jk">JK</button>
                    </form>
                </div>
            </div>
        );
    }
}

module.exports = App;