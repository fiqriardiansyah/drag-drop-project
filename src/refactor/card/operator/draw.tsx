import { RefactorContext } from "@/refactor/context/context";
import RenderEntities from "@/refactor/draw/render-entities";
import { MenuTypes, cardOperatorItemInfo, convertToStringFormat } from "@/refactor/utils/constant";
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import { operatorIcons } from "./item";

type CardOperatorDrawProps = React.HTMLProps<HTMLDivElement> & {
    attach?: any;
    asChild?: boolean;
    placement?: "child1" | "child2";
}

const DropHere = ({ colorItem }: { colorItem: any }) => {
    return (
        <div className={`${colorItem} opacity-70 text-sm w-[94%] h-[90%] absolute top-1/2 left-1/2 rounded flex items-center justify-center transform -translate-x-1/2 -translate-y-1/2 font-light`}>Drop here</div>
    )
}

const findEntity = (entities: any[], id: any) => entities?.find((entity: any) => entity?.idEntity === id);

const findEntityProcessChild1 = (entities: any[], entity: any): any => {
    if (!entity?.children) {
        const ent = findEntity(entities, entity?.child1)
        if (!ent) return entity
        return findEntityProcessChild1(entities, findEntity(entities, entity?.child1))
    }
    return findEntity(entities, entity)
};

const CardOperatorDraw = ({ className, asChild, attach, placement, children, ...props }: CardOperatorDrawProps) => {
    const { entities, setEntities } = React.useContext(RefactorContext) as any;

    const dropChildren = (data: any, placement: "child1" | "child2") => {
        setEntities((entities: any[]) => {
            if (attach?.children?.find((child: any) => child?.idEntity === data?.idEntity)) return entities;
            const idEntity = data?.idEntity || new Date().getTime();

            let tempEntities;
            if (data?.idEntity) {
                tempEntities =
                    entities?.map((ent: any) => {
                        if (ent?.idEntity !== attach?.idEntity) return ent;
                        return { ...ent, [placement]: idEntity }
                    })?.map((ent: any) => {
                        if (ent?.idEntity !== data?.idEntity) return ent;
                        return { ...ent, idEntityParent: attach?.idEntity }
                    })
            } else {
                tempEntities =
                    [...entities?.map((ent: any) => {
                        if (ent?.idEntity !== attach?.idEntity) return ent;
                        return { ...ent, [placement]: idEntity }
                    }), { idEntity, ...data, idEntityParent: attach?.idEntity }]
            }

            return tempEntities
        });
    }

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.process.type,
            item: { ...MenuTypes.process, ...attach, left: 0, top: 0 },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [attach?.left, attach?.top, attach?.idEntity, entities],
    )

    const [{ isOverChild1, colorItemChild1, canDropChild1 }, dropChild1] = useDrop(
        () => ({
            accept: [MenuTypes.process.type, MenuTypes.operator.type],
            drop(item: any, monitor) {
                dropChildren(item, "child1");
                return undefined;
            },
            canDrop(item, monitor) {
                if (attach?.child1) return false;
                return true;
            },
            collect(monitor) {
                return {
                    isOverChild1: !!monitor.isOver(),
                    colorItemChild1: monitor.getItem()?.color,
                    canDropChild1: !!monitor.canDrop(),
                }
            }
        }),
        [attach, entities],
    )

    const [{ isOverChild2, colorItemChild2, canDropChild2 }, dropChild2] = useDrop(
        () => ({
            accept: [MenuTypes.process.type, MenuTypes.operator.type],
            drop(item: any) {
                dropChildren(item, "child2");
                return undefined;
            },
            canDrop(item, monitor) {
                if (attach?.child2) return false;
                return true;
            },
            collect(monitor) {
                return {
                    isOverChild2: !!monitor.isOver(),
                    colorItemChild2: monitor.getItem()?.color,
                    canDropChild2: !!monitor.canDrop()
                }
            }
        }),
        [attach, entities],
    )

    const Icon = operatorIcons.find((icon) => icon.id === attach.data?.icon)?.icon as React.ReactNode;

    const child1 = findEntity(entities, attach?.child1);
    const child2 = findEntity(entities, attach?.child2);

    if (isDragging) return null
    return (
        <div ref={drag} style={{ left: attach?.left, top: attach?.top }} className={`${cardOperatorItemInfo.style.className} ${(isOverChild1 && canDropChild1 || isOverChild2 && canDropChild2) ? "outline outline-gray-400" : "outline outline-transparent"} ${asChild ? "border border-gray-300" : "absolute transform -translate-x-16"} min-w-[250px] font-medium text-lg hover:shadow-lg transition-shadow duration-100 cursor-grab px-3 py-2 flex gap-3 flex-col items-center ${className}`} {...props}>
            {children}
            <div className="w-full flex items-center gap-2 justify-between">
                <div ref={dropChild1} className={`min-w-[80px] min-h-[50px] rounded bg-gray-300 shadow-inner relative`}>
                    {isOverChild1 && canDropChild1 ? <DropHere colorItem={colorItemChild1} /> : null}
                    <RenderEntities placement="child1" asChild entities={child1 ? [child1] : []} />
                </div>
                <span className="text-xl">{Icon}</span>
                <div ref={dropChild2} className={`min-w-[80px] min-h-[50px] rounded bg-gray-300 shadow-inner relative`}>
                    {isOverChild2 && canDropChild2 ? <DropHere colorItem={colorItemChild2} /> : null}
                    <RenderEntities placement="child2" asChild entities={child2 ? [child2] : []} />
                </div>
            </div>
            {/* {child1 && child2 ? <p className="self-start font-light text-sm">Total: <span className="font-semibold">Rp. {convertToStringFormat(grandTotal)}</span></p> : null} */}
        </div>
    )
}

export default CardOperatorDraw;