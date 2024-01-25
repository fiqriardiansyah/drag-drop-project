import { MenuTypes, cardMaterialItemInfo, cardProcessItemInfo } from "@/refactor/utils/constant";
import React from "react";
import { useDrag } from "react-dnd";
import ShapeMaterial from "./shape";

type CardMaterialDrawProps = React.HTMLProps<HTMLDivElement> & {
    attach?: any;
    removeChildren?: (data: any) => void;
}

const CardMaterialDraw = ({ removeChildren, className, children, attach, ...props }: CardMaterialDrawProps) => {

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.material.type,
            item: { ...MenuTypes.material, ...attach },
            end: (item: any, monitor) => {
                if (!monitor.didDrop() && removeChildren) {
                    removeChildren(item);
                }
            },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [removeChildren],
    )

    return (
        <ShapeMaterial
            ref={drag as any}
            backgroundColor={isDragging ? "bg-gray-300" : cardMaterialItemInfo.style.color}
            outerColor={cardProcessItemInfo.style.color}
            className={`cursor-grab text-white ${isDragging ? "h-[40px]" : ""} ${className}`}
            {...props}
        >
            {isDragging ? null : children}
        </ShapeMaterial>
    )
}

export default CardMaterialDraw;