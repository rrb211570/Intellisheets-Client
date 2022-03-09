import React from 'react';
import { useNavigate } from 'react-router-dom';

class AboutPanel extends React.Component {
    constructor(props) {
        super(props);
        this.state = {}
        this.homePageHandler = this.homePageHandler.bind(this);
    }
    render() {
        return (
            <div style={{ backgroundColor: 'black', height: '100vh', width: '100vw', display: 'grid', grid: '1fr 6fr / 1fr 3fr' }}>
                <div style={{ gridColumn: '1 / 3', gridRow: '1 / 2' }} />
                <div style={{ gridColumn: '1 / 2', gridRow: '2 / 3' }} />
                <div id='aboutDiv' style={{ padding: '2% 5% 0% 5%', backgroundColor: 'white', gridColumn: '2 / 3', gridRow: '2 / 3' }}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
                        <h1 style={{ margin: '10px 0px' }}>Intellisheets, a spreadsheet editor.</h1>
                        <div style={{ display: 'flex', alignItems: 'center', paddingLeft: '5%' }}>
                            <button onClick={this.homePageHandler}><h1 style={{ margin: '0px' }}>Try it out yourself!</h1></button>
                        </div>
                    </div>
                    <p>
                        &emsp;I was originally motivated to build a single-user, view-only app that would make it easy to tab through all my tracking spreadsheets. As time went on, I started to realize how little I knew about making an app, and decided that I needed to be more ambitious. Whenever I encounter a new knowledge domain, or feel out of my depth, my learning strategy has always been to go BFS first - roughly learn the lay of the land, and only then, DFS (specialize). So, I decided to upgrade to a spreadsheet editor, and make it a fully functioning one with as much features as I felt would be necessary to map the terrain.<br /><br /><hr style={{ width: '100%', border: 'solid 1px #E3E3E3' }} />

                        <h3 style={{ textAlign: 'center' }}>Composition</h3>
                        <b>Backend:</b> Express/Node server integrated with SendGrid (Email Service Provider for sending confirmation email) and MongoDB (NoSQL database-as-a-service). Hosted on Heroku.<br /><br />

                        User auth is done from scratch using bcrypt to salt/hash/compare the password. Authenticated API queries to backend are done with a secure, httpOnly cookie containing the username in a signed JWT (JavaScript Web Token).<br /><br />

                        <b>Frontend:</b> progressive React app served from an Express/Node server. Hosted on Firebase and uses Google Domains/Workspace to provide domain/email for SendGrid integration.<br /><br />

                        The editor features include row/col resizing, text input, undo/redo and auto-save.<br />
                    </p>
                </div >
            </div >
        );
    }
    homePageHandler() {
        this.props.nav('/');
    }
}

function About() {
    let nav = useNavigate();
    return (
        <AboutPanel nav={nav} />
    );
}
export default About;