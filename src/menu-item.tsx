import React from "react";
import { AppContext } from "./context";
import { MenuTypes } from "./App";
import { useDrag } from "react-dnd";
import MenuItemDropItem from "./menu-item-drop";

const MenuItem = ({ id, left = 0, top = 0, attach, className, m, asList, children, ...props }: any) => {
    const { boxes } = React.useContext(AppContext) as any;

    const isDropped = JSON.stringify(boxes).includes(id)

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.PROCESS,
            item: { id, left, top, attach },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [id, left, top, attach],
    )

    return (
        <div ref={drag} style={{ left, top }} className={`${isDragging ? "opacity-30" : ""} ${asList ? "relative" : "absolute"} ${attach.border} text-lg bg-white items-center border flex flex-col gap-2 rounded px-2 py-2 ${className} `} {...props}>
            {children}
            {isDropped && !asList && <MenuItemDropItem id={id} attach={attach} m={m} />}
        </div>
    )
}

export default MenuItem;