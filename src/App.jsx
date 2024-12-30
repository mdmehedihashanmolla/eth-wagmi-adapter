import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  http,
  createConfig,
  WagmiProvider,
  useConnect,
  useAccount,
  useBalance,
  useSendTransaction,
} from "wagmi";
import { base, sepolia } from "wagmi/chains";
import { injected } from "wagmi/connectors";
const queryClient = new QueryClient();

export const config = createConfig({
  chains: [sepolia, base],
  connectors: [injected()],
  transports: {
    [sepolia.id]: http(),
    [base.id]: http(),
  },
});
function App() {
  return (
    <div>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <WalletConnector />
          <EthSend />
          <MyAddress />
        </QueryClientProvider>
      </WagmiProvider>
    </div>
  );
}

function MyAddress() {
  const { address } = useAccount();
  const balnace = useBalance({ address });
  return (
    <div>
      {address}
      <br />
      {balnace?.data?.formatted}
    </div>
  );
}

function WalletConnector() {
  const { connectors, connect } = useConnect();
  return connectors.map((connector) => (
    <button key={connector.uid} onClick={() => connect({ connector })}>
      {connector.name}
    </button>
  ));
}

function EthSend() {
  const { data: hash, sendTransaction } = useSendTransaction();
  function sendEth() {
    sendTransaction({
      to: document.getElementById("address").value,
      value: "100000000000000000",
    });
  }

  return (
    <>
      <input id="address" type="text" placeholder="Address..."></input>
      <button onClick={sendEth}>Send 0.1 Eth</button>
    </>
  );
}

export default App;
