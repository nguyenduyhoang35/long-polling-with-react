import * as React from "react";
import { useMountedState, useRafPolling } from "../hooks";
import { sleep } from "../utils";

export default function Home() {
	const [count, setCount] = React.useState(0);
	const isMounted = useMountedState();

	const updateCount = async () => {
		await sleep(1000);

		if (isMounted()) {
			setCount((c) => c + 2);
		}
	};

	const endPolling = useRafPolling(updateCount, 1000);

	return (
		<div>
			<h1>count is {count}</h1>
			<button onClick={endPolling}>End Polling</button>
		</div>
	);
}
