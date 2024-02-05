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

const CardOperatorDraw = ({ className, asChild, attach, placement, children, ...props }: CardOperatorDrawProps) => {
    const { entities, clickEntityToFocus, entitiesWithTotal, clickEntityToZIndex, dropOperatorChildren, models, activeEntitiesMenu, activeEntity } = React.useContext(RefactorContext) as any;

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.operator.type,
            item: { ...MenuTypes.operator, ...attach, left: 0, top: 0 },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [attach?.left, attach?.top, attach?.idEntity, entities],
    )

    const [{ isOverChild1, colorItemChild1, canDropChild1 }, dropChild1] = useDrop(
        () => ({
            accept: [MenuTypes.process.type, MenuTypes.operator.type, MenuTypes.model.type],
            drop(item: any, monitor) {
                dropOperatorChildren(item, "child1", attach, models);
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
        [attach, entities, models],
    )

    const [{ isOverChild2, colorItemChild2, canDropChild2 }, dropChild2] = useDrop(
        () => ({
            accept: [MenuTypes.process.type, MenuTypes.operator.type, MenuTypes.model.type],
            drop(item: any) {
                dropOperatorChildren(item, "child2", attach, models);
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
        [attach, entities, models],
    )

    const Icon = operatorIcons.find((icon) => icon.id === attach.data?.icon)?.icon as React.ReactNode;

    const child1 = findEntity(entities, attach?.child1);
    const child2 = findEntity(entities, attach?.child2);

    const grandTotal = entitiesWithTotal?.find((ent: any) => ent?.idEntity === attach?.idEntity)?.total
    const isPartOfActive = (() => {
        if (!activeEntitiesMenu.length) return true;
        return activeEntitiesMenu.includes(attach?.idEntity);
    })()

    const onClick = (e: any) => {
        e.stopPropagation();
        clickEntityToFocus(attach);
        clickEntityToZIndex(attach);
    }

    if (isDragging) return <div />
    return (
        <div id={'entity-' + attach?.idEntity} onClick={onClick} ref={drag} style={{ left: attach?.left, top: attach?.top, zIndex: attach?.zIndex }}
            className={`${!isPartOfActive ? "!bg-gray-400 !border-gray-500" : ""} ${cardOperatorItemInfo.style.className} ${attach?.idEntityParent ? "" : "shadow-md"} ${(isOverChild1 && canDropChild1 || isOverChild2 && canDropChild2) ? "outline outline-gray-400" : "outline outline-transparent"} ${activeEntity?.idEntity === attach?.idEntity ? "outline-4 outline-white outline-offset-2" : ""} ${asChild ? "" : "absolute transform"} border border-gray-300 min-w-[250px] font-medium text-lg hover:shadow-lg transition-shadow duration-100 cursor-pointer px-3 py-2 flex gap-3 flex-col items-center ${className}`} {...props}>
            <>
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
                {!isNaN(grandTotal) ? <p className="self-start font-light text-sm">Total: <span className="font-semibold">Rp. {convertToStringFormat(grandTotal)}</span></p> : null}
            </>
        </div>
    )
}

export default CardOperatorDraw;