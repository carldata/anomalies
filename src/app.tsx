import '../styles/bootstrap.min.css';

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import { createHashHistory } from 'history'

class HelloReactComponent extends React.Component {
  render() {
    return <div className='container'> <div className='btn btn-success' > Hello and Welcome to React! Let's start a new journey ! </div> </div>
  }
}

ReactDOM.render(<HelloReactComponent />, document.getElementById('app'))