import React from "react";
import { MenuTypes } from "../utils/constant";
import html2canvas from "html2canvas";
import { v4 as uuidv4 } from 'uuid';

const RefactorContext = React.createContext({});

export const findEntity = (entities: any[], id: any) => entities?.find((entity: any) => entity?.idEntity === id);

const findEntityAndItsChildren = (entities: any[], entity: any, idEntities: any[]): any => {
    if (!entity) return;
    if (entity?.child1) {
        const child1 = findEntity(entities, entity?.child1);
        findEntityAndItsChildren(entities, child1, idEntities);
        if (!idEntities.includes(child1?.idEntity)) {
            idEntities.push(child1?.idEntity);
        }
    }
    if (entity?.child2) {
        const child2 = findEntity(entities, entity?.child2);
        findEntityAndItsChildren(entities, child2, idEntities);
        if (!idEntities.includes(child2?.idEntity)) {
            idEntities.push(child2?.idEntity);
        }
    }
    if (!idEntities.includes(entity?.idEntity)) {
        idEntities.push(entity?.idEntity);
    }
}

const findEntityParent = (entities: any[], entity: any, idEntities: any[]) => {
    if (!entity?.idEntityParent) return;
    if (entity?.idEntityParent) {
        findEntityParent(entities, findEntity(entities, entity?.idEntityParent), idEntities);
        idEntities.push(entity?.idEntityParent);
    }
}

export const changeIds = (entities: any[]) => {
    let tempId: any;
    let tempEntities = [...entities];
    entities?.forEach((ent) => {
        tempId = ent?.idEntity;
        const newId = uuidv4();
        tempEntities = tempEntities.map((tempEnt) => {
            return {
                ...tempEnt,
                idEntity: tempEnt?.idEntity === tempId ? newId : tempEnt?.idEntity,
                idEntityParent: tempEnt?.idEntityParent === tempId ? newId : tempEnt?.idEntityParent,
                child1: tempEnt?.child1 === tempId ? newId : tempEnt?.child1,
                child2: tempEnt?.child2 === tempId ? newId : tempEnt?.child2,
            }
        })
    })
    return tempEntities;
}

// const downloadBase64File = (contentType: any, base64Data: any, fileName: any) => {
//     const linkSource = `data:${contentType};base64,${base64Data}`;
//     const downloadLink = document.createElement("a");
//     downloadLink.href = linkSource;
//     downloadLink.download = fileName;
//     downloadLink.click();
// }

const captureEntityToImage = async (idElement: string) => {
    const element = document.querySelector(idElement);
    if (!element) return;
    const base64 = await html2canvas(element as any).then((canvas: any) => canvas.toDataURL());
    return base64
}

