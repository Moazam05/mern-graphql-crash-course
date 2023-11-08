import Clients from "../views/Clients";
import AddClientModal from "../views/Clients/Components/AddClientModal";
import Projects from "../views/Projects";

const Home = () => {
  return (
    <>
      <div className="d-flex gap-3 mb-3">
        <AddClientModal />
      </div>
      <Projects />
      <hr />
      <Clients />
    </>
  );
};

export default Home;
