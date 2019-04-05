import React from "react";
import ReactDOM from "react-dom";
import faker from 'faker'
import Highlighter from "react-highlight-words";

import "./styles.css";

const generateAutoComplete = data => value => {
  return data.filter((item, index) => item.toLowerCase().indexOf(value) > -1).filter((_, index) => index < 6)
}

function Highlight({ highlight, value }) {
  return <li>
    <Highlighter
    highlightClassName="highlight"
    searchWords={[highlight]}
    autoEscape={true}
    textToHighlight={value}
  />
  </li>
}

class App extends React.Component {
  state = {
    loading: false,
    value: '',
    autoCompleteList: []
  }
  
  generateData = async () => {
    this.setState({ loading: true })
    return new Promise(resolve => {
      let data = []
      for (let index = 0; index < 100; index++) {
        data.push(faker.fake("{{random.number}} | {{internet.email}} | {{name.firstName}} {{name.lastName}}"))
      }
      resolve(data)
    })
  }
  
  async componentDidMount(){
    const data = await this.generateData()
    this.autoCompleteGenerator = generateAutoComplete(data)
  }

  handleInputUpdate = (event) => {
    const { value } = event.target
    this.setState({ value }, this.updateAutoCompleteList)
  }

  updateAutoCompleteList = () => {
    const { value } = this.state;
    if(this.autoCompleteGenerator){
      const autoCompleteList = this.autoCompleteGenerator(value.toLowerCase())
      this.setState({ autoCompleteList})
    }
  }

  render(){
    const { value, autoCompleteList } = this.state
    return <div className="app-container">
      <div className="search-container">
        <input type="text" value={value} onChange={this.handleInputUpdate} placeholder="Search for id, email or name" />
      </div>
      <div className="autocomplete-container">
        <ul className="autocomplete-list">
          {autoCompleteList.map((item, index) => <Highlight key={index} highlight={value} value={item} />)}
        </ul>
      </div>
    </div>
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);
