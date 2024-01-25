import React from "react";
import { AppContext } from "./context";
import { useDrop } from "react-dnd";
import { MenuTypes } from "./App";
import MaterialItem from "./material-item";
import MenuItem from "./menu-item";

const MenuItemDropItem = ({ id, attach, m }: any) => {
    const { boxes, setBoxes } = React.useContext(AppContext) as any;

    const operator1 = boxes.find((box: { id: any }) => box.id === id)?.operator1
    const materials = m || boxes.find((box: { id: any }) => box.id === id)?.materials || []

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: [MenuTypes.MATERIAL],
            collect: (monitor) => ({
                isOver: !!monitor.isOver()
            }),
            drop(item: any, monitor: any) {
                if (!Object.keys(item).length) return;
                setBoxes((prev: any) => prev.map((box: any) => {
                    if (box.id !== id) return box;
                    return {
                        ...box,
                        materials: [
                            ...(box?.materials || []),
                            item
                        ]
                    }
                }))
            },
        }))

    const [{ isOver: isOverOperator }, dropOperator] = useDrop(() => ({
        accept: MenuTypes.PROCESS,
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        }),
        drop: (item: any, monitor: any) => {
            const process = boxes.find((box: { id: any }) => box.id === item.id);
            setBoxes((prev: any[]) => prev.filter((box: { id: any }) => box.id !== item.id).map((box) => {
                if (box.id !== id) return box;
                return {
                    ...box,
                    operator1: process,
                }
            }));
        }
    }));

    if (attach.menuType === MenuTypes.PROCESS) {
        return (
            <div ref={drop} className={`rounded text-gray-600 text-sm px-5 py-2 ${isOver ? "bg-blue-300" : ""} ${materials.length ? "" : "bg-gray-100"}`}>
                {!materials.length ? "Taruh material disini" : <div className="flex flex-col gap-2 w-full min-w-[150px]">
                    {materials.map((material: { text: any; price: any }) => <MaterialItem key={material.text}>
                        {material.text} - {material.price}
                    </MaterialItem>)}
                </div>}
            </div>
        )
    }

    return (
        <div ref={drop} className={`rounded gap-4 text-gray-600 flex items-start text-sm`}>
            <div className="relative">
                {!operator1 ? (
                    <div ref={dropOperator} className={`rounded px-4 py-2 ${isOverOperator ? "bg-green-300" : "bg-slate-100"}`}>
                        Taruh proses
                    </div>
                ) : <MenuItem id={operator1.id} attach={operator1.attach} className="!relative" m={operator1?.materials}>
                    {operator1.attach.text}
                </MenuItem>}
            </div>
            <span className="font-semibold text-2xl">{attach.operator}</span>
            <div className="bg-slate-100 rounded px-4 py-2">
                Taruh proses
            </div>
        </div>
    )

}

export default MenuItemDropItem;