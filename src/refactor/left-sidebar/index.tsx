import React from "react";
import { RefactorContext, findEntity } from "../context/context";
import { AnimatePresence, motion } from "framer-motion";
import { Button, Input } from "antd";
import html2canvas from "html2canvas";
import { MenuTypes, convertToStringFormat } from "../utils/constant";
import ChildProcessSpec from "./child-process-spec";
import ChildOperatorSpec from "./child-operator-spec";

const LeftSidebar = () => {
    const { leftSidebar, saveToModel, activeEntity, entities, entitiesWithTotal, setEntities, deleteEntity } = React.useContext(RefactorContext) as any;
    const entity = findEntity(entities, activeEntity?.idEntity);
    const total = entitiesWithTotal.find((item: { total: number, idEntity: number }) => item.idEntity === entity?.idEntity)?.total

    const onChangeName = (e: any) => {
        setEntities((ents: any) => {
            return ents?.map((ent: any) => {
                if (ent?.idEntity !== entity?.idEntity) return ent;
                return {
                    ...ent,
                    data: {
                        ...ent?.data,
                        text: e.target.value
                    }
                }
            })
        })
    }

    const deleteEntityHandler = () => {
        deleteEntity(entity);
    }

    const saveToModelHandler = () => {
        saveToModel(entities, entity)
    }

    return (
        <AnimatePresence>
            {activeEntity ? (
                <motion.div onClick={(e) => e.stopPropagation()} initial={{ x: '400px' }} animate={{ x: '0' }} exit={{ x: '400px' }} transition={{ duration: 0.2 }} className="h-screen p-4 w-[400px] z-[20] bg-white flex flex-col gap-4 fixed top-0 right-0">
                    <h1 className="font-light">Total: <span className="text-xl font-semibold">Rp. {convertToStringFormat(total)}</span></h1>
                    <Input value={entity?.data?.text} onChange={onChangeName} size="large" placeholder="Process Name" />
                    <div className="h-4"></div>
                    {entity?.type === MenuTypes.process.type && <ChildProcessSpec idEntity={entity?.idEntity} />}
                    {entity?.type === MenuTypes.operator.type && <ChildOperatorSpec idEntity={entity?.idEntity} />}
                    <div className="flex gap-2">
                        <Button onClick={deleteEntityHandler} danger type="primary">
                            Remove Entity
                        </Button>
                        <Button onClick={saveToModelHandler}>
                            Save to Model
                        </Button>
                    </div>
                </motion.div>
            ) : null}
        </AnimatePresence>
    )
}

export default LeftSidebar;