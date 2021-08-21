// import styles from '../../styles/Home.module.css';
import { useSession, signOut, signIn } from 'next-auth/client';
import Link from 'next/link';
import { useEffect } from 'react';
import ProfileButton from '../ProfileButton/ProfileButton';
import SearchBar from '../SearchBar/SearchBar';
import styles from './header.module.css';

export default function Header(props) {
  const [session, loading] = useSession();

  const homePage = session ? `/profile/${session.user.id}` : '/';

  return (
    <nav className={styles['super-nav']}>
      <div className={`container ${styles.nav}`}>
        <Link href={homePage} passHref={true}>
          <a tabIndex="0">
            <h3 className={styles.name}>Social Media</h3>
          </a>
        </Link>
        <div className={styles.links}>
          <SearchBar />
          {session && <ProfileButton user={session.user} />}
          {!session && <button onClick={signIn}>Login</button>}
        </div>
      </div>
    </nav>
  );
}
