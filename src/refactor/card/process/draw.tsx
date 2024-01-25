import { RefactorContext } from "@/refactor/context/context";
import { MenuTypes, cardProcessItemInfo, convertToStringFormat } from "@/refactor/utils/constant";
import { motion } from 'framer-motion';
import React from "react";
import { useDrag, useDrop } from "react-dnd";
import CardMaterialDraw from "../material/draw";
import ShapeMaterial from "../material/shape";

type CardProcessDrawProps = React.HTMLProps<HTMLDivElement> & {
    attach?: any;
    asChild?: any;
    placement?: "child1" | "child2"
}

const CardProcessDraw = ({ className, attach, asChild, children, ...props }: CardProcessDrawProps) => {
    const { entities, setEntities } = React.useContext(RefactorContext) as any;

    const materials = attach?.children || []

    const dropMaterial = (data: any) => {
        setEntities((entities: any[]) => entities?.map((entity) => {
            if (entity?.idEntity !== attach?.idEntity) return entity;
            if ((entity?.children || []).find((item: any) => item.idEntity === data?.idEntity)) return entity;
            return {
                ...entity,
                children: [...(entity?.children || []), { ...data, idEntity: new Date().getTime() }]
            }
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
            accept: MenuTypes.material.type,
            drop(item: any, monitor) {
                dropMaterial(item);
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

    const sumMaterialPrice = materials?.reduce((price: number, curr: any) => curr.data.price + price, 0)

    if (isDragging) return null
    return (
        <div ref={drag} style={{ left: attach?.left, top: attach?.top }} className={`${cardProcessItemInfo.style.className}  ${isOver ? "outline outline-gray-500" : "outline outline-transparent"} ${asChild ? "border border-gray-300" : "absolute transform -translate-x-16"} min-w-[200px] hover:shadow-lg transition-shadow duration-100 w-fit items-center cursor-grab py-2 gap-4 px-3 flex flex-col ${className}`} {...props}>
            {children}
            <div ref={drop} className="flex flex-col gap-[1px] w-full">
                {materials?.map((material: any) => (
                    <motion.div whileHover={{ scale: 0.98 }} key={material.idEntity}>
                        <CardMaterialDraw removeChildren={removeChildren} attach={material}>
                            <div className="flex flex-col font-light">
                                <span>{material?.data?.text}</span>
                                <span className="text-gray-600 text-xs font-medium">Rp. {convertToStringFormat(material?.data?.price)}</span>
                            </div>
                        </CardMaterialDraw>
                    </motion.div>
                ))}
                {(isOver || !materials?.length) && <ShapeMaterial backgroundColor={`${isOver && !materials.length ? "bg-white h-[50px]" : "bg-gray-300"}`} outerColor={cardProcessItemInfo.style.color} className="transition-transform duration-75 text-black text-sm h-[40px] w-full" />}
            </div>
            {materials?.length ? <p className="self-start font-light text-sm">Total: <span className="font-semibold">Rp. {convertToStringFormat(sumMaterialPrice)}</span></p> : null}
        </div>
    )
}

export default CardProcessDraw;