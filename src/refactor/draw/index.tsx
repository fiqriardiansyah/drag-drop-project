import React from "react";
import { useDrop } from "react-dnd";
import { RefactorContext } from "../context/context";
import { MenuTypes } from "../utils/constant";
import ListOption from "./list-option";
import RenderEntities from "./render-entities";

const Draw = () => {
    const { setEntities, entities } = React.useContext(RefactorContext) as any;

    console.log(entities)

    const dropEntity = (data: any) => {
        if (!Object.keys(data || {}).length) return;
        setEntities((entities: any[]) => {
            if (!data?.idEntity) return [...entities, { idEntity: new Date().getTime(), ...data }];
            return entities.map((entity) => {
                if (entity?.idEntity !== data?.idEntity) return entity;
                return {
                    ...entity,
                    left: data.left,
                    top: data.top
                }
            })
        });
    }

    const dropEntityToDraw = (data: any) => {
        setEntities((entities: any[]) => {
            const removeParentIdFromEntity = entities?.map((entity: any) => {
                if (data?.idEntity !== entity?.idEntity) return entity;
                return {
                    ...entity,
                    idEntityParent: null,
                }
            });
            const removeChildFromParent = removeParentIdFromEntity?.map((entity: any) => {
                if (entity?.idEntity !== data?.idEntityParent) return entity;
                return {
                    ...entity,
                    child1: entity?.child1 === data?.idEntity ? null : entity?.child1,
                    child2: entity?.child2 === data?.idEntity ? null : entity?.child2,
                }
            })
            return removeChildFromParent;
        });
    }

    const [, drop] = useDrop(
        () => ({
            accept: [MenuTypes.process.type, MenuTypes.operator.type],
            drop(item: any, monitor) {
                const delta = monitor.getDifferenceFromInitialOffset();
                const deltaInital = monitor.getInitialSourceClientOffset();
                if (!delta || !deltaInital) return undefined;
                const data = {
                    ...item,
                    left: Math.round(item?.left + delta?.x + deltaInital?.x),
                    top: Math.round(item?.top + delta?.y + deltaInital?.y)
                }
                if (item?.idEntityParent) {
                    dropEntityToDraw(item);
                    return undefined;
                }
                dropEntity(data);
                return undefined;
            },
        }),
        [dropEntity],
    )

    return (
        <div ref={drop} className="bg-gray-300 h-screen w-full relative overflow-hidden">
            <ListOption />
            <RenderEntities entities={entities} />
        </div>
    )
}

export default Draw;