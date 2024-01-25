import { OperatorData } from "./App";
import MenuItem from "./menu-item";

const OperatorList = () => {
    const operators = ["+", "-", "x", "/"]

    return (
        <div className="w-full h-full flex flex-col gap-5">
            <h1>OPERATOR</h1>
            {operators.map((operator) => (
                <MenuItem key={operator} asList attach={{ ...OperatorData, operator }}>
                    Operator {operator}
                </MenuItem>
            ))}
        </div>
    )
}

export default OperatorList;