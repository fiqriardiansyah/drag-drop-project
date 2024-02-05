import { RefactorContext } from "@/refactor/context/context";
import { MenuTypes, cardProcessItemInfo, convertToStringFormat } from "@/refactor/utils/constant";
import { motion } from 'framer-motion';
import { v4 as uuidv4 } from 'uuid';
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import CardMaterialDraw from "../material/draw";
import ShapeMaterial from "../material/shape";
import CardVariableDraw from "../variable/draw";

type CardProcessDrawProps = React.HTMLProps<HTMLDivElement> & {
    attach?: any;
    asChild?: any;
    placement?: "child1" | "child2"
}

const CardProcessDraw = ({ className, attach, asChild, children, ...props }: CardProcessDrawProps) => {
    const { entities, setEntities, clickEntityToFocus, clickEntityToZIndex, activeEntitiesMenu, activeEntity } = React.useContext(RefactorContext) as any;

    const items = attach?.children || []

    const dropNewMaterial = (data: any) => {
        setEntities((entities: any[]) => entities?.map((entity) => {
            if (entity?.idEntity !== attach?.idEntity) return entity;
            if ((entity?.children || []).find((item: any) => item.idEntity === data?.idEntity)) return entity;
            return {
                ...entity,
                children: [...(entity?.children || []), { ...data, idEntity: uuidv4() }]
            }
        }));
    }

    const dropTransferMaterial = (data: any) => {
        if (attach?.idEntity === data?.idEntityParent) return;
        setEntities((entities: any[]) => entities?.map((entity) => {
            if (data?.idEntityParent === entity?.idEntity) {
                return {
                    ...entity,
                    children: entity?.children?.filter((child: any) => child?.idEntity !== data?.idEntity)
                }
            }
            if (attach?.idEntity === entity?.idEntity) {
                return {
                    ...entity,
                    children: [...(entity?.children || []), data]
                }
            }
            return entity;
        }));
    }

    const [{ isDragging }, drag] = useDrag(
        () => ({
            type: MenuTypes.process.type,
            item: { ...MenuTypes.process, ...attach, left: 0, top: 0 },
            collect: (monitor) => ({
                isDragging: monitor.isDragging(),
            }),
        }),
        [attach?.left, attach?.top, attach?.idEntity, attach?.materials, entities],
    )

    const [{ isOver }, drop] = useDrop(
        () => ({
            accept: [MenuTypes.material.type, MenuTypes.variable.type],
            drop(item: any, monitor) {
                if (!item?.idEntity) {
                    dropNewMaterial(item);
                    return undefined;
                }
                dropTransferMaterial(item);
                return undefined;
            },
            collect(monitor) {
                return {
                    isOver: !!monitor.isOver() && !attach.children?.find((material: any) => material.idEntity === monitor.getItem()?.idEntity)
                }
            }
        }),
        [attach, entities],
    )

    const removeChildren = (item: any) => {
        setEntities((ents: any[]) => ents?.map((ents: any) => {
            if (attach?.idEntity !== ents?.idEntity) return ents;
            return {
                ...ents,
                children: ents?.children?.filter((child: any) => child?.idEntity !== item?.idEntity)
            }
        }));
    }

    const onClick = (e: any) => {
        e.stopPropagation();
        clickEntityToFocus(attach);
        clickEntityToZIndex(attach);
    }

    const sumItemPrice = items?.reduce((price: number, curr: any) => curr.data.price + price, 0);
    const isActive = activeEntitiesMenu?.length && !activeEntitiesMenu.includes(attach?.idEntity);

    const isPartOfActive = (() => {
        if (!activeEntitiesMenu.length) return true;
        return activeEntitiesMenu.includes(attach?.idEntity);
    })()

    if (isDragging) return null
    return (
        <div id={'entity-' + attach?.idEntity} onClick={onClick} ref={drag} style={{ left: attach?.left, top: attach?.top, zIndex: attach?.zIndex }}
            className={`${!isPartOfActive ? "!bg-gray-400 !border-gray-500" : ""} border-gray-300 ${cardProcessItemInfo.style.className} ${isActive ? "z-[50]" : ""} ${activeEntity?.idEntity === attach?.idEntity ? "outline-4 outline-white outline-offset-2" : ""} ${attach?.idEntityParent ? "" : "shadow-md"} ${isOver ? "outline outline-gray-500" : "outline outline-transparent"} ${asChild ? "" : "absolute transform"} border border-gray-300 min-w-[200px] hover:shadow-lg transition-shadow duration-100 w-fit items-center cursor-pointer py-2 gap-4 px-3 flex flex-col ${className}`} {...props}>
            {children}
            <div ref={drop} className={`flex flex-col gap-[1px] w-full ${!isPartOfActive ? "grayscale" : ""}`}>
                {items?.map((item: any) => (
                    <motion.div whileHover={{ scale: 0.98 }} key={item.idEntity}>
                        {item?.type === MenuTypes.material.type ? (
                            <CardMaterialDraw removeChildren={removeChildren} attach={{ ...item, idEntityParent: attach?.idEntity }}>
                                <div className="flex flex-col font-light">
                                    <span>{item?.data?.text}</span>
                                    <span className="text-gray-600 text-xs font-medium">Rp. {convertToStringFormat(item?.data?.price)}</span>
                                </div>
                            </CardMaterialDraw>
                        ) : (
                            <CardVariableDraw removeChildren={removeChildren} attach={{ ...item, idEntityParent: attach?.idEntity }}>
                                <div className="flex flex-col font-light">
                                    <span>{item?.data?.text}</span>
                                    <span className="text-gray-600 text-xs font-medium">Rp. {convertToStringFormat(item?.data?.price)}</span>
                                </div>
                            </CardVariableDraw>
                        )}
                    </motion.div>
                ))}
                {(isOver || !items?.length) && <ShapeMaterial backgroundColor={`${isOver && !items.length ? "bg-white h-[50px]" : "bg-gray-300"}`} outerColor={cardProcessItemInfo.style.color} className="transition-transform duration-75 text-black text-sm h-[40px] w-full" />}
            </div>
            {items?.length ? <p className="self-start font-light text-sm">Total: <span className="font-semibold">Rp. {convertToStringFormat(sumItemPrice)}</span></p> : null}
        </div>
    )
}

export default CardProcessDraw;