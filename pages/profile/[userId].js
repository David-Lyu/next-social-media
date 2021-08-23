import { getSession } from 'next-auth/client';
import { useState, useRef } from 'react';
import { ref, getDownloadURL, uploadBytes } from 'firebase/storage';

import styles from './[userId].module.css';

import storage from '../../utils/lib/firebase/firebase';
import Dashboard from '../../components/modules/user-page/DashBoard/Dashboard';

//look into router.replace to rerender?
export default function GetMyUserPage(props) {
  const postTextRef = useRef('');
  const postImageRef = useRef(null);
  const [imageUrl, setImageUrl] = useState('');
  const [isFormDisable, setIsFormDisable] = useState(false);
  const [reRender, setReRender] = useState(false);

  const onPostSubmit = (e) => {
    e.preventDefault();
    const postTextValue = postTextRef.current.value;

    //fetch an api
    const formData = {
      userId: props.session.user.id,
      userImage: props.session.user.image || props.session.user.picture,
      firstName: props.session.user.firstName || props.session.user.name,
      lastName: props.session.user.lastName || '',
      message: postTextValue,
      image: imageUrl
    };

    const config = {
      method: 'POST',
      body: JSON.stringify(formData),
      headers: {
        'Content-Type': 'application/json'
      }
    };
    fetch('/api/user/posts/post/', config)
      .then((response) => {
        return response.json();
      })
      .then((data) => {
        postImageRef.current.value = null;
        postTextRef.current.value = null;
        setReRender(!reRender);
        setImageUrl('');
      });

    return null;
  };

  //sends the file to firebase
  const imageOnChange = () => {
    //should get something to get id from db maybe?
    const randNum = Math.floor(Math.random() * 10000) + 1;
    setIsFormDisable(true);
    const imageFile = getFileType(postImageRef.current.value);
    const fileType = imageFile[0];
    const storageRef = storage.ref();
    const metadata = {
      contentType: 'image/' + fileType
    };
    const uploadTask = storageRef
      .child('images/test' + randNum)
      .put(postImageRef.current.files[0], metadata);
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('upload is ' + progress + '% done');
        switch (snapshot.state) {
          case 'paused':
            console.log('upload is paused');
            break;
          case 'running':
            console.log('upload is running');
            break;
        }
      },
      (error) => {
        switch (error.code) {
          default:
            console.error(error);
        }
        setIsFormDisable(false);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then(async (downloadURL) => {
          console.log(downloadURL);
          await setImageUrl(downloadURL);
          await setIsFormDisable(false);
        });
      }
    );
  };

  return (
    <div className={styles['profile-container']}>
      <form onSubmit={onPostSubmit}>
        <div className={styles['post-inputs']}>
          <label htmlFor="post-input">Message: </label>
          <input type="text" id="post-input" ref={postTextRef} required></input>
          <div className={styles['post-file-input']}>
            <label htmlFor="post-image" className={styles['post-file-label']}>
              Drag or Upload photo here
            </label>
            <input
              type="file"
              id="post-image"
              ref={postImageRef}
              onChange={imageOnChange}
              disabled={isFormDisable}
            />
          </div>
        </div>
        <button disabled={isFormDisable}>Submit</button>
      </form>
      <h4>Posts</h4>
      <Dashboard
        user={props.session.user}
        reRender={reRender}
        url={`/api/user/posts/get/get-every/${props.session.user.id}`}
      />
    </div>
  );
}

export async function getServerSideProps({ req, res }) {
  //fetch user here
  const session = await getSession({ req });
  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/error?error=AccessDenied',
        permanent: false
      }
    };
  }
  return {
    props: { session }
  };
}

/**
 *
 * @param imageFile - the file name that gets passed down to this place
 * @returns [String,String] with 1st index
 * - that is the format of the image
 * - the name of the file
 */
function getFileType(imageFile) {
  const ImageSplit = imageFile.split('.');
  const fileType = ImageSplit[ImageSplit.length - 1];
  return [fileType, ImageSplit[0]];
}
