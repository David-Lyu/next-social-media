import Router, { useRouter } from 'next/router';
import { getCsrfToken, useSession, getSession } from 'next-auth/client';
import React, { useEffect, useState } from 'react';

import styles from './[userId].module.css';
import Dashboard from '../../components/modules/user-page/Dashboard/Dashboard';

//look into nextjs router.replace to rerender
export default React.memo(function GetOtherUserPage(props) {
  const router = useRouter();
  const [isFriend, setIsFriend] = useState(false);
  const [isUser, setIsUser] = useState(false);
  const [buttonClick, setButtonClick] = useState('');
  //data for this component
  const session = props.session;
  const friendId = router.query.userId;
  const currentUserId = session.user.id;
  const { firstName } = router.query;
  const lastName =
    router.query.lastName !== 'undefined' ? router.query.lastName : '';

  // gets sent to child
  const user = { id: friendId };
  const url = `/api/user/posts/get/${user.id}`;

  useEffect(() => {
    if (buttonClick === '') return;
    let method = '';
    if (buttonClick === 'Add') method = 'POST';
    if (buttonClick === 'Delete') method = 'Delete';
    if (!method) return;
    handleFriendClick(friendId, currentUserId, method, setIsFriend);
    /*eslint-disable */
  }, [buttonClick]);

  useEffect(() => {
    if (friendId === currentUserId) return setIsUser(true);
    if (friendId !== currentUserId) setIsUser(false);
    fetch(`/api/user/friend?friendId=${friendId}&userId=${currentUserId}`)
      .then((resp) => resp.json())
      .then((data) => {
        setIsFriend(data.isFriend);
      });
  }, [friendId]);

  // cant find user send this might change to call back later
  if (!firstName) return <div>user not exists</div>;

  return (
    <div className={styles['dashboard-parent']}>
      <h3>{firstName + ' ' + lastName + "'s " + 'Profile'}</h3>

      {!isUser && session && !isFriend && (
        <button onClick={() => setButtonClick('Add')}>Add Friend</button>
      )}

      {!isUser && session && isFriend && (
        <button onClick={() => setButtonClick('Delete')}>Un-follow</button>
      )}

      <Dashboard user={user} url={url} />
    </div>
  );
});

//Helper functions
async function handleFriendClick(friendId, userId, method, setIsFriend) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ friendId, userId })
  };
  const response = await fetch('/api/user/friend', options);
  const data = await response.json();
  if (method === 'Delete') await setIsFriend(false);
  if (method === 'POST') await setIsFriend(true);
}

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  return {
    props: { session }
  };
}
