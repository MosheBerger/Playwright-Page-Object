export function generateName(insertText?: string) {
    return `Meby-Bot ${insertText ? insertText : ''} ${new Date().toLocaleString()}`
}
