import Image from 'next/image';
import styles from './Card.module.css';

export default function Card({ post }) {
  const { message, image, firstName, lastName, userImage } = post;
  console.log(firstName, lastName, image);

  return (
    <div className={styles['card-container']}>
      <div className={styles['card-user']}>
        {image && <Image width="20px" height="20px" src={userImage} />}
        <h6>{firstName + ' ' + lastName}</h6>
      </div>
      {image && (
        <div className={styles['card-image']}>
          <Image
            src={'/pictures/try.svg'}
            width="300px"
            height="300px"
            layout="responsive"
            alt="post image"
          />
        </div>
      )}
      <div className={styles['card-body']}>
        <p>Caption:</p>
        <p>{message}</p>
      </div>
    </div>
  );
}
