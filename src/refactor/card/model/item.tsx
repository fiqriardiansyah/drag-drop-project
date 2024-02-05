import { RefactorContext } from "@/refactor/context/context";
import { MenuTypes } from "@/refactor/utils/constant";
import React from "react";
import { useDrag } from "react-dnd";

type CardModelItemProps = React.HTMLProps<HTMLDivElement> & {
    attach?: any;
}

const CardModelItem = ({ className, attach, children, ...props }: CardModelItemProps) => {
    const { models } = React.useContext(RefactorContext) as any;

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.model.type,
            item: { asType: MenuTypes.model.type, ...attach, left: 0, top: 0 },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [],
    )

    return (
        <div className="">
            <span className="capitalize font-medium text-gray-500 text-sm">{props.title}</span>
            <div ref={drag} className={`${isDragging ? "filter grayscale" : ""} hover:opacity-70 w-full items-center cursor-grab gap-3 flex flex-col shadow ${className}`} {...props}>
                {children}
            </div>
        </div>
    )
}

export default CardModelItem;