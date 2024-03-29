import CardProcessItem from "@/refactor/card/process/item";
import { RefactorContext } from "@/refactor/context/context";
import { MenuTypes } from "@/refactor/utils/constant";
import { AnimatePresence } from "framer-motion";
import React from "react";

const ListProcess = () => {
    const { menu, setMenu } = React.useContext(RefactorContext) as any;

    const dummyProcess = [
        {
            id: 1,
            text: "Process",
        }
    ]

    if (menu !== MenuTypes.process.id) return null
    return (
        <AnimatePresence>
            {menu === MenuTypes.process.id ? (
                <div className="flex flex-col gap-5">
                    {dummyProcess.map((item) => (
                        <CardProcessItem key={item.id} attach={{ data: item }}>
                            {item.text}
                        </CardProcessItem>
                    ))}
                </div>
            ) : null}
        </AnimatePresence>
    )
}

export default ListProcess;