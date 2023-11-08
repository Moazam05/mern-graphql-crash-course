import { useQuery } from "@apollo/client";
// Custom Imports
import ClientRow from "./Components/ClientRow";
import { GET_CLIENTS } from "./graphql/queries/clientQueries";
import Spinner from "../../components/Spinner";

const Clients = () => {
  const { loading, error, data } = useQuery(GET_CLIENTS);

  if (loading) return <Spinner />;
  if (error) return <p>Error :</p>;

  return (
    <>
      {!loading && !error && (
        <table className="table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Email</th>
              <th scope="col">Phone</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.clients.map((client) => (
              <ClientRow key={client.id} client={client} />
            ))}
          </tbody>
        </table>
      )}
    </>
  );
};

export default Clients;
