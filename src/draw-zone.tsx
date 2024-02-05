import React from "react";
import { v4 as uuidv4 } from 'uuid';
import { AppContext } from "./context";
import { useDrop } from "react-dnd";
import MaterialList from "./material-list";
import ProcessList from "./process-list";
import OperatorList from "./operator-list";
import { MenuTypes } from "./App";
import MenuItem from "./menu-item";

const DrawZone = () => {
    const { menu, setBoxes, boxes } = React.useContext(AppContext) as any;

    const moveBox = React.useCallback(
        (id: any, left: any, top: any, attach: any) => {
            if (!boxes.find((box: { id: any }) => box.id === id)) {
                setBoxes((prev: any) => [...prev, { id, left, top, attach }]);
                return;
            }
            setBoxes((prev: any[]) => prev.map((box: { id: any }) => {
                if (box.id === id) return { ...box, left, top };
                return box;
            }))
        },
        [boxes, setBoxes],
    )

    const [, drop] = useDrop(
        () => ({
            accept: [MenuTypes.PROCESS],
            canDrop: (item: any) => true,
            drop(item: any, monitor: any) {
                const delta = monitor.getDifferenceFromInitialOffset();
                const left = Math.round(item.left + delta.x)
                const top = Math.round(item.top + delta.y)
                moveBox(item?.id || uuidv4(), left, top, item?.attach)
                return undefined
            },
        }),
        [moveBox],
    )

    const [, dropSidebar] = useDrop(
        () => ({
            accept: [MenuTypes.PROCESS],
        }),
        [moveBox],
    )

    return (
        <div ref={drop} className="w-full flex">
            <div ref={dropSidebar} className="flex flex-col gap-5 w-[250px] border-r border-gray-500 h-screen p-5">
                {menu === "m" && <MaterialList />}
                {menu === "p" && <ProcessList />}
                {menu === "o" && <OperatorList />}
            </div>
            <div className="w-full h-screen overflow-hidden bg-gray-100 flex-1 relative">
                {boxes.map((box: any) => {
                    return (
                        <MenuItem key={box.id} id={box.id} left={box.left} top={box.top} attach={box.attach}>
                            {box.attach.text}
                        </MenuItem>
                    )
                })}
            </div>
        </div>
    )
}

export default DrawZone;