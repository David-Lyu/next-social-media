import { useEffect, useState, useContext } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';

import Styles from './SearchBar.module.css';
import Overlay from '../../../modules/overlay/Overlay';
import { DispatchContext } from '../../../../utils/lib/state-store/user-storage';

export default function SearchBar(props) {
  const [searchVal, setSearchVal] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchClicked, setIsSearchClicked] = useState(false);
  const [parentZIndex, setParentZIndex] = useState('');
  const router = useRouter();

  const appDispatch = useContext(DispatchContext);
  // const appState = useContext(StateContext);

  async function onSearchChange(e) {
    setSearchVal(e.currentTarget.value);
  }

  // handles the click or enter press of the search results
  function handleClickOrPress(e, result) {
    if ((e.type === 'keyup' && e.key === 'Enter') || e.type === 'click') {
      onClickSearched(router, result, setSearchResults);
      setIsSearchClicked(false);
      setSearchVal('');
      appDispatch({ type: 'searchedUser', payload: result });
    }
  }
  // handles the key press of escape to clear input
  function handleInputOnKeyUp(e) {
    if (e.type === 'keyup' && e.key === 'Escape') {
      setSearchVal('');
    }
  }

  useEffect(() => {
    console.log(searchVal);
    if (searchVal.length > 0) {
      setParentZIndex(Styles['z-index-3']);
      setIsSearchClicked(true);
    }
    if (!searchVal) {
      setParentZIndex('');
      setIsSearchClicked(false);
      setSearchResults([]);
    }
    if (searchVal.length < 3) return;
    //should only be sending 5 if anymore might make a page to redirect the search
    fetch('/api/user/users?searchVal=' + searchVal)
      .then((resp) => resp.json())
      .then((data) => {
        setSearchResults(data.results);
      });
  }, [searchVal]);

  return (
    <>
      <div className={Styles['search-bar-parent'] + ' ' + parentZIndex}>
        <input
          className={Styles['search-input']}
          type="search"
          onChange={onSearchChange}
          value={searchVal}
          placeholder="Search friends"
          onKeyUp={handleInputOnKeyUp}
        />
        <div className={Styles['search-results']}>
          <ul className={Styles['search-ul']}>
            {searchResults.map((result) => {
              return (
                <li
                  key={result.id}
                  tabIndex="0"
                  onClick={(e) => handleClickOrPress(e, result)}
                  onKeyUp={(e) => handleClickOrPress(e, result)}>
                  {helpSetName(result)}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
      {isSearchClicked && (
        <Overlay
          onClick={() => {
            setSearchResults([]);
            setSearchVal('');
            setIsSearchClicked(false);
          }}
        />
      )}
    </>
  );
}

//`/dashboard/${result.id}`
function helpSetName(result) {
  if (result.firstName && result.lastName) {
    return result.firstName + ' ' + result.lastName;
  }

  if (result.firstName && !result.lastName) {
    return result.firstName;
  }

  if (result.username) {
    return result.username;
  }

  if (result.email) {
    return result.email;
  }
}

function onClickSearched(router, result, setSearchResults) {
  setSearchResults([]);
  const query = { firstName: result.firstName, lastName: result.lastName };
  router.push(
    `/dashboard/${result.id}?firstName=${result.firstName}&lastName=${result.lastName}`,
    null,
    query
  );
}
