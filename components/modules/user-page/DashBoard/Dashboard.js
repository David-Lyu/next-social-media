import React, { useEffect, useState } from 'react';
import styles from './Dashboard.module.css';

import Card from './Card/Card';

//this should be either client side or rendered with server-side
//might be just a component
//should get id of user wanting to display
export default React.memo(function Dashboard({ user, reRender, url }) {
  const userId = user.id;
  const [isLoaded, setIsLoaded] = useState(false);
  const [posts, setPosts] = useState([]);
  // console.log(user);

  useEffect(() => {
    //client side rendering to get post based on user id or profile id
    //want to use swr eventually
    fetch(url)
      .then((resp) => resp.json())
      .then((data) => {
        setIsLoaded(true);
        setPosts(data.posts);
        console.log(data);
      })
      .catch(console.error);
    // eslint-disable-next-line
  }, [reRender, userId]);

  if (!isLoaded || posts === 'undefined') {
    return <div>Loading screen</div>;
  }

  return (
    <div className={styles['dashboard-module']}>
      {!posts.length && <div>No posts</div>}
      {!!posts.length && (
        <ul>
          {posts.map((post) => {
            return (
              <li key={post._id}>
                <Card post={post} />
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
});
