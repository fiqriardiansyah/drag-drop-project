import CardModelItem from "@/refactor/card/model/item";
import { RefactorContext } from "@/refactor/context/context";
import { MenuTypes, ModelTypes } from "@/refactor/utils/constant";
import { AnimatePresence } from "framer-motion";
import React from "react";

const ListModel = () => {
    const { menu, models } = React.useContext(RefactorContext) as any;

    const modelsChildren = models?.map((model: any) => model.parent);

    if (menu !== MenuTypes.model.id) return null
    return (
        <AnimatePresence>
            {menu === MenuTypes.model.id ? (
                <div className="flex flex-col gap-5">
                    {modelsChildren?.map((model: any) => {
                        // const Icon = ModelTypes.find((m: any) => m.type === model.type)?.icon;
                        return (
                            <CardModelItem key={model.id} attach={model} title={model.data?.text}>
                                <img src={model.preview} alt={model.data?.text} />
                            </CardModelItem>
                        )
                    })}
                </div>
            ) : null}
        </AnimatePresence>
    )
}

export default ListModel;