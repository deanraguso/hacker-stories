import logo from './logo.svg';
import './App.css';
import React from 'react';

const title = "React APP";

const welcome = {
  greeting: "HEY",
  title: "React"
};
 
const useSemiPersitentState = (key, initialValue) => {
  const [value, setValue] = React.useState(localStorage.getItem(key) || initialValue);
  React.useEffect(()=> {
    localStorage.setItem(key,value);
  }, [value, key]);

  return [value, setValue];
};


function App() {
  const stories = ["donkey ballz", "donkey teeth", "donkey tail"];


  const [searchTerm, setSearchTerm] = useSemiPersitentState('search', 'Dogs');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  const searchResults = (stories.filter(function(story){
    return story.toLowerCase().includes(searchTerm.toLowerCase());
  }));

  return (
    <div className="App">
      <h1>{welcome.greeting} {welcome.title}</h1>
        <InputWithLabel
              value={searchTerm}
              handleChange={handleSearch}
              id="search"
              type="text"
        >
          Search:
        </InputWithLabel>
        <List list={searchResults}/>
        <p>
      </p>
    </div>
  );
}

function InputWithLabel({value, handleChange, id, label, type, children}) {
  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input 
        id={id} 
        type={type}
        onChange={handleChange} 
        value={value}
      />
    </>
  )
}

const List = props =>
  props.list.map(item => (
    <h2>{item}</h2>
  ));

export default App;
