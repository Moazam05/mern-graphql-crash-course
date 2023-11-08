import { ApolloProvider, ApolloClient, InMemoryCache } from "@apollo/client";
// Custom Imports
import Header from "./components/Header";
import AddClientModal from "./views/Clients/Components/AddClientModal";
import Clients from "./views/Clients";
import Projects from "./views/Projects";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: `http://localhost:5000/graphql`,
  // cache: new InMemoryCache(),
  cache,
});

const App = () => {
  return (
    <>
      <ApolloProvider client={client}>
        <Header />
        <div className="container">
          <AddClientModal />
          <Projects />
          <Clients />
        </div>
      </ApolloProvider>
    </>
  );
};

export default App;
