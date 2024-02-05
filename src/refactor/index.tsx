import { ConfigProvider } from "antd";
import Draw from "./draw";
import Sidebar from "./sidebar";
import LeftSidebar from "./left-sidebar";

const IndexRefactor = () => {
    return (
        <ConfigProvider>
            <Sidebar />
            <Draw />
            <LeftSidebar />
        </ConfigProvider>
    )
}

export default IndexRefactor;