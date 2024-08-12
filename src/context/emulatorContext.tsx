import { Emulator } from "@/lib/emulator";
import { createContext } from "react";

export const EmulatorContext = createContext<Emulator>(new Emulator());