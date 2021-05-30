
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

const storiesReducer = (state, action) => {
  switch (action.type) {
    case 'STORIES_FETCH_INIT':
      return {
        ...state,
        isLoading: true,
        isError: false
      }

    case 'STORIES_FETCH_SUCCESS':
      return{
        ...state,
        isLoading: false,
        isError: false,
        data: action.payload,
      }

    case 'STORIES_FETCH_FAILURE':
      return{
        ...state,
        isLoading: false,
        isError: true
      }

    case 'REMOVE_STORY':
      return {
        ...state,
        data: state.data.filter(
          story => action.payload.objectID !== story.objectID
        )
      }

    default:
      throw new Error();
  }
}
  
 
function App() {
  // const [stories, setStories] = React.useState([]);

  const [stories, dispatchStories] = React.useReducer(
    storiesReducer,
    {data: [], isLoading: false, isError: false}
  );

  React.useEffect(()=> {
    
    dispatchStories({type: 'STORIES_FETCH_INIT'})

    getAsyncStories().then(result => {
      // setStories(result.data.stories);
      dispatchStories({
        type: 'STORIES_FETCH_SUCCESS',
        payload: result.data.stories
      });
    }).catch(
      dispatchStories({type: 'STORIES_FETCH_FAILURE'})
    );
  }, [])

  const handleRemoveStory = item => {
    // const newStories =  stories.filter(
    //   story => item !== story
    // );

    // setStories(newStories);
    dispatchStories({
      type:"REMOVE_STORY",
      payload: item,
    });
  };

  const [searchTerm, setSearchTerm] = useSemiPersitentState('search', 'Dogs');

  const handleSearch = event => {
    setSearchTerm(event.target.value);
  }

  const searchResults = (stories.data.filter(function(story){
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

        {stories.isError && <p>Something went wrong ...</p>}

        {stories.isLoading? (
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
