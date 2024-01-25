import React from "react";
import { RefactorContext } from "../context/context";
import { MenuTypes } from "../utils/constant";


const Sidebar = () => {
    const { setMenu, menu } = React.useContext(RefactorContext) as any;

    const onClickMenu = (str: any) => {
        return () => {
            setMenu((prev: any) => prev === str ? "" : str)
        }
    }

    return (
        <div className="flex flex-col gap-5 w-[70px] h-screen items-center py-10 z-[60] bg-white shadow-lg">
            {Object.keys(MenuTypes).map((key: any) => {
                let item = MenuTypes[key as keyof typeof MenuTypes];
                return (
                    <button key={key} className={`bg-gray-200 rounded ${menu === item.id ? item.style : ""}  px-4 py-2`} onClick={onClickMenu(item.id)} title="Material">
                        {item.initial}
                    </button>
                )
            })}
        </div>
    )
}

export default Sidebar;