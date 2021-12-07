export enum KeybindingEnum {
    ARROW_DOWN = "ArrowDown",
    ARROW_UP = "ArrowUp",
    UP = "Up",
    DOWN = "Down",
    BACKSPACE = "Backspace",
    ENTER = "Enter"
}

export type KeyBinding  = keyof typeof KeybindingEnum