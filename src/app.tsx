import * as React from 'react'
import * as ReactDOM from 'react-dom'

class HelloReactComponent extends React.Component {
  render() {
    return <div>Hello and Welcome to React! Let's start a new journey !</div>
  }
}

ReactDOM.render(<HelloReactComponent />, document.getElementById('app'))