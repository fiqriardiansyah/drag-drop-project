import React from "react";
import { useDrop } from "react-dnd";
import { v4 as uuidv4 } from 'uuid';
import { RefactorContext, changeIds } from "../context/context";
import { MenuTypes } from "../utils/constant";
import ListOption from "./list-option";
import RenderEntities from "./render-entities";
import mergeRefs from 'merge-refs';
import { BsZoomIn, BsZoomOut } from 'react-icons/bs'
import { FloatButton } from "antd";
import PinchZoom from "pinch-zoom-js";

const findEntity = (entities: any[], id: any) => entities?.find((entity: any) => entity?.idEntity === id);

const calculateEntityPrice = (entity: any, entities: any[], sequenceEntityWithPrice: any[]): any => {
    if (!entity) return {
        total: 0,
        idEntity: entity?.idEntity
    };
    if (entity?.child1 || entity?.child2) {
        const resultResolver = entity.data.resolver(
            calculateEntityPrice(findEntity(entities, entity?.child1), entities, sequenceEntityWithPrice)?.total,
            calculateEntityPrice(findEntity(entities, entity?.child2), entities, sequenceEntityWithPrice)?.total,
        );
        const total = {
            total: resultResolver,
            idEntity: entity?.idEntity
        }
        sequenceEntityWithPrice.push(total);
        return total;
    }
    const total = {
        total: entity?.children?.reduce((price: number, curr: any) => curr.data.price + price, 0) || 0,
        idEntity: entity?.idEntity
    }

    sequenceEntityWithPrice.push(total);

    return total
}

const Draw = () => {
    const { setEntities, entities, setEntitiesWithTotal, zoom, onZoomIn, onZoomOut, models, setGrandTotals } = React.useContext(RefactorContext) as any;

    const scrollContainerRef = React.useRef({ x: 0, y: 0 });
    const grabContainerRef = React.useRef({ x: 0, y: 0, top: 0, left: 0 });

    React.useEffect(() => {
        const sequenceEntityWithPrice: any[] = []
        const sequenceGrandTotals: any[] = []

        entities?.forEach((ent: any) => {
            if (!ent?.idEntityParent) {
                const res = calculateEntityPrice(ent, entities, sequenceEntityWithPrice)
                sequenceGrandTotals.push(res)
            }
        });

        setEntitiesWithTotal(sequenceEntityWithPrice);
        setGrandTotals(sequenceGrandTotals);
    }, [entities])

    const dropEntity = (data: any) => {
        if (!Object.keys(data || {}).length) return;
        setEntities((entities: any[]) => {
            if (!data?.idEntity) return [...entities, { idEntity: uuidv4(), ...data }];

            let tempEntities = [...entities];
            let tempIdEntity = data?.idEntity;

            if (data?.asType === MenuTypes.model.type) { // drop entity as model
                const modelEntities = models?.find((m: any) => m.parent?.idEntity === data?.idEntity)?.entities;
                const newEntityIds = changeIds(modelEntities);
                newEntityIds.forEach((ent: any) => {
                    if (!ent?.idEntityParent) {
                        tempIdEntity = ent?.idEntity;
                    }
                })
                tempEntities = [...tempEntities, ...newEntityIds]
            }

            return tempEntities.map((entity) => {
                if (entity?.idEntity !== tempIdEntity) return entity;
                return {
                    ...entity,
                    left: data.left,
                    top: data.top
                }
            })
        });
    }

    const dropEntityToDraw = (data: any) => {
        if (!Object.keys(data || {}).length) return;
        setEntities((entities: any[]) => {
            const removeParentIdFromEntities = entities?.map((entity: any) => {
                if (data?.idEntity !== entity?.idEntity) return entity;
                return {
                    ...data,
                    idEntityParent: null,
                }
            });
            const removeChildFromParentEntities = removeParentIdFromEntities?.map((entity: any) => {
                if (entity?.idEntity !== data?.idEntityParent) return entity;
                return {
                    ...entity,
                    child1: entity?.child1 === data?.idEntity ? null : entity?.child1,
                    child2: entity?.child2 === data?.idEntity ? null : entity?.child2,
                }
            })
            return removeChildFromParentEntities;
        });
    }

    const [, drop] = useDrop(
        () => ({
            accept: [MenuTypes.process.type, MenuTypes.operator.type, MenuTypes.model.type],
            drop(item: any, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset();
                const deltaInital = monitor.getInitialSourceClientOffset();
                if (!delta || !deltaInital) return undefined;
                const data = {
                    ...item,
                    left: Math.round(item?.left + delta?.x + deltaInital?.x) + scrollContainerRef.current.x,
                    top: Math.round(item?.top + delta?.y + deltaInital?.y) + scrollContainerRef.current.y
                }

                if (item?.idEntityParent) {
                    dropEntityToDraw(data);
                    return undefined;
                }
                dropEntity(data);
                return undefined;
            },
        }),
        [dropEntity, dropEntityToDraw],
    )

    React.useEffect(() => {
        const scrollHandler = () => {
            scrollContainerRef.current = { x: window.scrollX, y: window.scrollY }
        }
        window.document?.addEventListener('scroll', scrollHandler);

        // let ele = document.getElementById('container-draw')!
        // ele.style.cursor = 'grab';

        // const mouseMoveHandler = function (e: any) {
        //     if (!grabContainerRef.current) return;
        //     // How far the mouse has been moved
        //     const dx = e.clientX - grabContainerRef.current.x;
        //     const dy = e.clientY - grabContainerRef.current.y;

        //     const y = grabContainerRef.current.top - dy;
        //     const x = grabContainerRef.current.left - dx;

        //     console.log({ x, y })

        //     window.scrollTo(x, y)
        //     ele.scrollTo(x, y)
        // };

        // const mouseUpHandler = function () {
        //     ele.style.cursor = 'grab';
        //     ele.style.removeProperty('user-select');

        //     document.removeEventListener('mousemove', mouseMoveHandler);
        //     document.removeEventListener('mouseup', mouseUpHandler);
        // };

        // const mouseDownHandler = function (e: any) {
        //     if (!grabContainerRef.current) return;

        //     ele.style.cursor = 'grabbing';
        //     ele.style.userSelect = 'none';

        //     grabContainerRef.current = {
        //         left: ele.scrollLeft,
        //         top: ele.scrollTop,
        //         // Get the current mouse position
        //         x: e.clientX,
        //         y: e.clientY,
        //     }

        //     document.addEventListener('mousemove', mouseMoveHandler);
        //     document.addEventListener('mouseup', mouseUpHandler);
        // };

        // // Attach the handler
        // ele.addEventListener('mousedown', mouseDownHandler);

        return () => {
            window.document.removeEventListener('scroll', scrollHandler)
        }
    }, [])

    return (
        <div ref={drop} id="container-draw" className="bg-gray-300 relative w-screen h-screen">
            <ListOption />
            <RenderEntities entities={entities} />
            {/* <FloatButton.Group shape="circle" style={{ right: 24 }}>
                <FloatButton onClick={onZoomIn} icon={<BsZoomIn />} />
                <FloatButton onClick={onZoomOut} icon={<BsZoomOut />} />
            </FloatButton.Group> */}
        </div>
    )
}

export default Draw;