import { MenuTypes, cardOperatorItemInfo } from "@/refactor/utils/constant";
import { useDrag } from "react-dnd";
import { HiMinus } from "react-icons/hi";
import { TiTimes } from "react-icons/ti";
import { TbPlus } from "react-icons/tb";
import React from "react";

export const plusOperator = {
    id: 1,
    icon: <TbPlus />,
    resolver: (a: any, b: any) => a + b
}

export const minusOperator = {
    id: 2,
    icon: <HiMinus />,
    resolver: (a: any, b: any) => a - b
}

export const timesOperator = {
    id: 3,
    icon: <TiTimes />,
    resolver: (a: any, b: any) => a * b
}

export const operatorIcons = [plusOperator, minusOperator, timesOperator]

const CardOperatorItem = ({ className, children, operator, attach, ...props }: any) => {

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.operator.type,
            item: { ...MenuTypes.operator, ...attach, left: 0, top: 0 },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [],
    )

    const Icon = operatorIcons.find((icon) => icon.id === attach.data.icon)?.icon as React.ReactNode;

    return (
        <div ref={drag} className={`${cardOperatorItemInfo.style.className} cursor-grab px-3 py-2 flex gap-3 flex-col items-center ${className}`} {...props}>
            {children}
            <div className="w-full flex items-center gap-2 justify-between">
                <div className="w-[50px] h-[50px] rounded bg-white" />
                <span className="text-xl">{Icon}</span>
                <div className="w-[50px] h-[50px] rounded bg-white" />
            </div>
        </div>
    )
}

export default CardOperatorItem;