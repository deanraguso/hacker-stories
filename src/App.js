
import './App.css';
import React from 'react';

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

const initialStories = ["donkey ballz", "donkey teeth", "donkey tail"];

const getAsyncStories = () => 
  new Promise(resolve =>
    setTimeout(
      ()=> resolve({data: {stories: initialStories}}),
      2000
    )
  );

  
  
 
function App() {
  const [stories, setStories] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [isError, setIsError] = React.useState(false);

  React.useEffect(()=> {
    setIsLoading(true);
    getAsyncStories().then(result => {
      setStories(result.data.stories);
      setIsLoading(false);
    }).catch(
      () => setIsError(true)
    );
  }, [])

  const handleRemoveStory = item => {
    const newStories =  stories.filter(
      story => item !== story
    );

    setStories(newStories);

  };

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
              isFocused
        >
          Search:
        </InputWithLabel>

        {isError && <p>Something went wrong ...</p>}

        {isLoading? (
          <p>Loading</p>
        ) : (
        <List list={searchResults} onRemoveItem={handleRemoveStory}/>
        )}
        <p>
      </p>
    </div>
  );
}

function InputWithLabel({value, handleChange, id, label, type, children, isFocused}) {
  // ref for focus
  const inputRef = React.useRef();

  React.useEffect(()=> {
    if (isFocused &&  inputRef.current){
      inputRef.current.focus();
    }
  }, [isFocused]);

  return (
    <>
      <label htmlFor={id}>{children}</label>
      &nbsp;
      <input 
        id={id} 
        type={type}
        onChange={handleChange} 
        value={value}
        ref={inputRef}
      />
    </>
  )
}

function List ({list, onRemoveItem}) {
  return (list.map((item, index) => (
    <Item 
      key={index}
      item={item}
      onRemoveItem={onRemoveItem}
    />
  )));
  
}

function Item({item, onRemoveItem}){

  const handleRemoveItem = () => {
    onRemoveItem(item);
  };

  return(
    <>
      <h1>{item}</h1>
      <span>
        <button type="button" onClick={handleRemoveItem}>
          Dismiss
        </button>
      </span>
    </>
  )
}

export default App;