const RefactorProvider = ({ children }: { children: any }) => {
    const [menu, setMenu] = React.useState(MenuTypes.operator.id);
    const [entities, setEntities] = React.useState<any[]>([]);
    const [entitiesWithTotal, setEntitiesWithTotal] = React.useState<any[]>([]);
    const [grandTotals, setGrandTotals] = React.useState<any[]>([]);
    const [activeDropContainer, setActiveDropContainer] = React.useState();

    const [activeEntitiesMenu, setActiveEntitiesMenu] = React.useState<string[]>([]);
    const [activeEntity, setActiveEntity] = React.useState<any>();
    const [zoom, setZoom] = React.useState<{ width: number; height: number }>({ width: window.innerWidth, height: window.innerHeight });
    const [leftSidebar, setLeftSidebar] = React.useState(false);

    const [models, setModels] = React.useState<any[]>([]);

    const toggleLeftSidebar = () => {
        setLeftSidebar((prev) => !prev);
    }

    const saveToModel = async (entities: any[], entity: any) => {
        const tempEntities: any[] = [];

        const base64Capture = await captureEntityToImage('#entity-' + entity?.idEntity);

        findEntityAndItsChildren(entities, entity, tempEntities);
        const tempModels = entities
            ?.filter((ent: any) => tempEntities.includes(ent?.idEntity))
            ?.map((ent: any) => { // delete idEentityParent in parent model
                if (ent?.idEntity !== entity?.idEntity) return ent;
                return {
                    ...ent,
                    idEntityParent: null,
                    left: null,
                    top: null
                }
            });

        let tempIdEntity = entity?.idEntity;
        const newEntityIds = changeIds(tempModels);
        newEntityIds.forEach((ent: any) => {
            if (!ent?.idEntityParent) {
                tempIdEntity = ent?.idEntity;
            }
        })
        setModels((prev) => [...prev, { parent: { ...entity, idEntity: tempIdEntity, idEntityParent: null, top: null, left: null, preview: base64Capture }, entities: newEntityIds }]);
    }

    const clickEntityToFocus = (entity: any) => {
        const findEntityFromEntities = entities.find((ent: any) => ent?.idEntity === entity?.idEntity);
        const currentEntity = { ...entity, ...findEntityFromEntities }
        const tempIdEntities: any[] = [];

        findEntityAndItsChildren(entities, currentEntity, tempIdEntities);
        setActiveEntity(currentEntity);
        setActiveEntitiesMenu(tempIdEntities);
    }

    const clickEntityToZIndex = (entity: any) => {
        let tempIdEntities: any[] = [];
        if (entity?.idEntityParent) {
            findEntityParent(entities, entity, tempIdEntities);
            // tempIdEntities = [tempIdEntities[tempIdEntities.length - 1]];
        } else {
            tempIdEntities = [entity?.idEntity]
        }

        console.log('ID ', tempIdEntities)

        setEntities((prev) => prev?.map((ent: any) => {
            if (tempIdEntities.includes(ent?.idEntity)) return { ...ent, zIndex: 10 }
            return { ...ent, zIndex: 1 }
        }))
    }

    const deleteEntity = (entity: any) => {
        const tempEntityToDelete: any[] = [];
        findEntityAndItsChildren(entities, entity, tempEntityToDelete);
        if (tempEntityToDelete.length > 1) {
            // TODO confirm that this entity have children
        }

        setEntities((ents: any[]) =>
            ents?.filter((ent: any) => !tempEntityToDelete.includes(ent?.idEntity))
                ?.map((ent: any) => {
                    if (ent?.idEntity !== entity?.idEntityParent) return ent;
                    return {
                        ...ent,
                        child1: ent?.child1 === entity?.idEntity ? null : ent?.child1,
                        child2: ent?.child2 === entity?.idEntity ? null : ent?.child2
                    }
                })
        );
        if (activeEntity && tempEntityToDelete.includes(activeEntity?.idEntity)) {
            setActiveEntity(null);
        }
    }

    const dropOperatorChildren = (data: any, placement: "child1" | "child2", attach: any, models: any[]) => {
        setEntities((entities: any[]) => {
            if (attach?.children?.find((child: any) => child?.idEntity === data?.idEntity)) return entities;
            let tempEntities = [...entities];
            let tempIdEntity = data?.idEntity || uuidv4();

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

            if (data?.idEntity) {
                tempEntities =
                    tempEntities?.map((ent: any) => {
                        if (ent?.idEntity !== attach?.idEntity) return ent;
                        return { ...ent, [placement]: tempIdEntity }
                    })?.map((ent: any) => {
                        if (ent?.idEntity !== tempIdEntity) return ent;
                        return { ...ent, idEntityParent: attach?.idEntity }
                    })
            } else {
                tempEntities =
                    [...tempEntities?.map((ent: any) => {
                        if (ent?.idEntity !== attach?.idEntity) return ent;
                        return { ...ent, [placement]: tempIdEntity }
                    }), { idEntity: tempIdEntity, ...data, idEntityParent: attach?.idEntity }]
            }

            // move child in same parent
            if (data?.idEntityParent && data?.idEntityParent === attach?.idEntity) {
                const movedChild = tempEntities?.map((ent: any) => {
                    if (ent?.idEntity !== attach?.idEntity) return ent;
                    return {
                        ...ent,
                        [placement === "child1" ? "child2" : "child1"]: null,
                    }
                })
                return movedChild;
            }

            // move child different parent
            if (data?.idEntityParent && data?.idEntityParent !== attach?.idEntity) {
                const movedChild = tempEntities?.map((ent: any) => {
                    if (ent?.idEntity !== data?.idEntityParent) return ent;
                    return {
                        ...ent,
                        child1: ent?.child1 === tempIdEntity ? null : ent?.child1,
                        child2: ent?.child2 === tempIdEntity ? null : ent?.child2,
                    }
                });
                return movedChild
            }

            return tempEntities
        });
    }

    React.useEffect(() => {
        if (activeEntity) {
            clickEntityToFocus(activeEntity);
        }
    }, [entities]);

    React.useEffect(() => {
        const onClickAnywhere = (e: any) => {
            setActiveEntitiesMenu([]);
            setActiveEntity(null);
        }

        document.addEventListener("click", onClickAnywhere)

        return () => {
            document.removeEventListener("click", onClickAnywhere)
        }
    }, []);

    const onZoomIn = () => {
        setZoom((prev) => ({
            width: prev.width + 50,
            height: prev.height + 50
        }))
    }

    const onZoomOut = () => {
        if (zoom.width <= window.innerWidth || zoom.height <= window.innerHeight) return;
        setZoom((prev) => ({
            width: prev.width - 50,
            height: prev.height - 50
        }))
    }

    return (
        <RefactorContext.Provider value={{ leftSidebar, models, clickEntityToZIndex, saveToModel, toggleLeftSidebar, onZoomIn, onZoomOut, zoom, activeEntity, clickEntityToFocus, dropOperatorChildren, setActiveEntitiesMenu, activeEntitiesMenu, deleteEntity, grandTotals, setGrandTotals, menu, setMenu, entities, setEntities, activeDropContainer, setActiveDropContainer, entitiesWithTotal, setEntitiesWithTotal }}>
            {children}
        </RefactorContext.Provider>
    )
}

export {
    RefactorContext, RefactorProvider
};
