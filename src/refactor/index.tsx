import Draw from "./draw";
import Sidebar from "./sidebar";

const IndexRefactor = () => {
    return (
        <div className="flex w-screen h-screen">
            <Sidebar />
            <Draw />
        </div>
    )
}

export default IndexRefactor;