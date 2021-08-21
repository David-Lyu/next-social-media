import Header from './header/Header/header';

export default function Layout(props) {
  return (
    <>
      <Header></Header>
      <div className="container">{props.children}</div>
    </>
  );
}
