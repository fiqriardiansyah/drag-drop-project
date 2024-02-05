import { MenuTypes, cardVariableItemInfo, cardProcessItemInfo } from "@/refactor/utils/constant";
import React from "react";
import { useDrag } from "react-dnd";
import ShapeMaterial from "../material/shape";

type CardVariableDrawProps = React.HTMLProps<HTMLDivElement> & {
    attach?: any;
    removeChildren?: (data: any) => void;
}

const CardVariableDraw = ({ removeChildren, className, children, attach, ...props }: CardVariableDrawProps) => {

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.variable.type,
            item: { ...MenuTypes.variable, ...attach },
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
            backgroundColor={isDragging ? "bg-gray-300" : cardVariableItemInfo.style.color}
            outerColor={cardProcessItemInfo.style.color}
            className={`cursor-grab text-white ${isDragging ? "h-[40px]" : ""} ${className}`}
            {...props}
        >
            {isDragging ? null : children}
        </ShapeMaterial>
    )
}

export default CardVariableDraw;