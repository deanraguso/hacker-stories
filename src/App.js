import logo from './logo.svg';
import './App.css';
import React from 'react';

const title = "React APP";

const welcome = {
  greeting: "HEY",
  title: "React"
};

function App() {
  const stories = ["donkey ballz", "donkey teeth", "donkey tail"];
  const [searchTerm, setSearchTerm] = React.useState(localStorage.getItem("search") || "");

  React.useEffect(()=> {
    localStorage.setItem("search",searchTerm);
  }, [searchTerm]);

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  const searchResults = (stories.filter(function(story){
    return story.toLowerCase().includes(searchTerm.toLowerCase());
  }));

  return (
    <div className="App">
      <h1>{welcome.greeting} {welcome.title}</h1>
      <Search searchTerm={searchTerm} handleChange={handleSearch}/>
        <List list={searchResults}/>
        <p>
      </p>
    </div>
  );
}

function Search(props) {


  return (
    <div>
      <label htmlFor="search">Search: </label>
      <input id="search" type="text" onChange={props.handleChange} value={props.searchTerm}/>
    </div>
  )
}

const List = props =>
  props.list.map(item => (
    <h2>{item}</h2>
  ));

export default App;
