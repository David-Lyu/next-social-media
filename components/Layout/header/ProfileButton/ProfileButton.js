import { useState, useRef, useEffect } from 'react';
import { GoPerson } from 'react-icons/go';
import { AiFillCaretUp, AiOutlineCaretDown } from 'react-icons/ai';
import Image from 'next/image';
import styles from './ProfileButton.module.css';
import Overlay from '../../../modules/overlay/Overlay';

import ProfileOptions from './ProfileOptions';
//going to add another hidden modal so we can click out and it goes away
export default function ProfileButton(props) {
  const { userId } = props.user;
  let profilePic = props.user.image;
  const [showOptions, setShowOptions] = useState('hide');
  const [rotateCaretClass, setRotateCaretClass] = useState('');
  const [parentZIndex, setParentZIndex] = useState('');

  useEffect(() => {
    if (showOptions === 'hide') {
      setParentZIndex('');
      setRotateCaretClass(styles['un-rotate-caret']);
    }
    if (showOptions === 'show') {
      setParentZIndex(styles['z-index-3']);
      setRotateCaretClass(styles['rotate-caret']);
    }
  }, [showOptions]);

  function onDisplayClick(e) {
    if (showOptions === 'hide') setShowOptions('show');
    if (showOptions === 'show') setShowOptions('hide');
  }

  return (
    <>
      <div className={styles['profile-parent'] + ' ' + parentZIndex}>
        <div className={styles['profile-icon']} onClick={onDisplayClick}>
          {profilePic && (
            <Image
              src={profilePic}
              alt="profile picture"
              height="30px"
              width="30px"
            />
          )}
          {!profilePic && <GoPerson />}
          {/* <AiOutlineCaretDown className={rotateCaretClass} /> */}
          <AiFillCaretUp className={rotateCaretClass} />
        </div>
        <div className={styles['profile-options'] + ' ' + showOptions}>
          <AiFillCaretUp />
          <ProfileOptions userId={userId} />
        </div>
      </div>
      {showOptions === 'show' && (
        <Overlay
          onClick={() => {
            setShowOptions('hide');
          }}
        />
      )}
    </>
  );
}
