import Navbar from "./Navbar";

function Layout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <main className="content">
        {children}
      </main>
    </div>
  );
}

export default Layout;
