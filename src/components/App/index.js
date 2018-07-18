import React, { Component } from 'react';
import Entry from '../Entry';
import { entries } from '../../entries';
import './index.css';

class App extends Component {
  renderEntries() {
    return entries.map(entry => <Entry key={`${entry.name}-${entry.datetime}`} entry={entry} />);
  }

  render() {
    return (
      <div className="App">
        <h1 className="App-title">Irsko 2018</h1>

        <table className="entries">
          <thead>
            <tr>
              <th style={{ width: '50px' }}>Datum</th>
              <th>Místo</th>
              <th colSpan="3">Noc</th>
              <th colSpan="3">Den</th>
              <th colSpan="3">Večer</th>
            </tr>
          </thead>
          <tbody>
            {this.renderEntries()}
          </tbody>
        </table>
      </div>
    );
  }
}

export default App;
