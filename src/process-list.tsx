import { ProcessData } from "./App";
import MenuItem from "./menu-item";

const ProcessList = () => {
    return (
        <div className="w-full h-full flex flex-col gap-5">
            <h1>PROCESS</h1>
            <MenuItem asList attach={ProcessData}>
                process
            </MenuItem>
        </div>
    )
}

export default ProcessList; 