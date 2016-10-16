import styles from './index.scss'
import React from 'react'

class LoginModal extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render(){
        return(
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
        );
    }
}

module.exports = LoginModal;