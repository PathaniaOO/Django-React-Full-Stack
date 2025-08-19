import { Listbox } from "@headlessui/react";
import {motion} from "framer-motion";
import React from 'react';

function GameDropdown({ games, selectedGame, setSelectedGame }) {
    return (
        <Listbox value={selectedGame} onChange={setSelectedGame}>
            <div className="relative mt-1">
                <ListboxButton className="relative w-full cursor-default rounded-lg border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {selectedGame ? games.find(game => game.id === selectedGame).name : "Select a game"}
                </ListboxButton>
                <ListboxOptions className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    {games.map(game => (
                        <ListboxOption key={game.id} value={game.id}>
                            {({ active, selected }) => (
                                <motion.div
                                    className={`relative cursor-default select-none py-2 pl-3 pr-9 ${active ? 'bg-indigo-600 text-white' : 'text-gray-900'}`}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.2 }}
                                >
                                    <span className={`block truncate ${selected ? 'font-semibold' : 'font-normal'}`}>
                                        {game.name}
                                    </span>
                                </motion.div>
                            )}
                        </ListboxOption>
                    ))}
                </ListboxOptions>
            </div>
        </Listbox>
    );
}

export default GameDropdown;
