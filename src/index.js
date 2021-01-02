import 'assets/styles/_index.scss';

import StoryEditor from 'components/StoryEditor';
import React from 'react';
import ReactDOM from 'react-dom';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
import reportWebVitals from 'reportWebVitals';

ReactDOM.render(
  <Router>
    <Switch>
      <Route exact path="/">
        <StoryEditor />
      </Route>
      <Route path="/:storyID">
        <StoryEditor readOnly />
      </Route>
    </Switch>
  </Router>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
