import React from "react";
import ReactDOM from "react-dom";

import "./styles.css";

class Main extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentValue: "",
      inFocus: false,
      items: [
        { id: 1, text: "Akshay Gupta", email: "akshaygupta.1188@gmail.com" },
        { id: 2, text: "Riyaz Ahmed", email: "riyaz.1188@gmail.com" },
        { id: 3, text: "Hello World", email: "hello.1188@gmail.com" },
        { id: 4, text: "Tapzo", email: "Tapzo@gmail.com" }
      ],
      selected: [],
      itemToBeHighLighted: -1
    };
  }

  onFocus = e => {
    this.setState({ inFocus: true });
  };

  onChange = e => {
    this.setState({ currentValue: e.target.value });
  };

  onBlur = e => {
    //dirty debounce
    setTimeout(() => {
      this.setState({ inFocus: false });
    }, 1000);
  };

  onSelect = l => {
    let newItems = [];
    //also reset itemToBeHighLighted 
    this.setState(prevState => ({
      selected: [...prevState.selected, l.id],
      itemToBeHighLighted: -1
    }));
  };

  findItemInListById = id => {
    return this.state.items.filter(l => l.id === id);
  };

  removeItem = id => {
    let a = [...this.state.selected]; // make a separate copy of the array
    let i = a.indexOf(id);
    a.splice(i, 1);
    this.setState({ selected: a });
  };

  renderSelectItems = () => {
    const { selected, itemToBeHighLighted } = this.state;
    return selected.map(s => {
      let item = this.findItemInListById(s);
      return (
        <p
          className={`chip ${
            itemToBeHighLighted == item.id ? "highlight" : ""
          }`}
        >
          <img className="chip-icon" src="http://lorempixel.com/32/32/" />
          <span>{item[0].text}</span>
          <button
            className="chip-remove"
            href="javascript:void(0)"
            onClick={this.removeItem.bind(this, item.id)}
          />
        </p>
      );
    });
  };

  checkForBackSpace = e => {
    const { itemToBeHighLighted, selected } = this.state;
    if (e.keyCode == "8") {
      if (itemToBeHighLighted === -1) {
        //set itemToBeHighLighted
        this.setState({ itemToBeHighLighted: selected[selected.length - 1] });
      } else {
        //delete list item
        this.removeItem(selected[selected.length - 1]);
      }
    } else {
      //if he press anything else, reset itemToBeHighLighted
      this.setState({
        itemToBeHighLighted: -1
      });
    }
  };

  render() {
    const {
      currentValue,
      items,
      inFocus,
      selected,
      itemToBeHighLighted
    } = this.state;
    return (
      <div>
        <div className="input-container">
          <div className="chips">{this.renderSelectItems()}</div>
          <input
            name="chips"
            onFocus={this.onFocus}
            onChange={this.onChange}
            // onBlur={this.onBlur}
            onKeyDown={this.checkForBackSpace}
            className="input-box"
          />
          <AutoCompleteList
            list={items}
            currentValue={currentValue}
            inFocus={inFocus}
            selected={selected}
            updateSelectedItem={this.onSelect}
            itemToBeHighLighted={itemToBeHighLighted}
          />
        </div>
      </div>
    );
  }
}

class AutoCompleteList extends React.Component {
  constructor(props) {
    super(props);
  }

  renderItem = l => {
    const { itemToBeHighLighted } = this.props;
    return (
      <li
        className={`list-chip`}
        onClick={this.props.updateSelectedItem.bind(this, l)}
      >
        <img className="chip-icon" src="http://lorempixel.com/20/20/" />
        <span>{l.text}</span>
      </li>
    );
  };

  filterdList = () => {
    const { list, selected, currentValue } = this.props;
    //if not already selected and contains current value
    return list.map(l => {
      return selected.indexOf(l.id) === -1 &&
        l.text.includes(currentValue ? currentValue : l.text)
        ? this.renderItem(l)
        : null;
    });
  };
  render() {
    const { inFocus } = this.props;
    if (!inFocus) {
      return null;
    } else return <ul className="list-container">{this.filterdList()}</ul>;
  }
}

const rootElement = document.getElementById("root");
ReactDOM.render(<Main />, rootElement);
