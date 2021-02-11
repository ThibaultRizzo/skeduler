import { StandardProps } from "../types/types";

type LoaderProps = {
  isLoading: boolean;
  isEmpty?: boolean;
} & StandardProps;

function LoaderComponent() {
  return <div>Loading...</div>;
}
function Loader({ isLoading, isEmpty, children }: LoaderProps) {
  if (isLoading) {
    return <LoaderComponent />;
  } else if (isEmpty) {
    return <span>No records persisted</span>;
  } else {
    return <>{children}</>;
  }
}

export default Loader;
