import { useDrag } from "react-dnd";
import ShapeMaterial from "../material/shape";
import { MenuTypes, cardProcessItemInfo } from "@/refactor/utils/constant";
import React from "react";

type CardProcessItemProps = React.HTMLProps<HTMLDivElement> & {
    attach?: any;
}

const CardProcessItem = ({ className, attach, children, ...props }: CardProcessItemProps) => {

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.process.type,
            item: { ...MenuTypes.process, ...attach, left: 0, top: 0 },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [],
    )

    return (
        <div ref={drag} className={`${cardProcessItemInfo.style.className} ${isDragging ? "filter grayscale" : ""} hover:opacity-70 w-full items-center cursor-grab py-2 gap-4 px-3 flex flex-col shadow ${className}`} {...props}>
            {children}
            <ShapeMaterial backgroundColor="bg-white" outerColor={cardProcessItemInfo.style.color} className="text-black text-sm h-[40px] w-full" />
        </div>
    )
}

export default CardProcessItem;