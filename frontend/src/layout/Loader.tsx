import { StandardProps } from "../types/types";

type LoaderProps = {
  isLoading: boolean;
} & StandardProps;

function LoaderComponent() {
  return <div>Loading...</div>;
}
function Loader({ isLoading, children }: LoaderProps) {
  return isLoading ? <LoaderComponent /> : <>{children}</>;
}

export default Loader;
