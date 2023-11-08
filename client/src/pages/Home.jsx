import AddClientModal from "../views/Clients/Components/AddClientModal";
import AddProjectModal from "../views/Projects/Components/AddProjectModal";
import Clients from "../views/Clients";
import Projects from "../views/Projects";

const Home = () => {
  return (
    <>
      <div className="d-flex gap-3 mb-3">
        <AddClientModal />
        <AddProjectModal />
      </div>
      <Projects />
      <hr />
      <Clients />
    </>
  );
};

export default Home;
